import z from "zod";
import { buildMakeImagePayload } from "../../apis/types.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";
import {
  makeImageV1Parameters,
  type TaskResult,
  taskResultSchema,
} from "../schema.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

/**
 * 捏捏模型 - 奇遇任务模式
 * entrance: PICTURE,VERSE
 * context_model_series: 8_image_edit
 * 特点：支持复杂场景、多提示词、角色引用、继承参数，生成质量更高但速度较慢
 */
export const makeImageNienie = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeImageV1Parameters,
    outputSchema: taskResultSchema,
  },
  async ({ prompt, aspect }, { log, apis, _meta, sendNotification }) => {
    const createTask = async () => {
      const vtokens = (await apis.prompt.parseVtokens(prompt)) ?? [];

      const payload = buildMakeImagePayload(
        vtokens ?? [],
        {
          make_image_aspect: aspect ?? "3:4",
          context_model_series: "8_image_edit", // 捏捏模型：使用 8_image_edit 模型系列
          entrance_uuid: _meta?.entrance_uuid,
          toolcall_uuid: _meta?.toolcall_uuid,
        },
        {
          collection_uuid: _meta?.inherit?.collection_uuid,
          picture_uuid: _meta?.inherit?.picture_uuid,
        },
      );

      // 覆盖 entrance 为 PICTURE,VERSE（捏捏模式）
      payload.meta.entrance = "PICTURE,VERSE";

      log.info("make_image_nienie: payload: %o", payload);
      return await apis.artifact.makeImage(payload);
    };

    const task_uuid = await createTask();
    log.info("make_image_nienie: task: %s", task_uuid);

    const startTime = Date.now();
    const duration = 120 * 1000; // 捏捏模型需要更长时间
    const timeout = 120 * 1000 * 10;
    const res = await polling(
      () => apis.artifact.task(task_uuid),
      async (result) => {
        await sendNotification({
          method: "notifications/progress",
          params: {
            progressToken: _meta?.progressToken ?? task_uuid,
            progress: Math.min(
              Number(((Date.now() - startTime) / duration).toFixed(2)),
              1,
            ),
            total: 1,
            message: `${task_uuid} - ${result.task_status}`,
          },
        });
        log.debug("make_image_nienie: polling: %o", result);
        return (
          result.task_status !== "PENDING" &&
          result.task_status !== "MODERATION"
        );
      },
      2000,
      timeout,
    );

    if (res.isTimeout) {
      const structuredContent = {
        task_uuid,
        task_status: "TIMEOUT",
        artifacts: [],
      } satisfies TaskResult;

      log.info("make_image_nienie: timeout: %o", structuredContent);
      return structuredContent;
    }

    const structuredContent = res.result;
    log.info("make_image_nienie: result: %o", structuredContent);

    return structuredContent;
  },
);

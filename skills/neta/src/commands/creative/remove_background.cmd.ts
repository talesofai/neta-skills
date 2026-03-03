import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";
import { removeBackgroundV1Parameters, taskResultSchema } from "../schema.ts";

const meta = parseMeta(
  z.object({
    remove_background: z.object({
      name: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    remove_background_nocrop: z.object({
      name: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  }),
  import.meta,
);

export const removeBackground = createCommand(
  {
    name: meta.remove_background.name,
    title: meta.remove_background.title,
    description: meta.remove_background.description,
    inputSchema: removeBackgroundV1Parameters,
    outputSchema: taskResultSchema,
  },
  async ({ input_image }, { apis, _meta, log, sendNotification }) => {
    const createTask = async () => {
      return apis.artifact.postProcess(input_image, "0_null/抠图SEG", {
        entrance: "PICTURE,PURE,VERSE",
        entrance_uuid: _meta?.entrance_uuid,
        toolcall_uuid: _meta?.toolcall_uuid,
      });
    };

    const task_uuid = await createTask();
    log.info("remove_background: task: %s", task_uuid);

    const startTime = Date.now();
    const duration = 60 * 1000;
    const timeout = 60 * 1000 * 5;
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
        log.debug("remove_background: polling: %o", result);
        return (
          result.task_status !== "PENDING" &&
          result.task_status !== "MODERATION"
        );
      },
      2000,
      timeout,
    );

    if (res.isTimeout) {
      return {
        task_uuid,
        task_status: "TIMEOUT",
        artifacts: [],
      };
    }

    const structuredContent = res.result;
    log.info("remove_background: result: %o", structuredContent);
    return structuredContent;
  },
);

export const removeBackgroundNoCrop = createCommand(
  {
    name: meta.remove_background_nocrop.name,
    title: meta.remove_background_nocrop.title,
    description: meta.remove_background_nocrop.description,
    inputSchema: removeBackgroundV1Parameters,
    outputSchema: taskResultSchema,
  },
  async ({ input_image }, { apis, _meta, log }) => {
    const createTask = async () => {
      return apis.artifact.postProcess(input_image, "0_null/抠图SEG", {
        entrance: "PICTURE,PURE,VERSE",
        entrance_uuid: _meta?.entrance_uuid,

        toolcall_uuid: _meta?.toolcall_uuid,
      });
    };

    const task_uuid = await createTask();
    log.info("remove_background: task: %s", task_uuid);

    const res = await polling(
      () => apis.artifact.task(task_uuid),
      (result) => {
        log.debug("remove_background: polling: %o", result);
        return (
          result.task_status !== "PENDING" &&
          result.task_status !== "MODERATION"
        );
      },
      2000,
      60 * 1000 * 10,
    );

    if (res.isTimeout) {
      return {
        task_uuid,
        task_status: "TIMEOUT",
        artifacts: [],
      };
    }

    const structuredContent = res.result;
    log.info("remove_background: result: %o", structuredContent);

    return structuredContent;
  },
);

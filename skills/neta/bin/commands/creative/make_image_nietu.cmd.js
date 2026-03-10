import z from "zod";
import { buildMakeImagePayload } from "../../apis/types.js";
import { parseMeta } from "../../utils/parse_meta.js";
import { polling } from "../../utils/polling.js";
import { createCommand } from "../factory.js";
import { makeImageV1Parameters, taskResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
/**
 * 捏图模型 - 标准文生图模式
 * entrance: PICTURE,PURE
 * context_model_series: null (默认模型)
 * 特点：快速、简单，适合单图生成
 */
export const makeImageNietu = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeImageV1Parameters,
    outputSchema: taskResultSchema,
}, async ({ prompt, aspect }, { log, apis, _meta, sendNotification }) => {
    const createTask = async () => {
        const vtokens = (await apis.prompt.parseVtokens(prompt)) ?? [];
        const payload = buildMakeImagePayload(vtokens ?? [], {
            make_image_aspect: aspect ?? "3:4",
            context_model_series: null, // 捏图模型：不使用特定模型系列
            entrance_uuid: _meta?.entrance_uuid,
            toolcall_uuid: _meta?.toolcall_uuid,
        }, {
            collection_uuid: _meta?.inherit?.collection_uuid,
            picture_uuid: _meta?.inherit?.picture_uuid,
        });
        // 覆盖 entrance 为 PICTURE,PURE（捏图模式）
        payload.meta.entrance = "PICTURE,PURE";
        log.info("make_image_nietu: payload: %o", payload);
        return await apis.artifact.makeImage(payload);
    };
    const task_uuid = await createTask();
    log.info("make_image_nietu: task: %s", task_uuid);
    const startTime = Date.now();
    const duration = 60 * 1000;
    const timeout = 60 * 1000 * 10;
    const res = await polling(() => apis.artifact.task(task_uuid), async (result) => {
        await sendNotification({
            method: "notifications/progress",
            params: {
                progressToken: _meta?.progressToken ?? task_uuid,
                progress: Math.min(Number(((Date.now() - startTime) / duration).toFixed(2)), 1),
                total: 1,
                message: `${task_uuid} - ${result.task_status}`,
            },
        });
        log.debug("make_image_nietu: polling: %o", result);
        return (result.task_status !== "PENDING" &&
            result.task_status !== "MODERATION");
    }, 2000, timeout);
    if (res.isTimeout) {
        const structuredContent = {
            task_uuid,
            task_status: "TIMEOUT",
            artifacts: [],
        };
        log.info("make_image_nietu: timeout: %o", structuredContent);
        return structuredContent;
    }
    const structuredContent = res.result;
    log.info("make_image_nietu: result: %o", structuredContent);
    return structuredContent;
});

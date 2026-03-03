import z from "zod";
import { buildMakeVideoPayload } from "../../apis/types.js";
import { parseMeta } from "../../utils/parse_meta.js";
import { polling } from "../../utils/polling.js";
import { createCommand } from "../factory.js";
import { makeVideoV1Parameters, taskResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const makeVideo = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeVideoV1Parameters,
    outputSchema: taskResultSchema,
}, async ({ image_source, prompt, model }, { log, apis, _meta, sendNotification }) => {
    const MODEL_MAPPING = {
        model_s: "volc_seedance_fast_i2v_upscale",
        model_w: "wan26",
    };
    const work_flow_model = MODEL_MAPPING[model];
    const createTask = async () => {
        const payload = buildMakeVideoPayload(image_source, prompt, work_flow_model, {
            entrance_uuid: _meta?.entrance_uuid,
            toolcall_uuid: _meta?.toolcall_uuid,
            inherit_params: {
                collection_uuid: _meta?.inherit?.collection_uuid,
                picture_uuid: _meta?.inherit?.picture_uuid,
            },
        });
        log.info("make_video: payload: %o", payload);
        return await apis.artifact.makeVideo(payload);
    };
    const task_uuid = await createTask();
    log.info("make_video: task: %s", task_uuid);
    const startTime = Date.now();
    const duration = 60 * 1000;
    const timeout = 60 * 1000 * 20;
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
        log.debug("make_video: polling: %o", result);
        return (result.task_status !== "PENDING" &&
            result.task_status !== "MODERATION");
    }, 2000, timeout);
    if (res.isTimeout) {
        const structuredContent = {
            task_uuid,
            task_status: "TIMEOUT",
            artifacts: [],
        };
        log.info("make_video: timeout: %o", structuredContent);
        return structuredContent;
    }
    const structuredContent = res.result;
    log.info("make_video: result: %o", structuredContent);
    return structuredContent;
});

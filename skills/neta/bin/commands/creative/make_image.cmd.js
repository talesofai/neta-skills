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
export const makeImage = createCommand({
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
            context_model_series: "8_image_edit",
            entrance_uuid: _meta?.entrance_uuid,
            toolcall_uuid: _meta?.toolcall_uuid,
        }, {
            collection_uuid: _meta?.inherit?.collection_uuid,
            picture_uuid: _meta?.inherit?.picture_uuid,
        });
        log.info("make_image: payload: %o", payload);
        return await apis.artifact.makeImage(payload);
    };
    const task_uuid = await createTask();
    log.info("make_image: task: %s", task_uuid);
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
        log.debug("make_image: polling: %o", result);
        return (result.task_status !== "PENDING" &&
            result.task_status !== "MODERATION");
    }, 2000, timeout);
    if (res.isTimeout) {
        const structuredContent = {
            task_uuid,
            task_status: "TIMEOUT",
            artifacts: [],
        };
        log.info("task: timeout: %o", structuredContent);
        return structuredContent;
    }
    const structuredContent = res.result;
    log.info("make_image: result: %o", structuredContent);
    return structuredContent;
});

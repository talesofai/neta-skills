import { Type } from "@sinclair/typebox";
import { buildMakeVideoPayload } from "../../apis/types.js";
import { parseMeta } from "../../utils/parse_meta.js";
import { polling } from "../../utils/polling.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        image_source: Type.String(),
        prompt: Type.String(),
        model: Type.String(),
    }),
}), import.meta);
const makeVideoV1Parameters = Type.Object({
    image_source: Type.String({ description: meta.parameters.image_source }),
    prompt: Type.String({ description: meta.parameters.prompt }),
    model: Type.Union([Type.Literal("model_s"), Type.Literal("model_w")], {
        description: meta.parameters.model,
    }),
});
export const makeVideo = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeVideoV1Parameters,
}, async ({ image_source, prompt, model }, { log, apis }) => {
    const MODEL_MAPPING = {
        model_s: "volc_seedance_fast_i2v_upscale",
        model_w: "wan26",
    };
    const work_flow_model = MODEL_MAPPING[model];
    const createTask = async () => {
        const payload = buildMakeVideoPayload(image_source, prompt, work_flow_model);
        return await apis.artifact.makeVideo(payload);
    };
    const task_uuid = await createTask();
    log.debug("task: %s", task_uuid);
    const timeout = 60 * 1000 * 20;
    const res = await polling(() => apis.artifact.task(task_uuid), async (result) => {
        log.debug("polling: %o", result);
        return (result.task_status !== "PENDING" &&
            result.task_status !== "MODERATION");
    }, 2000, timeout);
    if (res.isTimeout) {
        return {
            task_uuid,
            task_status: "TIMEOUT",
            artifacts: [],
        };
    }
    return res.result;
});

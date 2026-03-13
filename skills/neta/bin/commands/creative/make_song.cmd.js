import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { polling } from "../../utils/polling.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        prompt: Type.String(),
        lyrics: Type.String(),
    }),
}), import.meta);
const makeSongV1Parameters = Type.Object({
    prompt: Type.String({
        minLength: 10,
        maxLength: 2000,
        description: meta.parameters.prompt,
    }),
    lyrics: Type.String({
        minLength: 10,
        maxLength: 3500,
        description: meta.parameters.lyrics,
    }),
});
export const makeSong = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeSongV1Parameters,
}, async ({ prompt, lyrics }, { apis, log }) => {
    const createTask = async () => {
        return apis.artifact.makeSong(prompt, lyrics, {
            entrance: "SONG,VERSE",
        });
    };
    const task_uuid = await createTask();
    log.debug("task: %s", task_uuid);
    const timeout = 60 * 1000 * 5;
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

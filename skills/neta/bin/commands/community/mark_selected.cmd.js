import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        hashtag: z.string(),
        story_uuid: z.string(),
    }),
}), import.meta);
export const markSelected = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        hashtag: z.string().describe(meta.parameters.hashtag),
        story_uuid: z.string().describe(meta.parameters.story_uuid),
    }),
}, async ({ hashtag, story_uuid }, { log, apis }) => {
    log.debug("mark_selected: hashtag: %s, story_uuid: %s", hashtag, story_uuid);
    const result = await apis.hashtag.markStoryAsReviewed(hashtag, story_uuid);
    return {
        success: result.message === "success",
        message: result.message,
        hashtag: hashtag,
        story_uuid: story_uuid,
    };
});

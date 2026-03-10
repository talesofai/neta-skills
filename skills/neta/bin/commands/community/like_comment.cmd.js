import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        comment_uuid: z.string(),
        like: z.boolean(),
    }),
}), import.meta);
export const likeComment = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        comment_uuid: z.string().describe(meta.parameters.comment_uuid),
        like: z.boolean().describe(meta.parameters.like),
    }),
}, async ({ comment_uuid, like }, { log, apis }) => {
    log.debug("like_comment: comment_uuid: %s, like: %s", String(comment_uuid), String(like));
    const result = await apis.comment.toggleLike(comment_uuid, like);
    return {
        success: result.success,
        comment_uuid: comment_uuid,
        liked: like,
    };
});

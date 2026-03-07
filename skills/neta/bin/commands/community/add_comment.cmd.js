import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        collection_uuid: z.string(),
        content: z.string(),
        parent_comment_uuid: z.string().optional(),
    }),
}), import.meta);
export const addComment = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        collection_uuid: z.string().describe(meta.parameters.collection_uuid),
        content: z.string().describe(meta.parameters.content),
        parent_comment_uuid: z.string().optional().describe(meta.parameters.parent_comment_uuid ?? ""),
    }),
}, async ({ collection_uuid, content, parent_comment_uuid }, { log, apis }) => {
    const parentUuid = parent_comment_uuid ?? "none";
    log.debug("add_comment: collection_uuid: %s, content: %s, parent: %s", String(collection_uuid), String(content), parentUuid);
    const result = await apis.comment.createComment({
        collection_uuid,
        content,
        ...(parent_comment_uuid ? { parent_comment_uuid } : {}),
    });
    return {
        success: result.success,
        comment: {
            uuid: result.comment.uuid,
            content: result.comment.content,
            ctime: result.comment.ctime,
            user: {
                nick_name: result.comment.user.nick_name,
                avatar_url: result.comment.user.avatar_url,
            },
            parent_comment_uuid: result.comment.parent_comment_uuid,
        },
    };
});

import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";

const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);

export const createComment = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        collection_uuid: z.string().describe("要评论的合集 UUID"),
        content: z.string().describe("评论内容"),
        reply_to_comment_uuid: z.string().optional().describe("回复的评论 UUID（可选，回复评论时需要）"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        comment_uuid: z.string().optional(),
        message: z.string(),
    }),
}, async ({ collection_uuid, content, reply_to_comment_uuid }, { log, apis }) => {
    log.debug("create_comment: collection_uuid: %s, content: %s, reply_to: %s", 
        collection_uuid, content, reply_to_comment_uuid || "none");

    try {
        const payload = {
            storyId: collection_uuid,
            content,
            reply_to_comment_uuid: reply_to_comment_uuid || null,
        };

        const result = await apis.comment.createComment(payload);
        
        log.debug("create_comment: success, comment_uuid: %s", result?.comment_uuid);

        return {
            success: true,
            comment_uuid: result?.comment_uuid,
            message: reply_to_comment_uuid ? "回复评论成功" : "发表评论成功",
        };
    } catch (error) {
        log.error("create_comment failed:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "发表评论失败",
        };
    }
});

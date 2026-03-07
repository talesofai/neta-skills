import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";

const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);

export const getComments = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        collection_uuid: z.string().describe("合集 UUID"),
        cursor: z.string().optional().describe("分页游标（可选）"),
        page_size: z.number().default(20).describe("每页数量，默认 20"),
    }),
    outputSchema: z.object({
        total: z.number().optional(),
        cursor: z.string().optional(),
        has_more: z.boolean(),
        list: z.array(z.object({
            comment_uuid: z.string(),
            content: z.string(),
            user_nick_name: z.string(),
            user_avatar: z.string().optional(),
            like_count: z.number(),
            reply_count: z.number(),
            ctime: z.string(),
            is_liked: z.boolean(),
        })),
    }),
}, async ({ collection_uuid, cursor, page_size = 20 }, { log, apis }) => {
    log.debug("get_comments: collection_uuid: %s, cursor: %s, page_size: %d", 
        collection_uuid, cursor || "none", page_size);

    try {
        const result = await apis.comment.getComments(collection_uuid, {
            cursor,
            page_size,
        });
        
        log.debug("get_comments: success, got %d comments", result?.comments?.length || 0);

        const simplifiedList = (result?.comments || []).map((comment) => ({
            comment_uuid: comment.comment_uuid,
            content: comment.content,
            user_nick_name: comment.user_nick_name,
            user_avatar: comment.user_avatar,
            like_count: comment.like_count,
            reply_count: comment.reply_count,
            ctime: comment.ctime,
            is_liked: comment.is_liked,
        }));

        return {
            total: result?.total,
            cursor: result?.cursor,
            has_more: result?.has_more || false,
            list: simplifiedList,
        };
    } catch (error) {
        log.error("get_comments failed:", error);
        return {
            total: 0,
            cursor: null,
            has_more: false,
            list: [],
        };
    }
});

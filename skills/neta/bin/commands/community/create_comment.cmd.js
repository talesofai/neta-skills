import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const createCommentCmd = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        content: z
            .string()
            .min(1)
            .max(500),
        parent_uuid: z
            .string(),
        parent_type: z
            .enum(["collection"]),
        at_users: z
            .string()
            .optional()
            .default("")
    }),
    outputSchema: z.object({
        success: z.boolean(),
        comment_uuid: z.string().optional(),
        message: z.string(),
    }),
}, async ({ content, parent_uuid, parent_type, at_users }, { apis, log }) => {
    log.debug("create_comment: content: %s, parent_uuid: %s, parent_type: %s, at_users: %s", content, parent_uuid, parent_type, at_users);
    // 将逗号分隔的字符串转换为数组
    const atUsersArray = at_users
        ? at_users
            .split(",")
            .map((uuid) => uuid.trim())
            .filter(Boolean)
        : [];
    const result = await apis.collection.createComment({
        content,
        parent_uuid,
        parent_type,
        at_users: atUsersArray,
    });
    if (!result.success) {
        throw new Error("create_comment fail");
    }
    return {
        success: true,
        comment_uuid: result.comment?.uuid,
        message: "create_comment success",
    };
});

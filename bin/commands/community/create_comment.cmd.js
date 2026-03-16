import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
export const createCommentCmd = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
        content: Type.String({ minLength: 1, maxLength: 500 }),
        parent_uuid: Type.String(),
        parent_type: Type.Union([Type.Literal("collection")]),
        at_users: Type.String({ default: "" }),
    }),
}, async ({ content, parent_uuid, parent_type, at_users }, { apis }) => {
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

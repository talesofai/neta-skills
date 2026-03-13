import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const suggestTagsV1Parameters = Type.Object({
    keyword: Type.String({ minLength: 1 }),
    size: Type.Integer({ minimum: 1, maximum: 50, default: 10 }),
});
export const suggestTags = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestTagsV1Parameters,
}, async ({ keyword, size }, { apis }) => {
    const result = await apis.recsys.suggestTags({
        keyword,
        size,
    });
    return {
        suggestions: result.suggestions || [],
    };
});

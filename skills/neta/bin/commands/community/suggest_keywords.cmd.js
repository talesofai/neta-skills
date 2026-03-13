import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const suggestKeywordsV1Parameters = Type.Object({
    prefix: Type.String({ minLength: 1 }),
    size: Type.Integer({ minimum: 1, maximum: 50, default: 10 }),
});
export const suggestKeywords = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestKeywordsV1Parameters,
}, async ({ prefix, size }, { apis }) => {
    const result = await apis.recsys.suggestKeywords({
        prefix,
        size,
    });
    return {
        suggestions: result.suggestions || [],
    };
});

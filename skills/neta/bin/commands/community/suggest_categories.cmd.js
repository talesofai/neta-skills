import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const suggestCategoriesV1Parameters = Type.Object({
    level: Type.Integer({ minimum: 1, maximum: 5, default: 1 }),
    parent_path: Type.Optional(Type.String()),
});
export const suggestCategories = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestCategoriesV1Parameters,
}, async ({ level, parent_path }, { apis }) => {
    const result = await apis.recsys.suggestCategories({
        level,
        parent_path,
    });
    return {
        suggestions: result.suggestions || [],
    };
});

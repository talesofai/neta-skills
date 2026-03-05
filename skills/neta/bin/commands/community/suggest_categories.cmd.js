import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
import { suggestCategoriesV1Parameters, suggestCategoriesV1ResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const suggestCategories = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestCategoriesV1Parameters,
    outputSchema: suggestCategoriesV1ResultSchema,
}, async ({ level, parent_path }, { log, apis }) => {
    log.debug("suggest_categories: level: %d, parent_path: %s", level, parent_path || "");
    const result = await apis.recsys.suggestCategories({
        level,
        parent_path,
    });
    return {
        suggestions: result.suggestions || [],
    };
});

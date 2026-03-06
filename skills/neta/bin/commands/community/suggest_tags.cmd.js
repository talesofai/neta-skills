import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
import { suggestTagsV1Parameters, suggestTagsV1ResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const suggestTags = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestTagsV1Parameters,
    outputSchema: suggestTagsV1ResultSchema,
}, async ({ keyword, size }, { log, apis }) => {
    log.debug("suggest_tags: keyword: %s, size: %d", keyword, size);
    const result = await apis.recsys.suggestTags({
        keyword,
        size,
    });
    return {
        suggestions: result.suggestions || [],
    };
});

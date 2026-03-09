import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        domain_name: z.string(),
    }),
}), import.meta);
export const getFullPromptTags = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        domain_name: z.string().describe("提示词域，例如：APP/单图/图生图"),
    }),
}, async ({ domain_name }, { log, apis }) => {
    log.debug("get_full_prompt_tags: domain_name: %s", domain_name);
    const result = await apis.prompt.img2imgModes();
    return {
        domain_name,
        tags: result.map((tag) => ({
            uuid: tag.uuid,
            name: tag.name,
            type: tag.type,
            value: tag.value,
            extra_value: tag.extra_value,
        })),
    };
});

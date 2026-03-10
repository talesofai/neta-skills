import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getConfig = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        namespace: z.string().describe("配置命名空间（如：verse, litellm, frontend/generate 等）"),
        key: z.string().describe("配置键（如：generate_verse, chat_presets, MAKE_COUNT 等）"),
    }),
}, async (input, { apis }) => {
    const result = await apis.config.getConfig(input);
    return {
        success: true,
        data: result,
    };
});

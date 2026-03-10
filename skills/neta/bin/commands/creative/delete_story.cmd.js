import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const deleteStory = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        uuid: z.string().describe("故事/合集 UUID"),
    }),
}, async (input, { apis }) => {
    const result = await apis.story.deleteStory(input);
    return {
        success: true,
        data: result,
    };
});

import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getFeed = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        page_index: z.number().optional().default(0).describe("页码（从 0 开始）"),
        page_size: z.number().optional().default(3).describe("每页数量"),
        is_new_user: z.boolean().optional().default(false).describe("是否新用户"),
        collection_uuid: z.string().optional().describe("合集 UUID（用于追踪）"),
    }),
}, async (input, { apis }) => {
    const result = await apis.home.getFeed(input);
    return {
        success: true,
        data: result,
    };
});

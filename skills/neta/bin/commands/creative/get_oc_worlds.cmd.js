import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getOCWorlds = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({}),
}, async (_, { apis }) => {
    const result = await apis.user.getOCWorlds();
    return {
        success: true,
        data: {
            count: result.length,
            worlds: result.map((w) => ({
                uuid: w.uuid,
                name: w.name,
                description: w.description,
                cover_url: w.cover_url,
                character_count: w.character_count,
                ctime: w.ctime,
            })),
        },
    };
});

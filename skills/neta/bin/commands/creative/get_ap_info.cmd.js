import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getApInfo = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({}),
}, async (_, { apis }) => {
    const result = await apis.user.getApInfo();
    return {
        success: true,
        data: {
            ap: result?.ap,
            temp_ap: result?.temp_ap,
            ap_limit: result?.ap_limit,
            unlimited_until: result?.unlimited_until,
            true_unlimited_until: result?.true_unlimited_until,
        },
    };
});

import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getCheckinStatus = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({}),
}, async (_, { apis }) => {
    const result = await apis.user.getCheckinStatus();
    return {
        success: true,
        data: {
            today_signed: result.today_signed,
            streak_count: result.streak_count,
            cycle_day: result.cycle_day,
            cycle_signed_history: result.cycle_signed_history,
            reward_list: result.reward_list,
        },
    };
});

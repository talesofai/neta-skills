import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";

const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        uuid: z.string(),
    }),
}), import.meta);

export const getUserInfo = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        uuid: z.string().describe(meta.parameters.uuid),
    }),
}, async ({ uuid }, { apis }) => {
    const result = await apis.user.getUserInfo(uuid);
    
    if (!result) {
        return {
            success: false,
            error: "未获取到用户信息",
        };
    }
    
    return {
        success: true,
        data: {
            id: result.id,
            uuid: result.uuid,
            nick_name: result.nick_name,
            phone_num: result.phone_num,
            total_subscribes: result.total_subscribes,
            total_fans: result.total_fans,
            total_collections: result.total_collections,
            total_likes: result.total_likes,
            total_same_style: result.total_same_style,
            is_internal: result.is_internal,
            vip_level: result.properties?.vip_level ?? null,
            vip_until: result.properties?.vip_until ?? null,
            badges: result.badges ?? [],
        },
    };
});

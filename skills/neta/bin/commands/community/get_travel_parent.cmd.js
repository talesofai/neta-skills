import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        user_uuid: z.string(),
        parent_type: z.string(),
        page_index: z.string().optional(),
        page_size: z.string().optional(),
    }),
}), import.meta);
export const getTravelParent = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        user_uuid: z.string().describe(meta.parameters.user_uuid),
        parent_type: z
            .enum(["oc", "elementum"])
            .describe("parent_type: oc=角色，elementum=元素"),
        page_index: z.number().optional().default(0).describe("页码，从 0 开始"),
        page_size: z.number().optional().default(20).describe("每页数量，最大 100"),
    }),
}, async ({ user_uuid, parent_type, page_index = 0, page_size = 20 }, { log, apis }) => {
    log.debug("get_travel_parent: user_uuid: %s, parent_type: %s, page_index: %d, page_size: %d", user_uuid, parent_type, page_index, page_size);
    const result = await apis.tcp.getTravelParent({
        user_uuid,
        parent_type,
        page_index,
        page_size,
    });
    return {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        list: result.list.map((item) => ({
            uuid: item.uuid,
            type: item.type,
            name: item.name,
            short_name: item.short_name,
            status: item.status,
            accessibility: item.accessibility,
            avatar_img: item.config.avatar_img,
            header_img: item.config.header_img,
            is_favored: item.is_favored,
            is_used: item.is_used,
            heat_score: item.heat_score,
            ctime: item.ctime,
            mtime: item.mtime,
            review_status: item.review_status,
        })),
    };
});

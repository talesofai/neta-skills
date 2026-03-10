import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getSubscribeList = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        page_index: z.number().default(0).describe("页码（从 0 开始）"),
        page_size: z.number().default(20).describe("每页数量（默认 20）"),
    }),
}, async (input, { apis }) => {
    const result = await apis.user.getSubscribeList(input.page_index, input.page_size);
    return {
        success: true,
        data: {
            total: result?.total,
            page_index: result?.page_index,
            page_size: result?.page_size,
            has_next: result?.has_next,
            list: result?.list?.map((item) => ({
                uuid: item.uuid,
                nick_name: item.nick_name,
                avatar_url: item.avatar_url,
                subscribe_status: item.subscribe_status,
                total_subscribes: item.total_subscribes,
                total_fans: item.total_fans,
                total_likes: item.total_likes,
                total_collections: item.total_collections,
            })),
        },
    };
});

import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
export const getSubscribeListCmd = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
        page_index: Type.Integer({ minimum: 0, default: 0 }),
        page_size: Type.Integer({ minimum: 1, maximum: 50, default: 20 }),
    }),
}, async ({ page_index, page_size }, { apis }) => {
    const result = await apis.user.getSubscribeList({
        page_index,
        page_size,
    });
    return {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        list: result.list.map((user) => ({
            uuid: user.uuid,
            name: user.name,
            avatar_url: user.avatar_url,
            total_fans: user.total_fans,
            total_collections: user.total_collections,
            subscribe_status: user.subscribe_status,
        })),
        has_next: result.has_next,
    };
});

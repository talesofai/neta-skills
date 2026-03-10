import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
const getFavorListV1Parameters = z.object({
    /** 角色类型：character（角色）/ elementum（元素）/ both（两者） */
    parent_type: z.enum(["character", "elementum", "both"]).optional().default("both"),
    /** 页码（从 0 开始） */
    page_index: z.number().optional().default(0),
    /** 每页数量（默认 20） */
    page_size: z.number().optional().default(20),
});
const getFavorListV1ResultSchema = z.object({
    total: z.number(),
    page_index: z.number(),
    page_size: z.number(),
    list: z.array(z.object({
        uuid: z.string(),
        type: z.enum(["character", "elementum"]),
        name: z.string(),
        avatar_img: z.string().nullable(),
        header_img: z.string().nullable(),
        favor_ctime: z.string(),
        folder_id: z.number().nullable(),
    })),
});
export const getFavorList = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: getFavorListV1Parameters,
    outputSchema: getFavorListV1ResultSchema,
}, async ({ parent_type, page_index, page_size }, { log, apis }) => {
    log.debug("get_favor_list: parent_type: %s, page_index: %d, page_size: %d", parent_type, page_index, page_size);
    const apiParentType = parent_type === "both" ? undefined : (parent_type === "character" ? "oc" : "elementum");
    const result = await apis.tcp.getTravelParentFavorList({
        parent_type: apiParentType,
        page_index,
        page_size,
    });
    return {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        list: result.list.map((item) => {
            const itemType = (item.type === "oc" || item.type === "official") ? "character" : "elementum";
            return {
                uuid: item.uuid,
                type: itemType,
                name: item.name,
                avatar_img: item.config?.avatar_img ?? null,
                header_img: item.config?.header_img ?? null,
                favor_ctime: item.favor_ctime,
                folder_id: item.folder_id,
            };
        }),
    };
});

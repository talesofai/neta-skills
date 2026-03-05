import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const requestHomeFeedInteractiveInputSchema = z.object({
    page_index: z.number().int().min(0).optional().default(0),
    page_size: z.number().int().min(1).max(40).optional().default(20),
    biz_trace_id: z.string().optional(),
    is_new_user: z.boolean().optional(),
    select_themes: z.string().optional(),
    scene: z.string().optional(),
    collection_uuid: z.string().optional(),
    target_collection_uuid: z.string().optional(),
    target_user_uuid: z.string().optional(),
});
// 复用 collection.ts 中的类型定义
export const requestHomeFeedInteractiveOutputSchema = z.object({
    module_list_header: z.null(),
    module_list: z.array(z.object({
        data_id: z.string(),
        module_id: z.string(),
        template_id: z.string(),
        json_data: z.record(z.string(), z.unknown()),
    })),
    page_data: z.object({
        page_index: z.number().optional(),
        page_size: z.number().optional(),
        has_next_page: z.boolean().optional(),
        biz_trace_id: z.string().optional(),
    }),
});
export const requestHomeFeedInteractive = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: requestHomeFeedInteractiveInputSchema,
    outputSchema: requestHomeFeedInteractiveOutputSchema,
}, async (params, { log, apis }) => {
    log.debug("request_home_feed_interactive: params: %o", params);
    const result = await apis.feeds.interactiveList({
        page_index: params.page_index,
        page_size: params.page_size,
        biz_trace_id: params.biz_trace_id,
        is_new_user: params.is_new_user,
        select_themes: params.select_themes,
        scene: params.scene,
        collection_uuid: params.collection_uuid,
        target_collection_uuid: params.target_collection_uuid,
        target_user_uuid: params.target_user_uuid,
    });
    return {
        module_list_header: result.module_list_header,
        module_list: result.module_list,
        page_data: result.page_data,
    };
});

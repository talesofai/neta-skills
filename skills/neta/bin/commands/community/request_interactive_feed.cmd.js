import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
export const requestInteractiveFeedInputSchema = Type.Object({
    page_index: Type.Integer({ minimum: 0, default: 0 }),
    page_size: Type.Integer({ minimum: 1, maximum: 40, default: 20 }),
    biz_trace_id: Type.Optional(Type.String()),
    scene: Type.String({ default: "agent_intent" }),
    collection_uuid: Type.Optional(Type.String()),
    target_collection_uuid: Type.Optional(Type.String()),
    target_user_uuid: Type.Optional(Type.String()),
});
// 复用 collection.ts 中的类型定义
export const requestInteractiveFeedOutputSchema = Type.Object({
    module_list_header: Type.Null(),
    module_list: Type.Array(Type.Object({
        data_id: Type.String(),
        module_id: Type.String(),
        template_id: Type.String(),
        json_data: Type.Record(Type.String(), Type.Unknown()),
    })),
    page_data: Type.Object({
        page_index: Type.Optional(Type.Number()),
        page_size: Type.Optional(Type.Number()),
        has_next_page: Type.Optional(Type.Boolean()),
        biz_trace_id: Type.Optional(Type.String()),
    }),
});
export const requestInteractiveFeed = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: requestInteractiveFeedInputSchema,
}, async (params, { apis }) => {
    const result = await apis.feeds.interactiveList({
        page_index: params.page_index,
        page_size: params.page_size,
        biz_trace_id: params.biz_trace_id,
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

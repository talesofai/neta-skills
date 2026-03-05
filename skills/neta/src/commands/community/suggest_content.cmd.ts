import z from "zod";
import type { FeedInteractionList } from "../../apis/collection.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

// 创建扁平化的输入 schema（所有数组改为字符串，手动分割）
export const suggestContentInputSchema = z.object({
  page_index: z.number().int().min(0).optional().default(0),
  page_size: z.number().int().min(1).max(40).optional().default(20),
  scene: z.string().optional().default("agent_intent"),
  biz_trace_id: z.string().optional(),
  // 业务数据扁平化（使用逗号分隔的字符串）
  intent: z
    .enum(["recommend", "search", "exact"])
    .optional()
    .default("recommend"),
  search_keywords: z.string().optional().default(""),
  tax_paths: z.string().optional().default(""),
  tax_primaries: z.string().optional().default(""),
  tax_secondaries: z.string().optional().default(""),
  tax_tertiaries: z.string().optional().default(""),
  exclude_keywords: z.string().optional().default(""),
  exclude_tax_paths: z.string().optional().default(""),
});

// 定义 space_unit 的可读信息结构
const readableInfoSchema = z.object({
  col_list: z.array(z.string()),
  space: z.string(),
});

// 定义 space_unit 的 json_data 结构
const spaceUnitJsonDataSchema = z.object({
  readable_info: readableInfoSchema,
  next_action: z.object({
    label: z.string(),
    tags: z.array(z.string()),
    item_uuids: z.array(z.string()),
    item_ids: z.array(z.number()),
  }),
});

// 定义 collection_unit 的 json_data 结构
const collectionUnitJsonDataSchema = z.object({
  _score: z.null().optional(),
  id: z.number(),
  uuid: z.string(),
  user_id: z.number(),
  url: z.string(),
  name: z.string(),
  all_tax_nodes: z.array(z.string()),
  tax_primary: z.array(z.string()),
  tax_secondary: z.array(z.string()),
  tax_tertiary: z.array(z.string()),
});

// 定义 travel_unit 的 json_data 结构
const travelUnitJsonDataSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  cover_url: z.string(),
  introduction: z.string(),
  pv_metric: z.number(),
});

// 定义统一的 module_item 结构（使用 discriminatedUnion）
const spaceUnitSchema = z.object({
  data_id: z.string(),
  module_id: z.literal("space_unit"),
  template_id: z.string(),
  json_data: spaceUnitJsonDataSchema,
});

const collectionUnitSchema = z.object({
  data_id: z.string(),
  module_id: z.literal("collection_unit"),
  template_id: z.string(),
  json_data: collectionUnitJsonDataSchema,
});

const travelUnitSchema = z.object({
  data_id: z.string(),
  module_id: z.literal("travel_unit"),
  template_id: z.string(),
  json_data: travelUnitJsonDataSchema,
});

// 模块列表项的联合类型
const moduleItemSchema = z.discriminatedUnion("module_id", [
  spaceUnitSchema,
  collectionUnitSchema,
  travelUnitSchema,
]);

// 定义 page_data 结构
const pageDataSchema = z.object({
  has_next_page: z.boolean().optional(),
  page_index: z.number().optional(),
  page_size: z.number().optional(),
  biz_trace_id: z.string().optional(),
});

// 输出 schema
export const suggestContentOutputSchema = z.object({
  module_list: z.array(moduleItemSchema).default([]),
  page_data: pageDataSchema,
});

// 定义输出类型
export type SuggestContentOutput = z.infer<typeof suggestContentOutputSchema>;

export const suggestContent = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestContentInputSchema,
    outputSchema: suggestContentOutputSchema,
  },
  async (params, { log, apis }) => {
    log.debug("suggest_content: params: %o", params);

    // 将逗号分隔的字符串转换为数组
    const parseArray = (str: string) =>
      str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // 将扁平化参数转换为嵌套的 business_data 结构
    const requestPayload = {
      page_index: params.page_index,
      page_size: params.page_size,
      scene: params.scene,
      biz_trace_id: params.biz_trace_id,
      business_data: {
        intent: params.intent,
        search_keywords: parseArray(params.search_keywords),
        tax_paths: parseArray(params.tax_paths),
        tax_primaries: parseArray(params.tax_primaries),
        tax_secondaries: parseArray(params.tax_secondaries),
        tax_tertiaries: parseArray(params.tax_tertiaries),
        exclude_keywords: parseArray(params.exclude_keywords),
        exclude_tax_paths: parseArray(params.exclude_tax_paths),
      },
    };

    const result: FeedInteractionList =
      await apis.recsys.suggestContent(requestPayload);

    // 将 API 返回结果转换为新结构
    return {
      module_list:
        result.module_list as unknown as SuggestContentOutput["module_list"],
      page_data:
        result.page_data as unknown as SuggestContentOutput["page_data"],
    };
  },
);

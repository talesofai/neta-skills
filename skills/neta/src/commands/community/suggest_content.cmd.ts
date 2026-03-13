import { Type } from "@sinclair/typebox";
import type { FeedInteractionList } from "../../apis/collection.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

// 创建扁平化的输入 schema（所有数组改为字符串，手动分割）
export const suggestContentInputSchema = Type.Object({
  page_index: Type.Integer({ minimum: 0, default: 0 }),
  page_size: Type.Integer({ minimum: 1, maximum: 40, default: 20 }),
  scene: Type.String({ default: "agent_intent" }),
  biz_trace_id: Type.Optional(Type.String()),
  // 业务数据扁平化（使用逗号分隔的字符串）
  intent: Type.Union(
    [Type.Literal("recommend"), Type.Literal("search"), Type.Literal("exact")],
    { default: "recommend" },
  ),
  search_keywords: Type.String({ default: "" }),
  tax_paths: Type.String({ default: "" }),
  tax_primaries: Type.String({ default: "" }),
  tax_secondaries: Type.String({ default: "" }),
  tax_tertiaries: Type.String({ default: "" }),
  exclude_keywords: Type.String({ default: "" }),
  exclude_tax_paths: Type.String({ default: "" }),
});

export const suggestContent = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestContentInputSchema,
  },
  async (params, { apis }) => {
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
      module_list: result.module_list,
      page_data: result.page_data,
    };
  },
);

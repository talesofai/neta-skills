import z from "zod";
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

// 输出 schema
export const contentItemSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  cover_url: z.string().nullish(),
  type: z.enum(["video", "image", "article"]).optional(),
  score: z.number().optional(),
  reason: z.string().optional(),
});

export const suggestContentOutputSchema = z.object({
  total: z.number().optional(),
  page_index: z.number().optional(),
  page_size: z.number().optional(),
  list: z.array(contentItemSchema).default([]),
  has_next: z.boolean().optional(),
});

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

    const result = await apis.recsys.suggestContent(requestPayload);

    return {
      total: result.total || 0,
      page_index: result.page_index || 0,
      page_size: result.page_size || 0,
      list: result.list || [],
      has_next: result.has_next || false,
    };
  },
);

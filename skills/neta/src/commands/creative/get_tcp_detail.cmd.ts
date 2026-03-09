import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
      name: z.string(),
      parent_type: z.string(),
    }),
  }),
  import.meta,
);

/**
 * 角色开盒输出格式
 */
const characterUnboxResultSchema = z.object({
  // 基础信息
  uuid: z.string(),
  type: z.literal("character"),
  name: z.string(),
  short_name: z.string().nullable(),
  // 开盒核心字段
  description: z.string().nullable().describe("角色描述"),
  appearance_vtokens: z.string().nullable().describe("外貌描述词"),
  prompt: z.string().nullable().describe("带权重的 prompt"),
  tachie_url: z.string().nullable().describe("角色封面/立绘"),
  creator_avatar_url: z.string().nullable().describe("用户头像"),
  original_image_url: z.string().nullable().describe("垫图"),
  trigger_id: z.string().nullable().describe("触发器 ID"),
  style_key: z.string().nullable().describe("风格键"),
  // 额外信息
  creator_name: z.string().nullable(),
  ctime: z.string().nullable(),
  // 原始响应
  raw_response: z.unknown().describe("完整响应 JSON"),
});

/**
 * 元素开盒输出格式
 */
const elementumUnboxResultSchema = z.object({
  // 基础信息
  uuid: z.string(),
  type: z.literal("elementum"),
  name: z.string(),
  short_name: z.string().nullable(),
  // 开盒核心字段
  description: z.string().nullable().describe("元素描述"),
  appearance_vtokens: z.string().nullable().describe("提示词"),
  tachie_url: z.string().nullable().describe("角色封面"),
  creator_avatar_url: z.string().nullable().describe("用户头像"),
  controlnetunit_tile_image_ref: z.string().nullable().describe("垫图"),
  preset_key: z.string().nullable().describe("预设键"),
  // 额外信息
  creator_name: z.string().nullable(),
  ctime: z.string().nullable(),
  // 原始响应
  raw_response: z.unknown().describe("完整响应 JSON"),
});

const getTcpDetailV1Parameters = z.object({
  /** 角色或元素的名称 */
  name: z.string().describe(meta.parameters.name),
  /** 类型：character（角色）/ elementum（元素）/ both（两者） */
  parent_type: z.enum(["character", "elementum", "both"]).optional().default("both").describe(meta.parameters.parent_type),
});

const getTcpDetailV1ResultSchema = z.union([
  characterUnboxResultSchema,
  elementumUnboxResultSchema,
]);

export const getTcpDetail = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: getTcpDetailV1Parameters,
    outputSchema: getTcpDetailV1ResultSchema,
  },
  async ({ name, parent_type }, { log, apis }) => {
    log.debug(
      "get_tcp_detail: name: %s, parent_type: %s",
      name,
      parent_type,
    );

    // 1. 先搜索角色/元素
    const searchResult = await apis.tcp.searchTCPs({
      keywords: name,
      page_index: 0,
      page_size: 1,
      parent_type: parent_type === "both" ? ["oc", "elementum"] : [parent_type === "character" ? "oc" : "elementum"],
      sort_scheme: "exact",
    });

    if (!searchResult.list || searchResult.list.length === 0) {
      throw new Error(`未找到名称为 "${name}" 的角色或元素`);
    }

    const item = searchResult.list[0];
    const uuid = item.uuid;
    const itemType: "character" | "elementum" = (item.type === "oc" || item.type === "official") ? "character" : "elementum";

    // 2. 获取详细资料（tcpProfile 需要 APP token）
    let profile: any = null;
    let profileError: string | null = null;
    
    try {
      profile = await apis.tcp.tcpProfile(uuid);
    } catch (e: any) {
      profileError = e.message || "无法获取详细资料";
    }

    const isCharacter = itemType === "character";
    const ocBio = isCharacter && profile?.oc_bio ? profile.oc_bio : null;

    // 3. 构建开盒输出
    if (isCharacter) {
      // 角色开盒格式
      return {
        uuid: item.uuid,
        type: "character" as const,
        name: item.name,
        short_name: item.short_name ?? null,
        // 开盒核心字段
        description: ocBio?.description ?? null,
        appearance_vtokens: ocBio?.appearance_vtokens ?? null,
        prompt: ocBio?.prompt ?? null,
        tachie_url: profile?.tachie_url ?? null,
        creator_avatar_url: item.creator?.avatar_url ?? null,
        original_image_url: profile?.original_image_url ?? null,
        trigger_id: profile?.trigger_id ?? null,
        style_key: profile?.style_key ?? null,
        // 额外信息
        creator_name: item.creator?.nick_name ?? null,
        ctime: item.ctime ?? null,
        // 原始响应
        raw_response: {
          search_result: item,
          profile: profile,
          profile_error: profileError,
        },
      };
    } else {
      // 元素开盒格式
      return {
        uuid: item.uuid,
        type: "elementum" as const,
        name: item.name,
        short_name: item.short_name ?? null,
        // 开盒核心字段
        description: profile?.description ?? null,
        appearance_vtokens: profile?.appearance_vtokens ?? null,
        tachie_url: profile?.tachie_url ?? null,
        creator_avatar_url: item.creator?.avatar_url ?? null,
        controlnetunit_tile_image_ref: profile?.controlnetunit_tile_image_ref ?? null,
        preset_key: profile?.preset_key ?? null,
        // 额外信息
        creator_name: item.creator?.nick_name ?? null,
        ctime: item.ctime ?? null,
        // 原始响应
        raw_response: {
          search_result: item,
          profile: profile,
          profile_error: profileError,
        },
      };
    }
  },
);

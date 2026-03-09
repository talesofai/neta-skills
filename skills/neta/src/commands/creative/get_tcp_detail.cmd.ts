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

const getTcpDetailV1Parameters = z.object({
  /** 角色或元素的名称 */
  name: z.string().describe(meta.parameters.name),
  /** 类型：character（角色）/ elementum（元素）/ both（两者） */
  parent_type: z.enum(["character", "elementum", "both"]).optional().default("both").describe(meta.parameters.parent_type),
});

const getTcpDetailV1ResultSchema = z.object({
  uuid: z.string(),
  type: z.enum(["character", "elementum"]),
  name: z.string(),
  short_name: z.string().nullable(),
  avatar_img: z.string().nullable(),
  header_img: z.string().nullable(),
  /** 角色的详细描述词（仅角色类型） */
  description: z.string().nullable(),
  /** 角色的性格（仅角色类型） */
  persona: z.string().nullable(),
  /** 角色的兴趣（仅角色类型） */
  interests: z.string().nullable(),
  /** 角色的年龄（仅角色类型） */
  age: z.string().nullable(),
  /** 角色的职业（仅角色类型） */
  occupation: z.string().nullable(),
  /** 元素的提示词（仅元素类型） */
  travel_preview: z.string().nullable(),
  /** 元素的特征标签（仅元素类型） */
  traits: z.array(z.string()).nullable(),
});

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

    // 2. 获取详细资料
    const profile = await apis.tcp.tcpProfile(uuid);

    if (!profile) {
      throw new Error(`无法获取 "${name}" 的详细资料`);
    }

    const itemType: "character" | "elementum" = (item.type === "oc" || item.type === "official") ? "character" : "elementum";

    // 3. 提取描述词/提示词
    const isCharacter = itemType === "character";
    const ocBio = isCharacter && "oc_bio" in profile ? profile.oc_bio : null;

    return {
      uuid: item.uuid,
      type: itemType,
      name: item.name,
      short_name: item.short_name ?? null,
      avatar_img: item.config?.avatar_img ?? null,
      header_img: item.config?.header_img ?? null,
      // 角色字段
      description: ocBio?.description ?? null,
      persona: ocBio?.persona ?? null,
      interests: ocBio?.interests ?? null,
      age: ocBio?.age ?? null,
      occupation: ocBio?.occupation ?? null,
      // 元素字段
      travel_preview: !isCharacter ? item.config?.travel_preview ?? null : null,
      traits: !isCharacter ? (item.config?.traits ?? null) : null,
    };
  },
);

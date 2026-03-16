import { Type } from "@sinclair/typebox";
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

const searchCharacterOrElementumV1Parameters = Type.Object({
  keywords: Type.String(),
  parent_type: Type.Union(
    [
      Type.Literal("character"),
      Type.Literal("elementum"),
      Type.Literal("both"),
    ],
    { default: "both" },
  ),
  sort_scheme: Type.Union([Type.Literal("exact"), Type.Literal("best")], {
    default: "best",
  }),
  page_index: Type.Integer({ minimum: 0, default: 0 }),
  page_size: Type.Integer({ minimum: 1, maximum: 50, default: 10 }),
});

export const searchCharacterOrElementum = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: searchCharacterOrElementumV1Parameters,
  },
  async (
    { keywords, parent_type, sort_scheme, page_index, page_size },
    { apis },
  ) => {
    const result = await apis.tcp.searchTCPs({
      keywords,
      page_index,
      page_size,
      parent_type:
        parent_type === "both"
          ? ["oc", "elementum"]
          : parent_type === "character"
            ? "oc"
            : "elementum",
      sort_scheme,
    });

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: result.list.map((res) => ({
        uuid: res.uuid,
        type:
          res.type === "oc" || res.type === "official"
            ? "character"
            : "elementum",
        name: res.name,
        avatar_img: res.config?.avatar_img,
        header_img: res.config?.header_img,
      })),
    };
  },
);

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

const listMyCharactersParameters = Type.Object({
  keyword: Type.Optional(
    Type.String({ description: "Search keyword to filter characters" }),
  ),
  page_index: Type.Integer({ minimum: 0, default: 0 }),
  page_size: Type.Integer({ minimum: 1, maximum: 50, default: 20 }),
});

export const listMyCharacters = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: listMyCharactersParameters,
  },
  async ({ keyword, page_index, page_size }, { apis, user }) => {
    const result = await apis.tcp.listMyTCPs({
      user_uuid: user.uuid,
      parent_type: "oc",
      keyword,
      page_index,
      page_size,
    });

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: result.list.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        type: item.type === "official" ? "character" : "character",
        avatar_img: item.config?.avatar_img,
        accessibility: item.accessibility,
        status: item.status,
      })),
    };
  },
);

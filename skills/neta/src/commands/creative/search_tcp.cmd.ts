import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";
import {
  searchCharacterOrElementumV1Parameters,
  searchCharacterOrElementumV1ResultSchema,
} from "../schema.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

export const searchCharacterOrElementum = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: searchCharacterOrElementumV1Parameters,
    outputSchema: searchCharacterOrElementumV1ResultSchema,
  },
  async (
    { keywords, parent_type, sort_scheme, page_index, page_size },
    { log, apis },
  ) => {
    log.debug(
      "search_tcp: keywords: %s, parent_type: %s, sort_scheme: %s, page_index: %d, page_size: %d",
      keywords,
      parent_type,
      sort_scheme,
      page_index,
      page_size,
    );

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

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

export const getSubscribeListCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      page_index: z.number().int().min(0).optional().default(0),
      page_size: z.number().int().min(1).max(50).optional().default(20),
    }),
    outputSchema: z.object({
      total: z.number(),
      page_index: z.number(),
      page_size: z.number(),
      list: z.array(
        z.object({
          uuid: z.string(),
          name: z.string(),
          avatar_url: z.string(),
          total_fans: z.number().nullable(),
          total_collections: z.number().nullable(),
          subscribe_status: z.string().nullable(),
        }),
      ),
      has_next: z.boolean().nullable(),
    }),
  },
  async ({ page_index, page_size }, { apis, log }) => {
    log.debug(
      "get_subscribe_list: page_index: %s, page_size: %s",
      page_index,
      page_size,
    );

    const result = await apis.user.getSubscribeList({
      page_index,
      page_size,
    });

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: result.list.map((user) => ({
        uuid: user.uuid,
        name: user.name,
        avatar_url: user.avatar_url,
        total_fans: user.total_fans,
        total_collections: user.total_collections,
        subscribe_status: user.subscribe_status,
      })),
      has_next: result.has_next,
    };
  },
);

import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
      visit_user_uuid: z.string(),
      page_index: z.string(),
      page_size: z.string(),
    }),
  }),
  import.meta,
);

export const getFanList = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      visit_user_uuid: z.string().describe(meta.parameters.visit_user_uuid),
      page_index: z.number().optional().default(0).describe(meta.parameters.page_index),
      page_size: z.number().optional().default(20).describe(meta.parameters.page_size),
    }),
  },
  async ({ visit_user_uuid, page_index = 0, page_size = 20 }, { apis }) => {
    const result = await apis.user.getFanList(visit_user_uuid, page_index, page_size);

    return {
      success: true,
      data: {
        total: result?.total,
        page_index: result?.page_index,
        page_size: result?.page_size,
        has_next: result?.has_next,
        list: result?.list?.map((item) => ({
          uuid: item.uuid,
          nick_name: item.nick_name,
          avatar_url: item.avatar_url,
          subscribe_status: item.subscribe_status,
          total_subscribes: item.total_subscribes,
          total_fans: item.total_fans,
          total_likes: item.total_likes,
          total_collections: item.total_collections,
        })),
      },
    };
  },
);

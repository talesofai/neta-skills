import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
      page_index: z.string(),
      page_size: z.string(),
    }),
  }),
  import.meta,
);

export const getManuscriptList = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      page_index: z.number().optional().default(0).describe(meta.parameters.page_index),
      page_size: z.number().optional().default(24).describe(meta.parameters.page_size),
    }),
  },
  async ({ page_index = 0, page_size = 24 }, { apis }) => {
    const result = await apis.user.getManuscriptList(page_index, page_size);
    
    return {
      success: true,
      data: {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        has_next: result.has_next,
        manuscripts: result.list.map((m) => ({
          uuid: m.uuid,
          name: m.name,
          cover_url: m.cover_url,
          status: m.status,
          ctime: m.ctime,
          mtime: m.mtime,
        })),
      },
    };
  },
);

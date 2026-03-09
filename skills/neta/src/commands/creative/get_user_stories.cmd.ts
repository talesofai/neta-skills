import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
      uuid: z.string(),
      page_index: z.string(),
      page_size: z.string(),
    }),
  }),
  import.meta,
);

export const getUserStories = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      uuid: z.string().describe(meta.parameters.uuid),
      page_index: z.number().optional().default(0).describe(meta.parameters.page_index),
      page_size: z.number().optional().default(20).describe(meta.parameters.page_size),
    }),
  },
  async ({ uuid, page_index = 0, page_size = 20 }, { apis }) => {
    const result = await apis.user.getUserStories(uuid, page_index, page_size);
    
    return {
      success: true,
      data: {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        stories: result.list.map((story) => ({
          id: story.id,
          storyId: story.storyId,
          name: story.name,
          coverUrl: story.coverUrl,
          status: story.status,
          likeCount: story.likeCount,
          commentCount: story.commentCount,
          sharedCount: story.sharedCount,
          sameStyleCount: story.sameStyleCount,
          ctime: story.ctime,
          is_pinned: story.is_pinned,
          hashtag_names: story.hashtag_names,
        })),
      },
    };
  },
);

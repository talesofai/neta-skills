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

export const publishStory = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      storyId: z.string().describe("故事 ID/UUID"),
      triggerTCPCommentNow: z.boolean().optional().default(false).describe("是否触发 TCP 评论"),
      triggerSameStyleReply: z.boolean().optional().default(false).describe("是否触发同款回复"),
      sync_mode: z.boolean().optional().default(false).describe("是否同步模式"),
    }),
  },
  async (input, { apis }) => {
    const result = await apis.story.publishStory(input);
    
    return {
      success: true,
      data: result,
    };
  },
);

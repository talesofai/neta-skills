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

export const updateStory = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      uuid: z.string().describe("故事 UUID"),
      name: z.string().optional().describe("故事标题"),
      description: z.string().optional().describe("故事描述"),
      coverUrl: z.string().url().optional().describe("封面图片 URL"),
      status: z.enum(["DRAFT", "PUBLISHED"]).optional().describe("发布状态"),
      displayData: z.any().optional().describe("显示数据（页面、图片、角色等）"),
      editorData: z.any().optional().describe("编辑器数据"),
      hashtags: z.array(z.string()).optional().describe("标签列表"),
    }),
  },
  async (input, { apis }) => {
    const result = await apis.story.updateStory(input);
    
    return {
      success: true,
      data: result,
    };
  },
);

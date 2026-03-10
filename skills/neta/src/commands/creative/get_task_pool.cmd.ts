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

export const getTaskPool = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({}),
  },
  async (_, { apis }) => {
    const result = await apis.task.getTaskPool();
    
    return {
      success: true,
      data: result,
    };
  },
);

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

export const completeAssignment = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      uuid: z.string().describe("任务 UUID"),
    }),
  },
  async (input, { apis }) => {
    const result = await apis.assignment.completeAssignment(input);
    
    return {
      success: true,
      data: result,
    };
  },
);

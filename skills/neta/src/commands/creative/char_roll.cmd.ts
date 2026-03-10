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

export const charRoll = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      num: z.number().optional().default(1).describe("抽取数量"),
    }),
  },
  async (input, { apis }) => {
    const result = await apis.collection.charRoll(input);
    
    return {
      success: true,
      data: result,
    };
  },
);

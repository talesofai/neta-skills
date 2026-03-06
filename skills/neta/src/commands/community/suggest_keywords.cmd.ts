import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";
import {
  suggestKeywordsV1Parameters,
  suggestKeywordsV1ResultSchema,
} from "../schema.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

export const suggestKeywords = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: suggestKeywordsV1Parameters,
    outputSchema: suggestKeywordsV1ResultSchema,
  },
  async ({ prefix, size }, { log, apis }) => {
    log.debug("suggest_keywords: prefix: %s, size: %d", prefix, size);

    const result = await apis.recsys.suggestKeywords({
      prefix,
      size,
    });

    return {
      suggestions: result.suggestions || [],
    };
  },
);

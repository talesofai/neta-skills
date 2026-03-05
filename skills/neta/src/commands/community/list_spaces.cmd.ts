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

export const listSpaces = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async ({ apis }) => {
    const spaceHashtags = await apis.space.spaceHashtags();
    const spaces = await Promise.all(
      spaceHashtags.map((hashtag) => apis.space.basic(hashtag)),
    ).then((spaces) => spaces.filter((space) => space?.space_uuid));

    return {
      spaces,
    };
  },
);

import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      page_index: Type.String(),
      page_size: Type.String(),
    }),
  }),
  import.meta,
);

const listMyStoriesParameters = Type.Object({
  page_index: Type.Optional(
    Type.Integer({
      minimum: 0,
      default: 0,
      description: meta.parameters.page_index,
    }),
  ),
  page_size: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 100,
      default: 20,
      description: meta.parameters.page_size,
    }),
  ),
});

export const listMyStories = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: listMyStoriesParameters,
  },
  async ({ page_index, page_size }, { apis, user }) => {
    if (!user) {
      throw new Error(
        "Not authenticated. Please check your NETA_TOKEN or login.",
      );
    }

    const resolvedPageSize = page_size ?? 20;
    const result = await apis.collection.userStories(user.uuid, {
      page_index,
      page_size,
    });
    return {
      has_more: result.list.length === resolvedPageSize,
      list: result.list,
    };
  },
);

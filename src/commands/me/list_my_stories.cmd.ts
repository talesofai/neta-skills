import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      uuid: Type.String(),
      page_index: Type.String(),
      page_size: Type.String(),
    }),
  }),
  import.meta,
);

const listMyStoriesParameters = Type.Object({
  uuid: Type.String({ description: meta.parameters.uuid }),
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
      maximum: 20,
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
  async ({ uuid, page_index, page_size }, { apis }) => {
    const result = await apis.collection.userStories(uuid, {
      page_index,
      page_size,
    });

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: result.list.map((story) => ({
        storyId: story.storyId,
        name: story.name,
        coverUrl: story.coverUrl,
        status: story.status,
        ctime: story.ctime,
        likeCount: story.likeCount,
        commentCount: story.commentCount,
        is_pinned: story.is_pinned,
        has_video: story.has_video,
      })),
    };
  },
);

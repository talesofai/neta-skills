import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
      collection_uuid: z.string(),
      page_size: z.string().optional(),
      cursor: z.string().optional(),
    }),
  }),
  import.meta,
);

export const getComments = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      collection_uuid: z.string().describe(meta.parameters.collection_uuid),
      page_size: z
        .number()
        .optional()
        .default(20)
        .describe(String(meta.parameters.page_size ?? "20")),
      cursor: z
        .string()
        .optional()
        .describe(meta.parameters.cursor ?? ""),
    }),
  },
  async ({ collection_uuid, page_size = 20, cursor }, { log, apis }) => {
    const actualPageSize = page_size ?? 20;
    log.debug(
      "get_comments: collection_uuid: %s, page_size: %d",
      String(collection_uuid),
      actualPageSize,
    );

    const result = await apis.comment.getComments(collection_uuid, {
      page_size: actualPageSize,
      ...(cursor ? { cursor } : {}),
    });

    return {
      comments: result.comments.map((comment) => ({
        uuid: comment.uuid,
        content: comment.content,
        ctime: comment.ctime,
        like_count: comment.like_count,
        reply_count: comment.reply_count,
        user: {
          uuid: comment.user.uuid,
          nick_name: comment.user.nick_name,
          avatar_url: comment.user.avatar_url,
        },
        parent_comment_uuid: comment.parent_comment_uuid,
        is_liked: comment.is_liked,
      })),
      total: result.total,
      has_more: result.has_more,
      next_cursor: result.next_cursor,
    };
  },
);

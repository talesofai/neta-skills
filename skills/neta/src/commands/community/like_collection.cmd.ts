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

export const likeCollectionCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      uuid: z.string().describe("作品 UUID"),
      is_cancel: z
        .boolean()
        .optional()
        .default(false)
        .describe("是否取消点赞，true 为取消点赞，false 为点赞"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async ({ uuid, is_cancel }, { apis, log }) => {
    log.debug(
      "like_collection: uuid: %s, is_cancel: %s",
      uuid,
      is_cancel ? "true" : "false",
    );

    const action = is_cancel ? "取消点赞" : "点赞";
    log.info(`like_collection: ${action}作品：%s`, uuid);

    const success = await apis.collection.likeCollection(uuid, { is_cancel });

    if (!success) {
      throw new Error(`${action}失败`);
    }

    return {
      success: true,
      message: `${action}成功`,
    };
  },
);

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

export const subscribeUserCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
      user_uuid: z.string().describe("用户 UUID"),
      is_cancel: z
        .boolean()
        .optional()
        .default(false)
        .describe("是否取消关注，true 为取消关注，false 为关注"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      subscribe_status: z.string().nullable().optional().describe("关注状态"),
      message: z.string(),
    }),
  },
  async ({ user_uuid, is_cancel }, { apis, log }) => {
    log.debug(
      "subscribe_user: user_uuid: %s, is_cancel: %s",
      user_uuid,
      is_cancel ? "true" : "false",
    );

    const action = is_cancel ? "取消关注" : "关注";
    log.info(`subscribe_user: ${action}用户：%s`, user_uuid);

    const result = await apis.user.subscribeUser({
      user_uuid,
      is_cancel,
    });

    if (!result.success) {
      throw new Error(`${action}失败`);
    }

    return {
      success: true,
      subscribe_status: result.subscribe_status,
      message: `${action}成功`,
    };
  },
);

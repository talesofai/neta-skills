import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

export const subscribeUserCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      user_uuid: Type.String(),
      is_cancel: Type.Boolean({
        default: false,
      }),
    }),
  },
  async ({ user_uuid, is_cancel }, { apis }) => {
    const action = is_cancel ? "unsubscribe" : "subscribe";

    const result = await apis.user.subscribeUser({
      user_uuid,
      is_cancel,
    });

    if (!result.success) {
      throw new Error(`${action} fail`);
    }

    return {
      success: true,
      subscribe_status: result.subscribe_status,
      message: `${action} success`,
    };
  },
);

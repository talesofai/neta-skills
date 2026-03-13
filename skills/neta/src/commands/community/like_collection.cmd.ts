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

export const likeCollectionCmd = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      uuid: Type.String(),
      is_cancel: Type.Boolean({
        default: false,
      }),
    }),
  },
  async ({ uuid, is_cancel }, { apis }) => {
    const action = is_cancel ? "unliked" : "liked";

    const success = await apis.collection.likeCollection(uuid, { is_cancel });

    if (!success) {
      throw new Error(`${action} fail`);
    }

    return {
      success: true,
      message: `${action} success`,
    };
  },
);

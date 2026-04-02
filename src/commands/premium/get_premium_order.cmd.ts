import { Type } from "@sinclair/typebox";
import { parseDate } from "../../utils/date.ts";
import { IS_GLOBAL } from "../../utils/env.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      order_uuid: Type.String(),
    }),
  }),
  import.meta,
);

export const getPremiumOrder = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      order_uuid: Type.String({ description: meta.parameters.order_uuid }),
    }),
  },
  async ({ order_uuid }, { apis }) => {
    if (!IS_GLOBAL) {
      throw new Error("This command is not supported in the current region");
    }

    const order = await apis.commerce.order({ order_uuid });
    return {
      order: {
        uuid: order.uuid,
        spu: {
          uuid: order.spu.uuid,
          name: order.spu.name,
          price: order.spu.price,
        },
        status: order.status,
        status_history: order.status_history.map((item) => ({
          ...item,
          time: parseDate(item.time).format(),
        })),
        price: order.price,
        valid_until: parseDate(order.valid_until).format(),
        ctime: parseDate(order.ctime).format(),
        mtime: parseDate(order.mtime).format(),
      },
    };
  },
);

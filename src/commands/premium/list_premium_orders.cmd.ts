import { Type } from "@sinclair/typebox";
import { parseDate } from "../../utils/date.ts";
import { IS_GLOBAL } from "../../utils/env.ts";
import { errors } from "../../utils/errors.ts";
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

export const listPremiumOrders = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      page_index: Type.Integer({
        minimum: 0,
        default: 0,
        description: meta.parameters.page_index,
      }),
      page_size: Type.Integer({
        minimum: 1,
        maximum: 50,
        default: 20,
        description: meta.parameters.page_size,
      }),
    }),
  },
  async ({ page_index, page_size }, { apis }) => {
    if (!IS_GLOBAL) {
      throw new Error(errors.not_supported_in_current_region);
    }

    const { list, total } = await apis.commerce.orders({
      page_index,
      page_size,
    });
    return {
      total,
      orders: list.map((order) => ({
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
      })),
    };
  },
);

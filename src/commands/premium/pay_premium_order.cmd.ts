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
      order_uuid: Type.String(),
      channel: Type.String(),
    }),
  }),
  import.meta,
);

export const payPremiumOrder = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      order_uuid: Type.String({ description: meta.parameters.order_uuid }),
      channel: Type.Union([Type.Literal("stripe-checkout")], {
        description: meta.parameters.channel,
      }),
    }),
  },
  async ({ order_uuid, channel }, { apis }) => {
    if (!IS_GLOBAL) {
      throw new Error(errors.not_supported_in_current_region);
    }

    const order = await apis.commerce.order({ order_uuid });
    if (order.status !== "UNPAID") {
      throw new Error(errors.order_not_unpaid);
    }

    if (parseDate(order.valid_until).isBefore(Date.now())) {
      throw new Error(errors.order_expired);
    }

    const result = await apis.commerce.pay({
      order_uuid,
      channel,
      return_url: "https://app.neta.art/subscribe/callback",
    });

    return {
      checkout_session_url: result.checkout_session_url,
      checkout_session_id: result.checkout_session_id,
    };
  },
);

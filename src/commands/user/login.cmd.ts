import { Type } from "@sinclair/typebox";
import { requestDeviceCode, verifyDeviceCode } from "../../utils/auth.ts";
import { IS_GLOBAL } from "../../utils/env.ts";
import { errors } from "../../utils/errors.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

export const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      action: Type.String(),
    }),
  }),
  import.meta,
);

export const login = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      action: Type.Union(
        [Type.Literal("request-code"), Type.Literal("verify-code")],
        {
          default: "request-code",
          description: meta.parameters.action,
        },
      ),
    }),
  },
  async ({ action }, { apis }) => {
    if (!IS_GLOBAL) {
      throw new Error(errors.not_supported_in_current_region);
    }

    if (action === "verify-code") {
      await verifyDeviceCode();
      const user = await apis.user.me();
      return {
        uuid: user.uuid,
        nick_name: user.nick_name,
        avatar_url: user.avatar_url,
      };
    }

    return requestDeviceCode();
  },
);

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

export const getApInfo = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async (_args, { apis, user }) => {
    if (!user) {
      throw new Error(
        "Not authenticated. Please check your NETA_TOKEN or login.",
      );
    }

    const info = await apis.user.apInfo();
    return {
      ap: info.ap,
      ap_limit: info.ap_limit,
      temp_ap: info.temp_ap ?? null,
      paid_ap: info.paid_ap ?? null,
      unlimited_until: info.unlimited_until ?? null,
    };
  },
);

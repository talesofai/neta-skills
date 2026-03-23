import { Type } from "@sinclair/typebox";
import { parseDate } from "../../utils/date.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const PlanningMap = {
  0: "Basic",
  1: "Starter",
  2: "Pro",
  3: "Master",
};

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

export const getCurrentPremiumPlan = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async (_, { apis }) => {
    if (!apis.baseUrl.endsWith("talesofai.com")) {
      throw new Error("This command is not supported in the current region");
    }

    const user = await apis.user.me();
    const level = user.properties?.vip_level ?? 0;
    return {
      plan: PlanningMap[level],
      until: user.properties?.vip_until
        ? parseDate(user.properties.vip_until).format()
        : null,
    };
  },
);

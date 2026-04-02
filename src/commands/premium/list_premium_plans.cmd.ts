import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { IS_GLOBAL } from "../../utils/env.ts";
import { safeParseJson } from "../../utils/json.ts";
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

const PlanBasicInfo = Type.Object({
  descriptions: Type.Array(Type.String()),
  infoPopup: Type.Object({
    title: Type.String(),
    content: Type.String(),
  }),
});

const Plan = Type.Composite([
  PlanBasicInfo,
  Type.Object({
    price: Type.Object({
      monthly: Type.Number(),
      monthlyOff: Type.Number(),
      monthlyOriginal: Type.Number(),
      yearly: Type.Number(),
      yearlyTotal: Type.Number(),
      off: Type.Number(),
    }),
    spu: Type.Object({
      monthly: Type.Optional(Type.String()),
      yearly: Type.Optional(Type.String()),
    }),
  }),
]);

const PlansConfig = Type.Object({
  "en-US": Type.Optional(
    Type.Record(
      Type.Union([
        Type.Literal("Master"),
        Type.Literal("Pro"),
        Type.Literal("Starter"),
      ]),
      Type.Optional(Plan),
    ),
  ),
});

export const listPremiumPlans = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async (_, { apis }) => {
    if (!IS_GLOBAL) {
      throw new Error("This command is not supported in the current region");
    }

    const plansConfigValue = await apis.commerce.listPlansConfig();
    if (!plansConfigValue || plansConfigValue.type !== "json") {
      throw new Error("Premium subscription plans config not found");
    }

    const json = safeParseJson(plansConfigValue.value);

    try {
      const plansConfig = Value.Parse(PlansConfig, json);
      const plans = plansConfig["en-US"] ?? {};

      return {
        plans,
      };
    } catch (error) {
      throw new Error("Premium subscription plans config is invalid", {
        cause: error,
      });
    }
  },
);

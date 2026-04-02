import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      name: Type.String(),
      mission_plot: Type.String(),
      subtitle: Type.String(),
      status: Type.String(),
      header_img: Type.String(),
      background_img: Type.String(),
      mission_task: Type.String(),
      mission_plot_attention: Type.String(),
    }),
  }),
  import.meta,
);

const createAdventureCampaignParameters = Type.Object({
  name: Type.String({
    description: meta.parameters.name,
    maxLength: 128,
  }),
  mission_plot: Type.String({
    description: meta.parameters.mission_plot,
  }),
  subtitle: Type.Optional(
    Type.String({ description: meta.parameters.subtitle }),
  ),
  status: Type.Union([Type.Literal("PUBLISHED"), Type.Literal("DRAFT")], {
    default: "PUBLISHED",
    description: meta.parameters.status,
  }),
  header_img: Type.Optional(
    Type.String({ description: meta.parameters.header_img }),
  ),
  background_img: Type.Optional(
    Type.String({ description: meta.parameters.background_img }),
  ),
  mission_task: Type.Optional(
    Type.String({ description: meta.parameters.mission_task }),
  ),
  mission_plot_attention: Type.Optional(
    Type.String({ description: meta.parameters.mission_plot_attention }),
  ),
});

export const createAdventureCampaign = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: createAdventureCampaignParameters,
  },
  async (
    {
      name,
      mission_plot,
      subtitle,
      status,
      header_img,
      background_img,
      mission_task,
      mission_plot_attention,
    },
    { user, apis },
  ) => {
    if (!user) {
      throw new Error(
        "Not authenticated. Please check your NETA_TOKEN or login.",
      );
    }

    const result = await apis.travelCampaign.createCampaign({
      name,
      mission_plot,
      subtitle,
      status,
      header_img,
      background_img,
      mission_task,
      mission_plot_attention,
    });

    return {
      uuid: result.uuid,
      name: result.name,
      subtitle: result.subtitle,
      status: result.status,
      header_img: result.header_img,
      background_img: result.background_img,
      mission_plot: result.mission_plot,
      mission_task: result.mission_task,
      mission_plot_attention: result.mission_plot_attention,
      default_tcp_uuid: result.default_travel_character_parent?.uuid ?? null,
    };
  },
);

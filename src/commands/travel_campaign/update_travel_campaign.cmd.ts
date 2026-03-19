import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      campaign_uuid: Type.String(),
      name: Type.String(),
      mission_plot: Type.String(),
      subtitle: Type.String(),
      status: Type.String(),
      header_img: Type.String(),
      background_img: Type.String(),
      mission_task: Type.String(),
      mission_plot_attention: Type.String(),
      tcp_uuid: Type.String(),
    }),
  }),
  import.meta,
);

const updateTravelCampaignParameters = Type.Object({
  campaign_uuid: Type.String({
    description: meta.parameters.campaign_uuid,
  }),
  name: Type.Optional(
    Type.String({
      description: meta.parameters.name,
      maxLength: 128,
    }),
  ),
  mission_plot: Type.Optional(
    Type.String({ description: meta.parameters.mission_plot }),
  ),
  subtitle: Type.Optional(
    Type.String({ description: meta.parameters.subtitle }),
  ),
  status: Type.Optional(
    Type.Union([Type.Literal("PUBLISHED"), Type.Literal("DRAFT")], {
      description: meta.parameters.status,
    }),
  ),
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
  tcp_uuid: Type.Optional(
    Type.String({ description: meta.parameters.tcp_uuid }),
  ),
});

export const updateTravelCampaign = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: updateTravelCampaignParameters,
  },
  async (
    {
      campaign_uuid,
      name,
      mission_plot,
      subtitle,
      status,
      header_img,
      background_img,
      mission_task,
      mission_plot_attention,
      tcp_uuid,
    },
    { apis },
  ) => {
    const result = await apis.travelCampaign.updateCampaign(campaign_uuid, {
      name,
      mission_plot,
      subtitle,
      status,
      header_img,
      background_img,
      mission_task,
      mission_plot_attention,
      tcp_uuid,
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
      default_tcp: result.default_travel_character_parent
        ? {
            uuid: result.default_travel_character_parent.uuid,
            name: result.default_travel_character_parent.name,
            avatar_img:
              result.default_travel_character_parent.config?.avatar_img,
          }
        : null,
    };
  },
);

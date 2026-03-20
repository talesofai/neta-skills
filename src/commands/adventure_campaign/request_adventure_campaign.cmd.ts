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
    }),
  }),
  import.meta,
);

const requestAdventureCampaignParameters = Type.Object({
  campaign_uuid: Type.String({
    description: meta.parameters.campaign_uuid,
  }),
});

export const requestAdventureCampaign = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: requestAdventureCampaignParameters,
  },
  async ({ campaign_uuid }, { apis }) => {
    const campaign = await apis.travelCampaign.getCampaign(campaign_uuid);

    return {
      uuid: campaign.uuid,
      name: campaign.name,
      subtitle: campaign.subtitle,
      status: campaign.status,
      header_img: campaign.header_img,
      background_img: campaign.background_img,
      ctime: campaign.ctime,
      mtime: campaign.mtime,
      mission_plot: campaign.mission_plot,
      mission_task: campaign.mission_task,
      mission_plot_attention: campaign.mission_plot_attention,
      default_tcp_uuid: campaign.default_travel_character_parent?.uuid ?? null,
      creator: campaign.creator
        ? {
            uuid: campaign.creator.uuid,
            nick_name: campaign.creator.nick_name,
          }
        : null,
    };
  },
);

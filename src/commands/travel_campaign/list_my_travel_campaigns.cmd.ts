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

const listMyTravelCampaignsParameters = Type.Object({
  page_index: Type.Integer({ minimum: 0, default: 0 }),
  page_size: Type.Integer({ minimum: 1, maximum: 50, default: 20 }),
});

export const listMyTravelCampaigns = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: listMyTravelCampaignsParameters,
  },
  async ({ page_index, page_size }, { user, apis }) => {
    if (!user) {
      throw new Error("Not authenticated. Please check your NETA_TOKEN.");
    }

    const result = await apis.travelCampaign.listMyCampaigns({
      user_uuid: user.uuid,
      page_index,
      page_size,
    });

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: result.list.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        subtitle: item.subtitle,
        status: item.status,
        header_img: item.header_img,
        default_tcp_uuid: item.default_travel_character_parent?.uuid ?? null,
      })),
    };
  },
);

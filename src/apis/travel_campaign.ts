import type { AxiosInstance } from "axios";
import type { GenericPagination } from "./types.ts";

export type TravelCampaignBigramDTO = {
  uuid: string;
  name: string;
  subtitle?: string;
  type: string;
  status: string;
  header_img?: string;
  background_img?: string;
  ctime?: string;
  mtime?: string;
  mission_uuid: string;
  mission_slug: string;
  mission_plot: string;
  mission_task?: string;
  mission_plot_attention?: string;
  creator?: {
    uuid: string;
    nick_name?: string;
    avatar_url?: string;
  };
  default_travel_character_parent?: {
    uuid: string;
    name: string;
    config?: {
      avatar_img?: string;
      header_img?: string;
    };
  };
  pv_metric?: number;
  hashtags?: string[];
};

export type CreateTravelCampaignParams = {
  name: string;
  mission_plot: string;
  subtitle?: string;
  status?: "PUBLISHED" | "DRAFT";
  header_img?: string;
  background_img?: string;
  mission_task?: string;
  mission_plot_attention?: string;
};

export type UpdateTravelCampaignParams = {
  name?: string;
  subtitle?: string;
  status?: "PUBLISHED" | "DRAFT";
  header_img?: string;
  background_img?: string;
  mission_plot?: string;
  mission_task?: string;
  mission_plot_attention?: string;
};

export const createTravelCampaignApis = (client: AxiosInstance) => {
  const createCampaign = async (params: CreateTravelCampaignParams) => {
    return client
      .post<TravelCampaignBigramDTO>("/travel/campaign/", params)
      .then((res) => res.data);
  };

  const updateCampaign = async (
    uuid: string,
    params: UpdateTravelCampaignParams,
  ) => {
    return client
      .patch<TravelCampaignBigramDTO>(`/travel/campaign/${uuid}`, params)
      .then((res) => res.data);
  };

  const listMyCampaigns = async (query: {
    user_uuid: string;
    page_index?: number;
    page_size?: number;
  }) => {
    return client
      .get<GenericPagination<TravelCampaignBigramDTO>>("/travel/campaigns", {
        params: query,
      })
      .then((res) => res.data);
  };

  const getCampaign = async (uuid: string) => {
    return client
      .get<TravelCampaignBigramDTO>(`/travel/campaign/${uuid}`)
      .then((res) => res.data);
  };

  const deleteCampaign = async (uuid: string) => {
    return client
      .delete<string>(`/travel/campaign/${uuid}`)
      .then((res) => res.data);
  };

  return {
    createCampaign,
    updateCampaign,
    listMyCampaigns,
    getCampaign,
    deleteCampaign,
  };
};

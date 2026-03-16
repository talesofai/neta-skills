import type { AxiosInstance } from "axios";
import type { TaskMeta } from "./types.ts";

export type VerseCollectionCoverType =
  | "last_image"
  | "last_video_cover"
  | "screenshot";

export interface VersePreset {
  uuid: string;
  name: string;
  system_root_prompt_key: string;
  toolset_keys: string[];
  tools: string;
  ui_component_key: string;
  interactive_config: {
    auto_mode?: boolean;
    button_name: string;
    make_image_aspect: string;
    prefer_video_model?: string;
    advanced_translator: boolean;
    collection_cover_type?: VerseCollectionCoverType;
    publish_title?: string;
    publish_description?: string;
    page_title?: string;
  };
  hashtags: string[];
  preset_description: string;
  preset_content_schema: string;
  reference_content: string;
  reference_planning: string;

  creator: unknown;
  status: "PUBLISHED" | "BANNED" | "DELETED";
}

export type RedpacketTier = "small" | "medium" | "large" | "rare";

export interface RedpacketDrawRequest {
  tier: RedpacketTier;
  manuscript_uuid: string;
}

export interface RedpacketDrawResponse {
  success: boolean;
  reward_ap: number;
  daily_count: number;
  remaining_count: number;
}

export const createVerseApis = (client: AxiosInstance) => {
  const patchHtml = async (params: {
    url: string;
    prompt: string;
    current_schema: string;
    description: string;
    meta?: TaskMeta;
  }) => {
    return client
      .post<string>("/v1/verse/modifyhtml", params, {
        timeout: 20 * 1000,
      })
      .then((res) => res.data);
  };

  const versePreset = async (uuid: string) =>
    client.get<VersePreset>(`/v1/verse/preset/${uuid}`).then((res) => res.data);

  const drawRedpacket = async (params: RedpacketDrawRequest) =>
    client
      .post<RedpacketDrawResponse>("/v1/redpacket/draw", params)
      .then((res) => res.data);

  return {
    patchHtml,
    versePreset,
    drawRedpacket,
  };
};

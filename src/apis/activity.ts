import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export type UserProperties = {
  vip_level: number | null;
  vip_until: string | null;
  ap_limit_bonuses: Record<string, number> | null;
  [key: string]: unknown;
};

export type CharacterListEntry = {
  uuid: string;
  name: string;
  avatar_img: string | null;
  [key: string]: unknown;
};

export type SelectedCollection = {
  id: number;
  storyId: string;
  name: string;
  coverUrl: string | null;
  shareUrl: string | null;
  pageLength: number | null;
  version: string | null;
  aspect: string | null;
  status: string | null;
  user_uuid: string | null;
  user_nick_name: string | null;
  user_avatar_url: string | null;
  user_properties: UserProperties | null;
  activity: string | null;
  likeCount: number | null;
  likeStatus: string | null;
  favorStatus: string | null;
  sameStyleCount: number | null;
  picCount: number | null;
  character_list: CharacterListEntry[] | null;
  mtime: string | null;
  ctime: string | null;
  is_interactive: boolean | null;
  highlight_timestamp_ms: number | null;
  [key: string]: unknown;
};

export type FetchSelectedCollectionsResponse = {
  total: number;
  page_index: number;
  page_size: number;
  list: SelectedCollection[];
  has_next: boolean | null;
  has_review_permission: boolean | null;
  top_list: unknown[] | null;
};

export const createActivityApis = (client: AxiosInstance) => {
  const fetchSelectedCollections = async (
    activityUuid: string,
    params: {
      page_index: number;
      page_size: number;
      sort_by?: string;
    },
    config?: InternalAxiosRequestConfig,
  ) => {
    const url = `/v1/activities/${encodeURIComponent(activityUuid)}/selected-stories/highlights`;
    return client
      .get<FetchSelectedCollectionsResponse>(url, {
        ...config,
        params,
      })
      .then((res) => res.data);
  };

  return {
    fetchSelectedCollections,
  };
};

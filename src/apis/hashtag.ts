import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export type LoreEntry = {
  uuid: string;
  name: string;
  category: string;
  description: string;
  bind_hashtag_info: unknown;
  [key: string]: unknown;
};

export interface Hashtag {
  uuid: string;
  name: string;
  creator: unknown;
}

export type HashtagInfo = {
  name: string;
  lore: LoreEntry[];
  tab_names: string[] | null;
  creator_name: string | null;
  activity_detail: {
    uuid: string;
  } | null;
  hashtag_heat: number | null;
  subscribe_count: number | null;
  [key: string]: unknown;
};

export type CharacterInfo = {
  uuid: string;
  type: string;
  ref_uuid: string;
  name: string;
  short_name: string;
  status: string;
  accessibility: string;
  platform: string;
  config: {
    traits: unknown;
    avatar_img: string | null;
    header_img: string | null;
    latin_name: string;
    travel_preview: string;
    char_info: {
      tone: string;
      toneeg: string;
      background: string;
    };
    is_cheerupable: boolean;
  };
  ctime: string;
  mtime: string;
  ptime: string;
  review_status: string;
  creator: {
    uuid: string;
    avatar_url: string | null;
    nick_name: string;
    subscriber_count: number | null;
    story_count: number | null;
    subscribe_status: string | null;
    status: string;
    properties: {
      vip_level: string | null;
      vip_until: string | null;
      ap_limit_bonuses: Record<string, number>;
    };
    badges: unknown;
  };
  sub_type: string | null;
  is_favored: boolean | null;
  is_used: boolean | null;
  heat_score: number | null;
  in_catalog_ctime: string | null;
  [key: string]: unknown;
};

export type FetchCharactersByHashtagResponse = {
  total: number;
  page_index: number;
  page_size: number;
  list: CharacterInfo[];
  has_next: boolean;
  has_review_permission: boolean | null;
};

export const createHashtagApis = (client: AxiosInstance) => {
  const createHashtag = (name: string, fromHashtag?: string) =>
    client
      .post<Hashtag>("/v1/hashtag/", { name, base_hashtag: fromHashtag })
      .then((res) => res.data);

  const fetchHashtag = async (
    hashtag: string,
    config?: InternalAxiosRequestConfig,
  ) => {
    const url = `/v1/hashtag/hashtag_info/${encodeURIComponent(hashtag)}`;
    return client.get<HashtagInfo>(url, config).then((res) => res.data);
  };

  const fetchCharactersByHashtag = async (
    hashtag: string,
    params: {
      page_index: number;
      page_size: number;
      sort_by?: string;
      parent_type?: string;
    },
    config?: InternalAxiosRequestConfig,
  ) => {
    const url = `/v1/hashtag/${encodeURIComponent(hashtag)}/tcp-list`;
    return client
      .get<FetchCharactersByHashtagResponse>(url, {
        ...config,
        params,
      })
      .then((res) => res.data);
  };

  return {
    createHashtag,
    fetchHashtag,
    fetchCharactersByHashtag,
  };
};

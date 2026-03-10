import type { AxiosInstance } from "axios";
import type { GenericPagination, OriginalCharacterProfile } from "./types.ts";

export interface TravelParentItem {
  uuid: string;
  type: "oc" | "elementum" | "official";
  ref_uuid: string;
  name: string;
  short_name: string;
  status: string;
  accessibility: "PUBLIC" | "PRIVATE";
  platform: string;
  config: {
    traits?: string[] | null;
    avatar_img?: string;
    header_img?: string;
    latin_name?: string;
    travel_preview?: string | null;
    char_info?: {
      tone: string;
      toneeg: string;
      background: string;
    };
    is_cheerupable: boolean;
  };
  ctime: string;
  mtime: string;
  ptime: string | null;
  review_status: "PASS" | "REVIEW" | "REJECTED";
  creator: {
    uuid: string;
    avatar_url: string;
    nick_name: string;
  } | null;
  sub_type: string | null;
  is_favored: boolean | null;
  is_used: boolean | null;
  heat_score: number | null;
  in_catalog_ctime: string | null;
}

export interface TravelParentListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: TravelParentItem[];
  has_next: boolean | null;
  has_review_permission: boolean | null;
}

/**
 * 收藏夹中的角色/元素项
 */
export interface FavoritedParentItem extends TravelParentItem {
  /** 收藏时间 */
  favor_ctime: string;
  /** 文件夹 ID */
  folder_id: number | null;
}

/**
 * 收藏夹列表响应
 */
export interface TravelParentFavorListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: FavoritedParentItem[];
  has_next: boolean | null;
}

export const createTcpApis = (client: AxiosInstance) => {
  const searchTCPs = async (query: {
    keywords: string;
    page_index: number;
    page_size: number;
    parent_type: ("oc" | "elementum")[] | "oc" | "elementum";
    sort_scheme?: "exact" | "best";
    hashtag_name?: string;
  }) => {
    return client
      .get<
        GenericPagination<{
          type: "official" | "oc" | "elementum";
          uuid: string;
          name: string;
          config: {
            avatar_img?: string;
            header_img?: string;
          };
        }>
      >("/v2/travel/parent-search", { params: query })
      .then((res) => res.data);
  };

  const tcpProfile = async (uuid: string) => {
    return client
      .get<{
        type: "official" | "oc" | "elementum";
        uuid: string;
        name: string;
        config: {
          avatar_img?: string;
          header_img?: string;
        };
        oc_bio: OriginalCharacterProfile;
      } | null>(`/v2/travel/parent/${uuid}/profile`)
      .then((res) => res.data);
  };

  /**
   * 获取用户的角色/元素列表
   */
  const getTravelParent = async (params: {
    user_uuid: string;
    parent_type: "oc" | "elementum";
    page_index?: number;
    page_size?: number;
  }): Promise<TravelParentListResponse> => {
    const { user_uuid, parent_type, page_index = 0, page_size = 20 } = params;
    return client
      .get<TravelParentListResponse>("/v2/travel/parent", {
        params: {
          user_uuid,
          parent_type,
          page_index,
          page_size,
        },
      })
      .then((res) => res.data);
  };

  /**
   * 获取用户收藏夹中的角色/元素列表
   * 注意：此接口仅接受 APP 请求，需要正确的 token 类型
   */
  const getTravelParentFavorList = async (params: {
    parent_type?: "oc" | "elementum";
    page_index?: number;
    page_size?: number;
  }): Promise<TravelParentFavorListResponse> => {
    const { parent_type, page_index = 0, page_size = 20 } = params;
    return client
      .get<TravelParentFavorListResponse>("/v2/travel/parent/parent-favor/list", {
        params: {
          ...(parent_type ? { parent_type } : {}),
          page_index,
          page_size,
        },
      })
      .then((res) => res.data);
  };

  return {
    searchTCPs,
    tcpProfile,
    getTravelParent,
    getTravelParentFavorList,
  };
};

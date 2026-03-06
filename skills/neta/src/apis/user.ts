import type { AxiosInstance } from "axios";

export type UserSubscribeStatus =
  | "UNSUBSCRIBE"
  | "SUBSCRIBE"
  | "MUTUALLY_SUBSCRIBE"
  | "FAN"
  | "BLACKLIST"
  | "BLOCKED";

export interface Badge {
  ctime: string;
  description: string;
  icon_url: string | null;
  small_icon_url: string | null;
  mtime: string;
  name: string;
  sort_index: number;
  status: "PUBLISHED" | "DEPRECATED";
  uuid: string;
  /** 类型
   * 普通勋章 | 头像框 | 认证标记
   */
  type: "BADGE" | "AVATAR_FRAME" | "VERIFICATION_BADGE" | "THOUMASK_BADGE";
  /** 头像框 url */
  avatar_frame_url: string | null;
  /** 头像框 gif url */
  avatar_frame_gif_url: string | null;
  /** 认证标记 icon url */
  verification_icon_url: string | null;
  /** 认证标记小图标 url */
  verification_small_icon_url: string | null;
  /** 认证标记装饰图标 url */
  verification_decor_icon_url: string | null;

  badge_no?: number;
}

export type UserPrivilegeType =
  | "unlimited_image_gen"
  | "html_patch"
  | "watermark_remove";

export interface UserPrivilege {
  privilege_type: UserPrivilegeType;
  is_active: boolean;
  valid_until: string;
  valid_until_timestamp: number;
  time_remaining_seconds: number;
  source_type: "purchase";
  config: { enable: boolean } | null;
}

/**
 * 电量值 Action Point
 */
export interface UserApInfo {
  // 实际可用电量放这里
  ap: number;
  ap_limit: number;
  /**
   * 每日免费电量 For oversea
   */
  temp_ap?: number;
  // 服务端返回的ap放这里
  paid_ap?: number;
  /** 无限时长 */
  unlimited_until: number | null;
  /** 真无限时长 */
  true_unlimited_until?: number | null;
}

/**
 * 高能电量
 */
export interface UserLightningInfo {
  lightning: number;
  freeze: number;
}

/** 用户信息 */
export interface UserInfo {
  /**
   * 用户 id
   */
  id: number;
  /** 用户 uuid */
  uuid: string;

  /**
   * 用户昵称
   */
  nick_name?: string | null;
  /** 手机号 */
  phone_num: string | null;
  /** 用户头像 */
  avatar_url: string | null;

  /** 用户访问权限、验证码授权状态 */
  status: "VERIFIED" | "UNVERIFIED" | "DELETE" | null;

  /** 公众号订阅状态 */
  subscribe: boolean | null;

  /**
   * 电量值
   */
  ap_info: UserApInfo | null;
  lightning_info: UserLightningInfo | null;

  /** 订阅数 */
  total_subscribes: number | null;
  /** 粉丝数 */
  total_fans: number | null;
  /** 获赞数 */
  total_likes: number | null;
  /** 被捏同款数 */
  total_same_style: number | null;
  /** 作品数 */
  total_collections: number | null;
  /** 和当前用户的关注状态 */
  subscribe_status: UserSubscribeStatus | null;

  complete_newbie_experience: boolean | null;

  /**
   * 生图数量
   */
  total_pictures: number | null;
  /**
   * 奇遇任务完成数量
   */
  total_mission_records: number | null;
  /**
   * 奇遇角色数量
   */
  total_travel_characters: number | null;

  /**
   * 是否已绑定微信
   */
  is_wechat_verified: boolean;

  is_apple_verified: boolean;

  // * ---------------- deprecated
  /**
   * 用户名
   * @deprecated
   */
  name: string;

  // * ---------------- overseas

  email?: string | null;
  /**
   * 会员到期时间
   * 印鸽订单更新时间戳
   */
  properties: {
    vip_until?: string;
    /**
     * VIP 等级 for oversea
     */
    vip_level?: 0 | 1 | 2 | 3;
    goods_order_modify_mstimestamp?: number;
  } | null;

  /**
   * 是否发布过捏宝
   */
  oc_published?: boolean;

  /**
   * 是否是内部用户
   */
  is_internal?: boolean;

  /**
   * 是否是匿名用户
   */
  is_anonymous?: boolean;

  badges?: Badge[];

  /** 权益 */
  privileges: UserPrivilege[];
}

export interface SubscribeUserResponse {
  success: boolean;
  subscribe_status?: UserSubscribeStatus | null;
}

export interface UserListItem {
  uuid: string;
  name: string;
  avatar_url: string;
  total_fans: number | null;
  total_collections: number | null;
  subscribe_status: UserSubscribeStatus | null;
}

export interface UserListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: UserListItem[];
  has_next: boolean | null;
  has_review_permission: boolean | null;
}

export const createUserApis = (client: AxiosInstance) => {
  return {
    me: async () => {
      const res = await client.get<UserInfo>("/v1/user/");
      return res.data ?? null;
    },
    subscribeUser: async (params: {
      user_uuid: string;
      is_cancel?: boolean;
    }): Promise<SubscribeUserResponse> => {
      const response = await client.request({
        method: "PUT",
        url: "/v1/user/user-subscribe",
        data: {
          user_uuid: params.user_uuid,
          is_cancel: params.is_cancel ?? false,
        },
      });

      return {
        success: response.status === 200 || response.status === 204,
        subscribe_status: (response.data as Partial<UserInfo>)
          ?.subscribe_status,
      };
    },
    getSubscribeList: async (params?: {
      page_index?: number;
      page_size?: number;
    }): Promise<UserListResponse> => {
      const response = await client.request({
        method: "GET",
        url: "/v1/user/subscribe-list",
        params: {
          page_index: params?.page_index ?? 0,
          page_size: params?.page_size ?? 20,
        },
      });
      return response.data as UserListResponse;
    },
    getFanList: async (params?: {
      page_index?: number;
      page_size?: number;
    }): Promise<UserListResponse> => {
      const response = await client.request({
        method: "GET",
        url: "/v1/user/fan-list",
        params: {
          page_index: params?.page_index ?? 0,
          page_size: params?.page_size ?? 20,
        },
      });
      return response.data as UserListResponse;
    },
  };
};

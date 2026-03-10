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

export interface UserStory {
  id: number;
  storyId: string;
  name: string;
  coverUrl: string;
  shareUrl: string;
  pageLength: number;
  version: string;
  aspect: string;
  status: "PUBLISHED" | "PRIVATE" | "DRAFT";
  user_uuid: string;
  user_nick_name: string;
  user_avatar_url: string;
  likeCount: number;
  likeStatus: "unliked" | "liked";
  favorStatus: "not_favorited" | "favorited";
  commentCount: number | null;
  sharedCount: number | null;
  sameStyleCount: number;
  picCount: number;
  ctime: string;
  mtime: string;
  is_pinned: boolean;
  hashtag_names: string[];
  is_interactive: boolean;
}

export interface UserStoriesResponse {
  theme: string;
  total: number;
  page_index: number;
  page_size: number;
  list: UserStory[];
  biz_trace_id: string;
}

export interface Manuscript {
  uuid: string;
  name: string;
  cover_url: string;
  status: string;
  ctime: string;
  mtime: string;
}

export interface ManuscriptListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: Manuscript[];
  has_next: boolean;
}

export interface CheckinStatus {
  today_signed: boolean;
  streak_count: number;
  cycle_day: number;
  cycle_signed_history: boolean[];
  reward_list: any[];
}

export interface DoCheckinResponse {
  message: string;
}

export interface MessageCount {
  data: {
    like?: number;
    interacts?: number;
    subscribe?: number;
    [key: string]: number | undefined;
  };
}

export interface OCWorld {
  uuid: string;
  name: string;
  description: string;
  cover_url: string;
  character_count: number;
  ctime: string;
}

/** 关注列表项 */
export interface SubscribeItem {
  id: number;
  uuid: string;
  nick_name: string;
  avatar_url: string;
  subscribe_status: UserSubscribeStatus;
  total_subscribes: number;
  total_fans: number;
  total_likes: number;
  total_collections: number;
  badges?: Badge[];
}

/** 关注列表响应 */
export interface SubscribeListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: SubscribeItem[];
  has_next: boolean;
}

/** 粉丝列表响应 */
export interface FanListResponse {
  total: number;
  page_index: number;
  page_size: number;
  list: SubscribeItem[];
  has_next: boolean | null;
  has_review_permission: boolean | null;
}

export const createUserApis = (client: AxiosInstance) => {
  return {
    me: async () => {
      const res = await client.get<UserInfo>("/v1/user/");
      return res.data ?? null;
    },

    /**
     * 获取用户 AP 电量信息
     */
    getApInfo: async () => {
      const res = await client.get<UserApInfo>("/v2/user/ap_info");
      return res.data ?? null;
    },

    /**
     * 获取用户发布的帖子/故事列表
     * @param uuid 用户 UUID
     * @param page_index 页码（从 0 开始）
     * @param page_size 每页数量（默认 20）
     */
    getUserStories: async (
      uuid: string,
      page_index = 0,
      page_size = 20,
    ) => {
      const res = await client.get<UserStoriesResponse>(
        "/v2/story/user-stories",
        {
          params: { uuid, page_index, page_size },
        },
      );
      return res.data;
    },

    /**
     * 获取用户草稿/稿件列表
     * @param page_index 页码（从 0 开始）
     * @param page_size 每页数量（默认 24）
     */
    getManuscriptList: async (page_index = 0, page_size = 24) => {
      const res = await client.get<ManuscriptListResponse>(
        "/v1/manuscript/list",
        {
          params: { page_index, page_size },
        },
      );
      return res.data;
    },

    /**
     * 获取签到状态
     */
    getCheckinStatus: async () => {
      const res = await client.get<CheckinStatus>("/v1/checkin/status");
      return res.data;
    },

    /**
     * 执行签到
     */
    doCheckin: async () => {
      const res = await client.post<DoCheckinResponse>("/v1/checkin/manual", null);
      return res.data;
    },

    /**
     * 获取消息数量
     */
    getMessageCount: async () => {
      const res = await client.get<MessageCount>("/v1/message/message-count");
      return res.data;
    },

    /**
     * 获取 OC 世界列表
     */
    getOCWorlds: async () => {
      const res = await client.get<OCWorld[]>("/v2/oc/list-worlds");
      return res.data ?? [];
    },

    /**
     * 获取用户关注列表
     * @param page_index 页码（从 0 开始）
     * @param page_size 每页数量（默认 20）
     */
    getSubscribeList: async (page_index = 0, page_size = 20) => {
      const res = await client.get<SubscribeListResponse>(
        "/v1/user/subscribe-list",
        {
          params: { page_index, page_size },
        },
      );
      return res.data;
    },

    /**
     * 获取用户粉丝列表
     * @param visit_user_uuid 要查询粉丝的用户 UUID
     * @param page_index 页码（从 0 开始）
     * @param page_size 每页数量（默认 20）
     */
    getFanList: async (
      visit_user_uuid: string,
      page_index = 0,
      page_size = 20,
    ) => {
      const res = await client.get<FanListResponse>(
        "/v1/user/visitor-fan-list",
        {
          params: { visit_user_uuid, page_index, page_size },
        },
      );
      return res.data;
    },
  };
};

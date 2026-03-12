import type { AxiosInstance } from "axios";
import qs from "qs";
import type { CharacterPrompt } from "../utils/prompts.ts";
import type { ArtifactDetail, ArtifactVerseListStatus } from "./types.ts";
import type { UserInfo, UserSubscribeStatus } from "./user.ts";

export type CollectionStatus =
  | "INIT"
  | "DRAFT"
  | "PUBLISHED"
  | "DELETED"
  | "PRIVATE";

export interface CommentDetail {
  uuid: string;
  content: string;
  at_users: string[];
  img_url: string | null;
  artifact_uuid: string | null;
  parent_type: string;
  level: number;
  status: string;
  user_uuid: string;
  user_nick_name: string;
  user_avatar_url: string;
}

export interface CreateCommentResponse {
  success: boolean;
  comment?: CommentDetail;
}

type CollectionBasic = {
  /** 作品 uuid */
  uuid: string;
  /** 作品名称 */
  name: string;
  /** 作品描述 */
  description: string | null;
  /** 作品类型+小版本 */
  version: "3.0.0";
  /** 作品当前发布状态 */
  status: CollectionStatus;

  activity: string | null;

  /** 作品创建时间 */
  ctime: string;

  /** 作品修改时间 */
  mtime: string;

  // 旧版本 collection
  content: object | null;

  aspect: string | null;
};

type CollectionDetail = CollectionBasic & {
  /** 封面图 url */
  coverUrl: string | null;

  /** 分享图 url */
  shareUrl: string | null;
  /**
   * 图片数， 有模版的拼接图算一张
   */
  picCount: number | null;
  /** 作品参与的活动 */
  activityData?: {
    name: string;
    title: string;
    uuid: string;
  };

  /** 作品的展示数据 */
  displayData: {
    pages: {
      images: ArtifactDetail[];
    }[];
    mission_record_uuid?: string | null;
    seed_campaign_uuid?: string | null;
    is_declare_ai?: boolean;
  };
  /** 作品的编辑数据 */
  editorData: {
    pages: {
      images: ArtifactDetail[];
    }[];
    mission_record_uuid?: string | null;
    seed_campaign_uuid?: string | null;
  };

  hashtags?: string[] | null;

  bgm_uuid?: string | null;

  /**
   * only for verse
   */
  video_uuid?: string | null;

  is_interactive?: boolean | null;

  extra_data?: {
    remix_instruct?: string;
  };
};

export type CollectionPublishPayload = Partial<
  Omit<CollectionDetail, "ctime" | "mtime" | "uuid" | "name" | "description">
> & {
  /**
   * 作品当中出现的所有 character 用于建立作品与角色关系
   */
  refCharacterTokens?: CharacterPrompt[];
  //
  uuid: string;
  name: string;
  description: string;
  //
  additional_verse_artifact_uuid?: string | null;
};

export interface CreatorForStoryShowcase {
  uuid: string;
  nick_name: string;
  avatar_url: string;
  subscribe_status: UserSubscribeStatus;
  properties: UserInfo["properties"];
}

interface BaseModule {
  module_id: string;
  template_id: string;
  json_data: unknown;
  data_id: string;
}

interface NewsMainHeaderNormalModule extends BaseModule {
  template_id: "head_filter_module";
  json_data: {
    filter_list: { theme: string }[];
    selected_theme: string;
  };
}

interface ActivityModule extends BaseModule {
  template_id: "ACTIVITY";
  json_data: {
    sub_activities: {
      uuid: string;
      tag_name: string;
      title: string;
      start_time: number;
      end_time: number;
      status: "RUNNING";
      popularity: number;
      participants_count: number;
      banner_pic: string;
      small_banner_pic: string;
      creator_name: string;
      creator_avatar_url: string;
      weight: number;
    }[];
    event_tracking: Record<string, unknown>;
  };
}

interface NormalModule extends BaseModule {
  template_id: "NORMAL";
  json_data: {
    id: number;
    storyId: string;
    name: string;
    coverUrl: string;
    shareUrl: string;
    pageLength: number;
    version: string | null;
    api_version: string | null;
    aspect: string;
    content: string | null;
    status: string;
    isRecommended: boolean | null;
    score: number | null;
    userId: number | null;
    user_uuid: string;
    user_nick_name: string;
    user_avatar_url: string;
    user_properties: UserInfo["properties"];
    activity: string | null;
    has_video: boolean;
    has_bgm: boolean | null;
    video_uuid: string;
    likeCount: number;
    likeStatus: CollectionLikeStatus;
    favorStatus: CollectionFavorStatus;
    commentCount: number | null;
    sharedCount: number | null;
    sameStyleCount: number;
    picCount: number;
    character_list: unknown[];
    mtime: string;
    ctime: string;
    images: unknown[] | null;
    is_pinned: boolean | null;
    hashtag_names: string[];
    hashtag_show: {
      activity?: string;
      hashtag?: string;
    };
    recall_type: string;
    rank_score: number;
    is_interactive: boolean;
    event_tracking: Record<string, unknown>;
    extra_datas: Record<string, unknown>;
  };
}

interface TopicModule extends BaseModule {
  template_id: "TOPIC";
  json_data: {
    uuid: string;
    tag_name: string;
    title: string;
    start_time: number;
    end_time: number;
    status: "RUNNING";
    popularity: number;
    participants_count: number;
    banner_pic: string;
    small_banner_pic: string;
    creator_name: string;
    creator_avatar_url: string;
    weight: number;
  };
}

export type CommunityModule =
  | NewsMainHeaderNormalModule
  | ActivityModule
  | NormalModule
  | TopicModule;

interface ModuleListHeader {
  module_list: CommunityModule[];
}

interface PageData {
  page_index: number;
  page_size: number;
  has_next_page: boolean;
  biz_trace_id: string;
}

export interface FeedMainList {
  module_list_header: ModuleListHeader;
  module_list: CommunityModule[];

  page_data: PageData;
}

interface CTAInfoBasic {
  interactive_status: ("SUCCESS" & string) | null;
  interactive_config: {
    hint: string;
    intention: null;
    input_type: "verse" | null;
    verse_uuid?: string;
    button_name: string;
    verse_artifact_uuid?: string;
  } | null;
}

interface NormalCTAInfo extends CTAInfoBasic {
  type: "verse_1";
  launch_prompt: {
    core_input: string;
    brief_input: string;
    ref_image: { uuid: string; url: string }[];
  };
}

interface Exp1CTAInfo extends CTAInfoBasic {
  type: "verse_exp_1";
  /** 问题 */
  question: string;
  /**
   * 选择文本 && 对应 input
   */
  choices: {
    button_text: string;
    core_input: string;
    ref_image: { uuid: string; url: string }[];
  }[];
}

interface Exp2CTAInfo extends CTAInfoBasic {
  type: "verse_exp_2";
  /** 角色发言 */
  character_text: string;
  launch_prompt: {
    core_input: string;
    brief_input: string;
    ref_image: [];
  };
}

interface Exp3CTAInfo extends CTAInfoBasic {
  type: "verse_exp_3";
  amount_of_character: number;
  characters: { uuid: string; name: string; avatar_img: string }[];
  launch_prompt: {
    core_input: string;
    brief_input: string;
    ref_image: [];
  };
}

export interface HashtagUnitCTA {
  type: "hashtag_unit_cta";
  cover_image: string;
  title: string;
  desc: string;
  button: {
    text_new: string;
    scheme: string;
  };
}

export interface NormalImageCTA extends Omit<NormalCTAInfo, "type"> {
  type: "image_1";
}

type CTAInfo =
  | NormalCTAInfo
  | Exp1CTAInfo
  | Exp2CTAInfo
  | Exp3CTAInfo
  | HashtagUnitCTA
  | NormalImageCTA;

export type CollectionLikeStatus = "liked" | "unliked" | null;
export type CollectionFavorStatus = "not_favorited" | "favorited" | null;

export interface DisplayData {
  mission_record_uuid?: string | null;
  seed_campaign_uuid?: string | null;
  is_declare_ai?: boolean;
  pages: {
    images: ArtifactDetail[];
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
}

export interface NormalInteractionData {
  uuid: string;
  name: string;
  description: string | null;
  status: CollectionStatus;
  aspect?: string;
  commentCount: number;
  coverUrl: string;
  picCount: number;
  sharedCount: number;
  likeCount: number;
  likeStatus: CollectionLikeStatus;
  favorStatus: CollectionFavorStatus;
  has_video: boolean;
  is_interactive: true;
  mtime: string | null;
  ctime: string;
  creator: CreatorForStoryShowcase;
  cta_info: CTAInfo;
  displayData: DisplayData;
}

export interface NormalInteractionModule extends BaseModule {
  template_id: "NORMAL";
  json_data: NormalInteractionData;
}

export interface DraftInteractionData {
  creator: CreatorForStoryShowcase;
  displayData: DisplayData;
  uuid: string;
  modality: "VERSE";
  label: {
    icon: null;
    text: string;
    background_color: string;
    text_color: string;
    type: "user_tag";
  };
  cta_info: {
    type: "manuscript_cta";
    question: string;
    avatar_url?: string;
    choices: { text: string; scheme: string; background_color: string }[];
  };
  event_tracking: unknown;
  view_scheme?: string;
}

interface DraftInteractionModule extends BaseModule {
  template_id: "DRAFT";
  json_data: DraftInteractionData;
}

export interface SpaceInteractionData {
  preset_key: string;
  readable_info: {
    col_list: string[];
    space: string;
  };
  space: string;
  scheme: string;
  cover_url: string;
  next_action: {
    intent_type: [string, string];
    detail: {
      item_uuids: string[];
      target_tag: string;
    };
  };
}

export interface SpaceInteractionModule extends BaseModule {
  template_id: "into_space";
  json_data: SpaceInteractionData;
}

export type FeedInteractionModule =
  | NormalInteractionModule
  | DraftInteractionModule
  | SpaceInteractionModule;

export interface FeedInteractionList {
  module_list_header: null;
  module_list: FeedInteractionModule[];

  page_data: PageData;
}

export interface HomeStatusQueueItem {
  id: number;
  uuid: string;
  mtime: string;
  running_status: ArtifactVerseListStatus;
}

export const isVerseCTA = (
  cta_info: CTAInfo,
): cta_info is NormalCTAInfo | Exp1CTAInfo | Exp2CTAInfo | Exp3CTAInfo => {
  return "interactive_config" in cta_info;
};

export const createCollectionApis = (client: AxiosInstance) => {
  const createCollection = async () => {
    return client
      .get<{
        data: { uuid: string };
      }>("/v1/story/new-story")
      .then((res) => res.data.data.uuid);
  };

  const saveCollection = async (
    payload: Partial<CollectionPublishPayload> & { uuid: string },
  ) => {
    return await client
      .put<CollectionDetail>("/v3/story/story", payload)
      .then((res) => res.data);
  };

  const publishCollection = async (
    uuid: string,
    options?: {
      triggerTCPCommentNow?: boolean;
      triggerSameStyleReply?: boolean;
      sync_mode?: boolean;
    },
  ) => {
    const { triggerTCPCommentNow, triggerSameStyleReply, sync_mode } =
      options ?? {};
    return client
      .put<{
        status: string;
      }>(
        `/v1/story/story-publish?${qs.stringify({
          storyId: uuid,
          triggerTCPCommentNow: triggerTCPCommentNow ?? false,
          triggerSameStyleReply: triggerSameStyleReply ?? false,
          sync_mode: sync_mode ?? false,
        })}`,
      )
      .then((res) => res.data.status === "SUCCESS");
  };

  const collectionDetails = async (uuids: string[]) => {
    return client
      .get<CollectionDetail[]>("/v3/story/story-detail", {
        params: {
          uuids: uuids.join(","),
        },
      })
      .then((res) => res.data);
  };

  const likeCollection = async (
    storyId: string,
    options?: { is_cancel?: boolean },
  ) => {
    const { is_cancel } = options ?? {};
    const response = await client.request({
      method: "PUT",
      url: "/v1/story/story-like",
      data: {
        storyId,
        is_cancel: is_cancel ?? false,
      },
    });

    return response.status === 200 || response.status === 204;
  };

  const createComment = async (params: {
    content: string;
    parent_uuid: string;
    parent_type: "collection" | "character" | "elementum";
    at_users?: string[];
  }): Promise<CreateCommentResponse> => {
    const response = await client.request({
      method: "POST",
      url: "/v1/comment/comment",
      data: {
        content: params.content,
        parent_uuid: params.parent_uuid,
        parent_type: params.parent_type,
        at_users: params.at_users ?? [],
      },
    });

    return {
      success: response.status === 200 || response.status === 201,
      comment: response.data as CommentDetail | undefined,
    };
  };

  const favorCollection = async (
    storyId: string,
    options?: { is_cancel?: boolean },
  ): Promise<{ success: boolean }> => {
    const { is_cancel } = options ?? {};
    const response = await client.request({
      method: "PUT",
      url: "/v1/story/story-favor",
      data: {
        storyId,
        is_cancel: is_cancel ?? false,
      },
    });

    return {
      success: response.status === 200 || response.status === 204,
    };
  };

  return {
    createCollection,
    saveCollection,
    publishCollection,
    collectionDetails,
    likeCollection,
    createComment,
    favorCollection,
  };
};

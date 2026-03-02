import type { AxiosInstance } from "axios";
import qs from "qs";
import type { CharacterPrompt } from "../utils/prompts.ts";
import type { ArtifactDetail } from "./types.ts";

export type CollectionStatus =
  | "INIT"
  | "DRAFT"
  | "PUBLISHED"
  | "DELETED"
  | "PRIVATE";

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

  return {
    createCollection,
    saveCollection,
    publishCollection,
    collectionDetails,
  };
};

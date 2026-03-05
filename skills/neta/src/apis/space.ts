import type { AxiosInstance } from "axios";
import { safeParseJson } from "../utils/json.ts";

type Space = {
  name: string;
  space_uuid: string;
  main_hashtag_name: string;
  cover_image: string;
  topic_count: number;
};

type SpaceTopic = {
  hashtag_name: string;
  description: string;
  cta_text: string;
  cover_url: string;
  relation_type: "TOP" | "NORMAL";
  subscribe_count: number;
  tcp_count: number;
  topic_tags: Record<string, string>;
};

type SpaceFeedItem = {
  uuid: string;
  title: string;
  same_style_count: number;
  cover_url: string;
  next_view_url: string;
};

type SpaceConfig = {
  description: string;
  long_description: string;
  banner_pic: string;
  header_pic: string;
  cta_text: string;
  tags: Record<string, string>;
  curated_works: {
    uuid: string;
    title: string;
    one_line_description: string;
    collection_banner_pic: string;
  };
};

export const createSpaceApis = (client: AxiosInstance) => {
  const basic = async (hashtag_name: string) => {
    const res = await client.get<Space>("/v1/space/get-by-hashtag", {
      params: {
        hashtag_name,
      },
    });
    return res.data;
  };

  const topics = async (space_uuid: string) => {
    const res = await client.get<{
      primary_topic: SpaceTopic;
      topics: SpaceTopic[];
    }>("/v1/space/topics", {
      params: {
        space_uuid,
      },
    });
    return res.data;
  };

  const feeds = async (params: {
    page_index: number;
    page_size: number;
    hashtag_name: string;
  }) => {
    return await client
      .get<{
        collection_feed_item: SpaceFeedItem[];
      }>("/v1/space/collection/feed", {
        params,
      })
      .then((res) => res.data)
      .then((res) =>
        res.collection_feed_item.map((item) => ({
          uuid: item.uuid,
          title: item.title,
          same_style_count: item.same_style_count,
          cover_url: item.cover_url,
          next_view_url: item.next_view_url,
        })),
      );
  };

  const spaceConfigs = async () => {
    const res = await client.get<{
      value: string;
    }>("/v1/configs/config?namespace=space&key=topic_tags_config");
    return safeParseJson<Record<string, SpaceConfig>>(res.data.value) ?? {};
  };

  const spaceHashtags = async () => {
    const res = await client.get<{
      value: string;
    }>("/v1/configs/config?namespace=space&key=new_version_hashtag");
    return safeParseJson<string[]>(res.data.value) ?? [];
  };

  return {
    basic,
    topics,
    feeds,
    spaceHashtags,
    spaceConfigs,
  };
};

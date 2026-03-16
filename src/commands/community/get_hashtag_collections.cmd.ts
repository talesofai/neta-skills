import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

const fetchSelectedCollectionsByHashtagV1Parameters = Type.Object({
  hashtag: Type.String(),
  page_index: Type.Integer({ minimum: 0, default: 0 }),
  page_size: Type.Integer({ minimum: 1, maximum: 100, default: 20 }),
  sort_by: Type.Union([Type.Literal("highlight_mark_time")], {
    default: "highlight_mark_time",
  }),
});

export const getHashtagCollections = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: fetchSelectedCollectionsByHashtagV1Parameters,
  },
  async (
    {
      hashtag,
      page_index = 0,
      page_size = 20,
      sort_by = "highlight_mark_time",
    },
    { apis },
  ) => {
    // 通过hashtag获取对应的activity_uuid
    const hashtagResult = await apis.hashtag.fetchHashtag(hashtag);
    const activityDetail = hashtagResult?.activity_detail;
    const activity_uuid = activityDetail?.uuid;

    if (!activity_uuid) {
      throw new Error(`Hashtag "${hashtag}" 未关联任何活动空间`);
    }

    const result = await apis.activity.fetchSelectedCollections(activity_uuid, {
      page_index,
      page_size,
      sort_by,
    });

    // 转换API返回结果为工具输出格式
    const simplifiedList = (result.list || []).map((collection) => ({
      uuid: collection.storyId,
      name: collection.name,
      coverUrl: collection.coverUrl,
      creator_name: collection.user_nick_name,
      likeCount: collection.likeCount,
      sameStyleCount: collection.sameStyleCount,
      ctime: collection.ctime,
    }));

    return {
      total: result.total,
      page_index: result.page_index,
      page_size: result.page_size,
      list: simplifiedList,
    };
  },
);

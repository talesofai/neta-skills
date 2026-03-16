import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const fetchHashtagV1Parameters = Type.Object({
    hashtag: Type.String(),
});
export const getHashtagInfo = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: fetchHashtagV1Parameters,
}, async ({ hashtag }, { apis }) => {
    const result = await apis.hashtag.fetchHashtag(hashtag);
    // 转换API返回结果为工具输出格式
    const activityDetail = result["activity_detail"];
    const simplifiedActivityDetail = activityDetail
        ? {
            uuid: activityDetail.uuid,
            title: activityDetail.title,
            banner_pic: activityDetail.banner_pic,
            creator_name: activityDetail.creator_name,
            review_users: activityDetail.review_users?.map((user) => ({
                uuid: user.uuid,
                name: user.name,
            })) ?? null,
        }
        : null;
    return {
        hashtag: {
            name: result.name,
            lore: result.lore || [],
            activity_detail: simplifiedActivityDetail,
            hashtag_heat: result.hashtag_heat,
            subscribe_count: result.subscribe_count,
        },
    };
});

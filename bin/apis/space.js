import { safeParseJson } from "../utils/json.js";
export const createSpaceApis = (client) => {
    const basic = async (hashtag_name) => {
        const res = await client.get("/v1/space/get-by-hashtag", {
            params: {
                hashtag_name,
            },
        });
        return res.data;
    };
    const topics = async (space_uuid) => {
        const res = await client.get("/v1/space/topics", {
            params: {
                space_uuid,
            },
        });
        return res.data;
    };
    const feeds = async (params) => {
        return await client
            .get("/v1/space/collection/feed", {
            params,
        })
            .then((res) => res.data)
            .then((res) => res.collection_feed_item.map((item) => ({
            uuid: item.uuid,
            title: item.title,
            same_style_count: item.same_style_count,
            cover_url: item.cover_url,
            next_view_url: item.next_view_url,
        })));
    };
    const spaceConfigs = async () => {
        const res = await client.get("/v1/configs/config?namespace=space&key=topic_tags_config");
        return safeParseJson(res.data.value) ?? {};
    };
    const spaceHashtags = async () => {
        const res = await client.get("/v1/configs/config?namespace=space&key=new_version_hashtag");
        return safeParseJson(res.data.value) ?? [];
    };
    return {
        basic,
        topics,
        feeds,
        spaceHashtags,
        spaceConfigs,
    };
};

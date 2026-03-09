export const createHashtagApis = (client) => {
    const createHashtag = (name, fromHashtag) => client
        .post("/v1/hashtag/", { name, base_hashtag: fromHashtag })
        .then((res) => res.data);
    const fetchHashtag = async (hashtag, config) => {
        const url = `/v1/hashtag/hashtag_info/${encodeURIComponent(hashtag)}`;
        return client.get(url, config).then((res) => res.data);
    };
    const fetchCharactersByHashtag = async (hashtag, params, config) => {
        const url = `/v1/hashtag/${encodeURIComponent(hashtag)}/tcp-list`;
        return client
            .get(url, {
            ...config,
            params,
        })
            .then((res) => res.data);
    };
    /**
     * 标记帖子为过审（审核通过）
     * API: POST /v1/hashtag/{hashtag_name}/stories/review/{story_uuid}
     * Body: {"action": "select"}
     */
    const markStoryAsReviewed = async (hashtag, story_uuid) => {
        const url = `/v1/hashtag/${encodeURIComponent(hashtag)}/stories/review/${story_uuid}`;
        const response = await client.post(url, {
            action: "select",
        });
        return response.data;
    };
    /**
     * 标记帖子为精选
     * API: POST /v1/hashtag/{hashtag_name}/stories/review/{story_uuid}
     * Body: {"result":"HIGHLIGHT","item_type":"collection"}
     * Response: {"message":"success"}
     */
    const markStoryAsFeatured = async (hashtag, story_uuid) => {
        const url = `/v1/hashtag/${encodeURIComponent(hashtag)}/stories/review/${story_uuid}`;
        const response = await client.post(url, {
            result: "HIGHLIGHT",
            item_type: "collection",
        });
        return response.data;
    };
    /**
     * 获取标签下的所有帖子（已过审的）
     * API: GET /v1/hashtag/{hashtag_name}/stories
     * 参数：page_index, page_size, sort_by (hot/newest)
     */
    const fetchStoriesByHashtag = async (hashtag, params, config) => {
        const url = `/v1/hashtag/${encodeURIComponent(hashtag)}/stories`;
        return client
            .get(url, {
            ...config,
            params,
        })
            .then((res) => res.data);
    };
    return {
        createHashtag,
        fetchHashtag,
        fetchCharactersByHashtag,
        markStoryAsReviewed,
        markStoryAsFeatured,
        fetchStoriesByHashtag,
    };
};

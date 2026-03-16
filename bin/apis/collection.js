import qs from "qs";
export const isVerseCTA = (cta_info) => {
    return "interactive_config" in cta_info;
};
export const createCollectionApis = (client) => {
    const createCollection = async () => {
        return client
            .get("/v1/story/new-story")
            .then((res) => res.data.data.uuid);
    };
    const saveCollection = async (payload) => {
        return await client
            .put("/v3/story/story", payload)
            .then((res) => res.data);
    };
    const publishCollection = async (uuid, options) => {
        const { triggerTCPCommentNow, triggerSameStyleReply, sync_mode } = options ?? {};
        return client
            .put(`/v1/story/story-publish?${qs.stringify({
            storyId: uuid,
            triggerTCPCommentNow: triggerTCPCommentNow ?? false,
            triggerSameStyleReply: triggerSameStyleReply ?? false,
            sync_mode: sync_mode ?? false,
        })}`)
            .then((res) => res.data.status === "SUCCESS");
    };
    const collectionDetails = async (uuids) => {
        return client
            .get("/v3/story/story-detail", {
            params: {
                uuids: uuids.join(","),
            },
        })
            .then((res) => res.data);
    };
    const likeCollection = async (storyId, options) => {
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
    const createComment = async (params) => {
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
            comment: response.data,
        };
    };
    const favorCollection = async (storyId, options) => {
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

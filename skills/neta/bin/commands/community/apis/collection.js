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
    return {
        createCollection,
        saveCollection,
        publishCollection,
        collectionDetails,
    };
};

export const createCommentApis = (client) => {
    /**
     * 获取合集评论列表
     */
    const getComments = async (collection_uuid, options) => {
        const { cursor, page_size = 20 } = options ?? {};
        const response = await client.get("/v1/story/story-comments", {
            params: {
                storyId: collection_uuid,
                cursor,
                page_size,
            },
        });
        return response.data;
    };
    /**
     * 创建评论或回复评论
     */
    const createComment = async (payload) => {
        const response = await client.post("/v1/story/story-comment", payload);
        return response.data;
    };
    /**
     * 点赞/取消点赞评论
     */
    const toggleLike = async (comment_uuid, like) => {
        const response = await client.post("/v1/story/comment-like", {
            comment_uuid,
            like,
        });
        return response.data;
    };
    /**
     * 删除评论
     */
    const deleteComment = async (comment_uuid) => {
        const response = await client.delete("/v1/story/story-comment", {
            params: {
                comment_uuid,
            },
        });
        return response.data;
    };
    return {
        getComments,
        createComment,
        toggleLike,
        deleteComment,
    };
};

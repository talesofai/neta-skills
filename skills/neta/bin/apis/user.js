export const createUserApis = (client) => {
    return {
        me: async () => {
            const res = await client.get("/v1/user/");
            return res.data ?? null;
        },
        /**
         * 获取用户 AP 电量信息
         */
        getApInfo: async () => {
            const res = await client.get("/v2/user/ap_info");
            return res.data ?? null;
        },
        /**
         * 获取用户发布的帖子/故事列表
         * @param uuid 用户 UUID
         * @param page_index 页码（从 0 开始）
         * @param page_size 每页数量（默认 20）
         */
        getUserStories: async (uuid, page_index = 0, page_size = 20) => {
            const res = await client.get("/v2/story/user-stories", {
                params: { uuid, page_index, page_size },
            });
            return res.data;
        },
        /**
         * 获取用户草稿/稿件列表
         * @param page_index 页码（从 0 开始）
         * @param page_size 每页数量（默认 24）
         */
        getManuscriptList: async (page_index = 0, page_size = 24) => {
            const res = await client.get("/v1/manuscript/list", {
                params: { page_index, page_size },
            });
            return res.data;
        },
        /**
         * 获取签到状态
         */
        getCheckinStatus: async () => {
            const res = await client.get("/v1/checkin/status");
            return res.data;
        },
        /**
         * 执行签到
         */
        doCheckin: async () => {
            const res = await client.post("/v1/checkin/manual", null);
            return res.data;
        },
        /**
         * 获取消息数量
         */
        getMessageCount: async () => {
            const res = await client.get("/v1/message/message-count");
            return res.data;
        },
        /**
         * 获取 OC 世界列表
         */
        getOCWorlds: async () => {
            const res = await client.get("/v2/oc/list-worlds");
            return res.data ?? [];
        },
    };
};

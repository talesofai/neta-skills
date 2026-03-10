export const createTcpApis = (client) => {
    const searchTCPs = async (query) => {
        return client
            .get("/v2/travel/parent-search", { params: query })
            .then((res) => res.data);
    };
    const tcpProfile = async (uuid) => {
        return client
            .get(`/v2/travel/parent/${uuid}/profile`)
            .then((res) => res.data);
    };
    /**
     * 获取用户的角色/元素列表
     */
    const getTravelParent = async (params) => {
        const { user_uuid, parent_type, page_index = 0, page_size = 20 } = params;
        return client
            .get("/v2/travel/parent", {
            params: {
                user_uuid,
                parent_type,
                page_index,
                page_size,
            },
        })
            .then((res) => res.data);
    };
    /**
     * 获取用户收藏夹中的角色/元素列表
     * 注意：此接口仅接受 APP 请求，需要正确的 token 类型
     */
    const getTravelParentFavorList = async (params) => {
        const { parent_type, page_index = 0, page_size = 20 } = params;
        return client
            .get("/v2/travel/parent/parent-favor/list", {
            params: {
                ...(parent_type ? { parent_type } : {}),
                page_index,
                page_size,
            },
        })
            .then((res) => res.data);
    };
    return {
        searchTCPs,
        tcpProfile,
        getTravelParent,
        getTravelParentFavorList,
    };
};

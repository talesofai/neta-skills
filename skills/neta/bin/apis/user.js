export const createUserApis = (client) => {
    return {
        me: async () => {
            const res = await client.get("/v1/user/");
            return res.data ?? null;
        },
        subscribeUser: async (params) => {
            const response = await client.request({
                method: "PUT",
                url: "/v1/user/user-subscribe",
                data: {
                    user_uuid: params.user_uuid,
                    is_cancel: params.is_cancel ?? false,
                },
            });
            return {
                success: response.status === 200 || response.status === 204,
                subscribe_status: response.data
                    ?.subscribe_status,
            };
        },
        getSubscribeList: async (params) => {
            const response = await client.request({
                method: "GET",
                url: "/v1/user/subscribe-list",
                params: {
                    page_index: params?.page_index ?? 0,
                    page_size: params?.page_size ?? 20,
                },
            });
            return response.data;
        },
        getFanList: async (params) => {
            const response = await client.request({
                method: "GET",
                url: "/v1/user/fan-list",
                params: {
                    page_index: params?.page_index ?? 0,
                    page_size: params?.page_size ?? 20,
                },
            });
            return response.data;
        },
    };
};

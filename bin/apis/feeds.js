export const createFeedsApis = (client) => {
    const homeList = (params) => {
        return client.get("/v1/home/feed/mainlist", {
            params,
        });
    };
    const interactiveItem = async (params) => {
        return client
            .get("/v1/home/feed/interactive", {
            params: {
                collection_uuid: params.collection_uuid,
                page_index: 0,
                page_size: 1,
            },
        })
            .then((res) => res.data.module_list[0]);
    };
    const interactiveList = async (params) => {
        return client
            .get("/v1/recsys/feed/interactive", {
            params,
        })
            .then((res) => res.data);
    };
    const tags = (uuid) => client
        .get(`/v1/home/collection/${uuid}/tags`)
        .then((res) => res.data);
    return {
        homeList,
        interactiveList,
        interactiveItem,
        tags,
    };
};

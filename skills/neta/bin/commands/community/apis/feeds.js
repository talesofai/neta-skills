export const createFeedsApis = (client) => {
    const homeList = (params) => {
        return client.get("/v1/home/feed/mainlist", {
            params,
        });
    };
    const interactiveList = async (params) => {
        return client
            .get("/v1/home/feed/interactive", {
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
        tags,
    };
};

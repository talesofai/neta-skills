export const createActivityApis = (client) => {
    const fetchSelectedCollections = async (activityUuid, params, config) => {
        const url = `/v1/activities/${encodeURIComponent(activityUuid)}/selected-stories/highlights`;
        return client
            .get(url, {
            ...config,
            params,
        })
            .then((res) => res.data);
    };
    return {
        fetchSelectedCollections,
    };
};

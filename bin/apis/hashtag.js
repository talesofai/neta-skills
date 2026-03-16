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
    return {
        createHashtag,
        fetchHashtag,
        fetchCharactersByHashtag,
    };
};

export const createGptApis = (client) => {
    const messages = async (uuid) => {
        return client
            .get(`/v3/gpt/message/${uuid}`)
            .then((res) => res.data);
    };
    return {
        messages,
    };
};

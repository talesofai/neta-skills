export const createVerseApis = (client) => {
    const patchHtml = async (params) => {
        return client
            .post("/v1/verse/modifyhtml", params, {
            timeout: 20 * 1000,
        })
            .then((res) => res.data);
    };
    const versePreset = async (uuid) => client.get(`/v1/verse/preset/${uuid}`).then((res) => res.data);
    const drawRedpacket = async (params) => client
        .post("/v1/redpacket/draw", params)
        .then((res) => res.data);
    return {
        patchHtml,
        versePreset,
        drawRedpacket,
    };
};

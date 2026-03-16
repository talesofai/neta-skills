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
    return {
        searchTCPs,
        tcpProfile,
    };
};

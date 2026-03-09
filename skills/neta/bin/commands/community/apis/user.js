export const createUserApis = (client) => {
    return {
        me: async () => {
            const res = await client.get("/v1/user/");
            return res.data ?? null;
        },
    };
};

export const createTaskApis = (client) => {
    const rawTask = async (uuid, config) => {
        return client
            .get("/v3/task", {
            params: {
                taskId: uuid,
            },
            ...config,
        })
            .then((res) => res.data);
    };
    const poolSize = async () => {
        return client
            .get("/v3/task-pool")
            .then((res) => res.data);
    };
    return {
        rawTask,
        poolSize,
    };
};

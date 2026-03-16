export const polling = async (fn, condition, interval = 2000, timeout = 10 * 60 * 1000) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const result = await fn();
        if (await condition(result)) {
            return {
                result,
                isTimeout: false,
            };
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return {
        result: null,
        isTimeout: true,
    };
};

import { safeParseJson } from "../utils/json.js";
export function createConfigApis(client) {
    const getConfig = async (namespace, key) => {
        const res = await client
            .get(`/v1/configs/config`, {
            params: {
                namespace,
                key,
            },
        })
            .then((res) => res.data);
        if (!res)
            return null;
        switch (res.type) {
            case "string": {
                const value = String(res.value);
                if (value === "null") {
                    return null;
                }
                else {
                    return value;
                }
            }
            case "int": {
                const value = Number(res.value);
                if (Number.isNaN(value)) {
                    return null;
                }
                else {
                    return value;
                }
            }
            case "json": {
                const value = safeParseJson(res.value);
                if (value === null) {
                    return null;
                }
                else {
                    return value;
                }
            }
            default:
                return null;
        }
    };
    return {
        getConfig,
    };
}

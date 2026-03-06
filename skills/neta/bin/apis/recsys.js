export const createRecsysApis = (client) => {
    const suggestKeywords = async (params) => {
        const response = await client.get("/v1/recsys/autocomplete", { params });
        return response.data;
    };
    const suggestTags = async (params) => {
        const response = await client.get("/v1/recsys/tags", { params });
        return response.data;
    };
    const suggestCategories = async (params) => {
        const response = await client.get("/v1/recsys/categories", { params });
        return response.data;
    };
    const suggestContent = async (params) => {
        const response = await client.post("/v1/recsys/content", params);
        return response.data;
    };
    const validateTaxPath = async (params) => {
        const response = await client.post("/v1/recsys/validate-tax-path", params);
        return response.data;
    };
    return {
        suggestKeywords,
        suggestTags,
        suggestCategories,
        suggestContent,
        validateTaxPath,
    };
};

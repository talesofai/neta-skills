import type { AxiosInstance } from "axios";
import type {
  SuggestCategoriesV1Parameters,
  SuggestCategoriesV1Result,
  SuggestContentV1Parameters,
  SuggestContentV1Result,
  SuggestKeywordsV1Parameters,
  SuggestKeywordsV1Result,
  SuggestTagsV1Parameters,
  SuggestTagsV1Result,
  ValidateTaxPathV1Parameters,
  ValidateTaxPathV1Result,
} from "../commands/schema.ts";

export const createRecsysApis = (client: AxiosInstance) => {
  const suggestKeywords = async (
    params: SuggestKeywordsV1Parameters,
  ): Promise<SuggestKeywordsV1Result> => {
    const response = await client.get("/v1/recsys/autocomplete", { params });
    return response.data;
  };

  const suggestTags = async (
    params: SuggestTagsV1Parameters,
  ): Promise<SuggestTagsV1Result> => {
    const response = await client.get("/v1/recsys/tags", { params });
    return response.data;
  };

  const suggestCategories = async (
    params: SuggestCategoriesV1Parameters,
  ): Promise<SuggestCategoriesV1Result> => {
    const response = await client.get("/v1/recsys/categories", { params });
    return response.data;
  };

  const suggestContent = async (
    params: SuggestContentV1Parameters,
  ): Promise<SuggestContentV1Result> => {
    const response = await client.post("/v1/recsys/content", params);
    return response.data;
  };

  const validateTaxPath = async (
    params: ValidateTaxPathV1Parameters,
  ): Promise<ValidateTaxPathV1Result> => {
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

import type { AxiosInstance } from "axios";

import type { FeedInteractionList } from "./collection.ts";

type SuggestKeywordsV1Parameters = {
  prefix: string;
  size?: number;
};

type KeywordSuggestionItem = {
  text: string;
  score?: number;
  highlight?: string;
};

type SuggestKeywordsV1Result = {
  suggestions: KeywordSuggestionItem[];
};

type SuggestTagsV1Parameters = {
  keyword: string;
  size?: number;
};

type TagSuggestionItem = {
  name: string;
  id?: string;
  score?: number;
  highlight?: string;
};

type SuggestTagsV1Result = {
  suggestions: TagSuggestionItem[];
};

type SuggestCategoriesV1Parameters = {
  level?: number;
  parent_path?: string;
};

type CategoryItem = {
  path: string;
  name: string;
  level: number;
  count?: number;
};

type SuggestCategoriesV1Result = {
  suggestions: CategoryItem[];
};

type SuggestBusinessParams = {
  intent: "recommend" | "search" | "exact";
  search_keywords: string[];
  tax_paths: string[];
  tax_primaries: string[];
  tax_secondaries: string[];
  tax_tertiaries: string[];
  exclude_keywords: string[];
  exclude_tax_paths: string[];
};

type SuggestContentV1Parameters = {
  page_index?: number;
  page_size?: number;
  scene?: string;
  biz_trace_id?: string;
  business_data?: SuggestBusinessParams;
};

type ValidateTaxPathV1Parameters = {
  tax_path: string;
};

type ValidateTaxPathV1Result = {
  valid: boolean;
  message?: string;
  normalized_path?: string;
};

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
  ): Promise<FeedInteractionList> => {
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

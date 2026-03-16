import type { AxiosInstance } from "axios";
import type { GenericPagination, OriginalCharacterProfile } from "./types.ts";

type TCPResponse = {
  tcp_uuid: string;
  name: string;
  type: string;
};

export type TCPAccessibility = "PUBLIC" | "PRIVATE";

export type CreateCharacterParams = {
  name: string;
  gender?: string;
  age?: string;
  interests?: string;
  persona?: string;
  description?: string;
  occupation?: string;
  avatar_artifact_uuid: string;
  prompt: string;
  trigger: string;
  ref_image_uuid?: string;
  accessibility?: TCPAccessibility;
};

export type CreateElementumParams = {
  name: string;
  artifact_uuid: string;
  prompt: string;
  description?: string;
  ref_image_uuid?: string;
  accessibility?: TCPAccessibility;
};

export const createTcpApis = (client: AxiosInstance) => {
  const searchTCPs = async (query: {
    keywords: string;
    page_index: number;
    page_size: number;
    parent_type: ("oc" | "elementum")[] | "oc" | "elementum";
    sort_scheme?: "exact" | "best";
    hashtag_name?: string;
  }) => {
    return client
      .get<
        GenericPagination<{
          type: "official" | "oc" | "elementum";
          uuid: string;
          name: string;
          config: {
            avatar_img?: string;
            header_img?: string;
          };
        }>
      >("/v2/travel/parent-search", { params: query })
      .then((res) => res.data);
  };

  const tcpProfile = async (uuid: string) => {
    return client
      .get<{
        type: "official" | "oc" | "elementum";
        uuid: string;
        name: string;
        config: {
          avatar_img?: string;
          header_img?: string;
        };
        oc_bio: OriginalCharacterProfile;
      } | null>(`/v2/travel/parent/${uuid}/profile`)
      .then((res) => res.data);
  };

  const createCharacter = async (params: CreateCharacterParams) => {
    return client
      .post<TCPResponse>("/v3/oc/character", params)
      .then((res) => res.data);
  };

  const updateCharacter = async (
    tcp_uuid: string,
    params: Partial<CreateCharacterParams>,
  ) => {
    return client
      .patch<TCPResponse>(`/v3/oc/character/${tcp_uuid}`, params)
      .then((res) => res.data);
  };

  const createElementum = async (params: CreateElementumParams) => {
    return client
      .post<TCPResponse>("/v3/oc/elementum", params)
      .then((res) => res.data);
  };

  const updateElementum = async (
    tcp_uuid: string,
    params: Partial<CreateElementumParams>,
  ) => {
    return client
      .patch<TCPResponse>(`/v3/oc/elementum/${tcp_uuid}`, params)
      .then((res) => res.data);
  };

  return {
    searchTCPs,
    tcpProfile,
    createCharacter,
    updateCharacter,
    createElementum,
    updateElementum,
  };
};

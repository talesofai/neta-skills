import type { AxiosInstance } from "axios";
import type { GenericPagination, OriginalCharacterProfile } from "./types.ts";

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

  return {
    searchTCPs,
    tcpProfile,
  };
};

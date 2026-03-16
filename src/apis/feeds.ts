import type { AxiosInstance } from "axios";
import type { FeedInteractionList, FeedMainList } from "./collection.ts";

export type HomeCollectionTag = {
  name: string;
  type: string;
  scheme: string;
  participants_count: number | null;
  header_pic_url?: string;
};

export const createFeedsApis = (client: AxiosInstance) => {
  const homeList = (params: {
    page_size?: number;
    page_index?: number;
    theme?: string;
    biz_trace_id?: string;
  }) => {
    return client.get<FeedMainList>("/v1/home/feed/mainlist", {
      params,
    });
  };

  const interactiveItem = async (params: { collection_uuid: string }) => {
    return client
      .get<FeedInteractionList>("/v1/home/feed/interactive", {
        params: {
          collection_uuid: params.collection_uuid,
          page_index: 0,
          page_size: 1,
        },
      })
      .then((res) => res.data.module_list[0]);
  };

  const interactiveList = async (params: {
    page_size?: number;
    page_index?: number;
    biz_trace_id?: string;
    scene?: string;
    collection_uuid?: string;
    target_collection_uuid?: string;
    target_user_uuid?: string;
  }) => {
    return client
      .get<FeedInteractionList>("/v1/recsys/feed/interactive", {
        params,
      })
      .then((res) => res.data);
  };

  const tags = (uuid: string) =>
    client
      .get<HomeCollectionTag[]>(`/v1/home/collection/${uuid}/tags`)
      .then((res) => res.data);

  return {
    homeList,
    interactiveList,
    interactiveItem,
    tags,
  };
};

import axios, { AxiosInstance } from "axios";
import type {
  TaskResult,
  MakeImageV1Parameters,
  MakeVideoV1Parameters,
  MakeSongV1Parameters,
  RemoveBackgroundV1Parameters,
  MergeVideoV1Parameters,
  SearchCharacterOrElementumV1Parameters,
  SearchCharacterOrElementumV1Result,
  RequestCharacterOrElementumV1Parameters,
  RequestCharacterOrElementumV1Result,
  FetchHashtagV1Result,
  FetchCharactersByHashtagV1Parameters,
  FetchCharactersByHashtagV1Result,
  FetchSelectedCollectionsByActivityV1Result,
  FetchSelectedCollectionsByHashtagV1Parameters,
} from "../types.ts";

const BASE_URL = process.env.NETA_API_URL || "https://api.talesofai.com";

const getToken = (): string => {
  const TOKEN = process.env.NETA_TOKEN;
  if (!TOKEN) {
    throw new Error(
      "NETA_TOKEN environment variable is required. " +
      "Please set it in your environment or create a .env file. " +
      "Example: NETA_TOKEN=your_token_here"
    );
  }
  return TOKEN;
};

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status) {
        const message =
          error.response.data?.message ||
          error.response.data?.msg ||
          error.response.data?.detail ||
          error.message;
        throw new Error(`API Error (${error.response.status}): ${message}`);
      }
      throw error;
    },
  );

  return client;
};

const polling = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean | Promise<boolean>,
  interval: number = 2000,
  timeout: number = 10 * 60 * 1000,
): Promise<{ result: T; isTimeout: false } | { result: null; isTimeout: true }> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const result = await fn();
    if (await condition(result)) {
      return { result, isTimeout: false };
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return { result: null, isTimeout: true };
};

let _client: AxiosInstance | null = null;
const getClient = (): AxiosInstance => {
  if (!_client) {
    _client = createClient();
  }
  return _client;
};

export const apiClient = {
  get client(): AxiosInstance {
    return getClient();
  },

  // Task polling
  async pollTask(taskUuid: string, timeout: number = 10 * 60 * 1000): Promise<TaskResult> {
    const res = await polling(
      () => this.task(taskUuid),
      (result) => {
        console.log(`Task ${taskUuid} status: ${result.task_status}`);
        return result.task_status !== "PENDING" && result.task_status !== "MODERATION";
      },
      2000,
      timeout,
    );

    if (res.isTimeout) {
      return {
        task_uuid: taskUuid,
        task_status: "TIMEOUT",
        artifacts: [],
      };
    }

    return res.result;
  },

  async task(taskUuid: string): Promise<TaskResult> {
    const res = await getClient().get<TaskResult>(`/v1/artifact/task/${taskUuid}`);
    return res.data;
  },

  // Make Image
  async makeImage(params: MakeImageV1Parameters): Promise<TaskResult> {
    const aspectMap: Record<string, [number, number]> = {
      "1:1": [1024, 1024],
      "3:4": [896, 1152],
      "4:3": [1152, 896],
      "9:16": [768, 1344],
      "16:9": [1344, 768],
    };
    const size = aspectMap[params.aspect] || [896, 1152];

    const payload = {
      storyId: "DO_NOT_USE",
      jobType: "universal",
      rawPrompt: [],
      width: size[0],
      height: size[1],
      meta: {
        entrance: "PICTURE,VERSE",
      },
      advanced_translator: true,
      context_model_series: "8_image_edit",
    };

    const res = await getClient().post<string>("/v3/make_image", payload);
    const taskUuid = res.data;
    return this.pollTask(taskUuid, 10 * 60 * 1000);
  },

  // Make Video
  async makeVideo(params: MakeVideoV1Parameters): Promise<TaskResult> {
    const modelMap: Record<string, string> = {
      model_s: "volc_seedance_fast_i2v_upscale",
      model_w: "wan26",
    };

    const payload = {
      rawPrompt: [],
      image_url: params.image_source,
      work_flow_text: params.prompt,
      work_flow_model: modelMap[params.model],
      meta: {
        entrance: "VIDEO,VERSE",
      },
    };

    const res = await getClient().post<string>("/v3/make_video", payload);
    const taskUuid = res.data;
    return this.pollTask(taskUuid, 20 * 60 * 1000);
  },

  // Make Song
  async makeSong(params: MakeSongV1Parameters): Promise<TaskResult> {
    const payload = {
      prompt: params.prompt,
      lyrics: params.lyrics,
      meta: {
        entrance: "SONG,VERSE",
      },
    };

    const res = await getClient().post<string>("/v3/make_song", payload);
    const taskUuid = res.data;
    return this.pollTask(taskUuid, 5 * 60 * 1000);
  },

  // Remove Background
  async removeBackground(params: RemoveBackgroundV1Parameters): Promise<TaskResult> {
    const payload = {
      source_artifact_uuid: params.input_image,
      preset_key: "0_null/抠图 SEG",
      meta: {
        entrance: "PICTURE,PURE,VERSE",
      },
    };

    const res = await getClient().post<string>("/v3/make_face_detailer", payload);
    const taskUuid = res.data;
    return this.pollTask(taskUuid, 5 * 60 * 1000);
  },

  // Merge Video
  async mergeVideo(params: MergeVideoV1Parameters): Promise<TaskResult> {
    const payload = {
      merge_prompt: params.input,
      artifacts_data: {},
      inherit_params: {},
    };

    const res = await getClient().post<{ task_uuid: string }>(
      "/v3/merge_media/v3/submit_task",
      payload,
    );
    const taskUuid = res.data.task_uuid;
    return this.pollTask(taskUuid, 5 * 60 * 1000);
  },

  // Search TCP (Character/Elementum)
  async searchTCPs(params: SearchCharacterOrElementumV1Parameters): Promise<SearchCharacterOrElementumV1Result> {
    const parentTypeMap: Record<string, string[] | string> = {
      both: ["oc", "elementum"],
      character: "oc",
      elementum: "elementum",
    };

    const res = await getClient().get("/v2/travel/parent-search", {
      params: {
        keywords: params.keywords,
        page_index: params.page_index,
        page_size: params.page_size,
        parent_type: parentTypeMap[params.parent_type],
        sort_scheme: params.sort_scheme,
      },
    });

    const data = res.data;
    return {
      total: data.total,
      page_index: data.page_index,
      page_size: data.page_size,
      list: data.list.map((item: {
        type: string;
        uuid: string;
        name: string;
        config?: { avatar_img?: string; header_img?: string };
      }) => ({
        uuid: item.uuid,
        type: item.type === "oc" || item.type === "official" ? "character" : "elementum",
        name: item.name,
        avatar_img: item.config?.avatar_img,
        header_img: item.config?.header_img,
      })),
    };
  },

  // TCP Profile
  async tcpProfile(uuid: string) {
    const res = await getClient().get(`/v2/travel/parent/${uuid}/profile`);
    return res.data;
  },

  // Request Character or Elementum
  async requestCharacterOrElementum(
    params: RequestCharacterOrElementumV1Parameters,
  ): Promise<RequestCharacterOrElementumV1Result> {
    let tcp;

    if (params.uuid) {
      tcp = await this.tcpProfile(params.uuid);
    } else if (params.name) {
      const searchRes = await this.searchTCPs({
        keywords: params.name,
        page_index: 0,
        page_size: 1,
        sort_scheme: "exact",
        parent_type: params.parent_type,
      });

      if (searchRes.list.length === 0) {
        throw new Error(`未找到角色或元素：${params.name}`);
      }

      tcp = await this.tcpProfile(searchRes.list[0].uuid);
    } else {
      throw new Error("必须提供 name 或 uuid 参数之一");
    }

    if (!tcp) {
      throw new Error(`未找到角色或元素`);
    }

    if (tcp.type === "oc" || tcp.type === "official") {
      if (params.parent_type === "elementum") {
        throw new Error(
          `找到的类型为"character"（角色），但指定了 parent_type="elementum"（风格元素）`,
        );
      }
      return {
        detail: {
          type: "character",
          uuid: tcp.uuid,
          name: tcp.name,
          age: tcp.oc_bio?.age,
          interests: tcp.oc_bio?.interests,
          persona: tcp.oc_bio?.persona,
          description: tcp.oc_bio?.description,
          occupation: tcp.oc_bio?.occupation,
          avatar_img: tcp.config?.avatar_img,
          header_img: tcp.config?.header_img,
        },
      };
    }

    if (tcp.type === "elementum") {
      if (params.parent_type === "character") {
        throw new Error(
          `找到的类型为"elementum"（风格元素），但指定了 parent_type="character"（角色）`,
        );
      }
      return {
        detail: {
          type: "elementum",
          uuid: tcp.uuid,
          name: tcp.name,
          description: tcp.oc_bio?.description,
          avatar_img: tcp.config?.avatar_img,
        },
      };
    }

    throw new Error(`未知 TCP 类型：${tcp.type}`);
  },

  // Hashtag Info
  async fetchHashtag(hashtag: string): Promise<FetchHashtagV1Result> {
    const res = await getClient().get(`/v1/hashtag/hashtag_info/${encodeURIComponent(hashtag)}`);
    const data = res.data;
    return {
      hashtag: {
        name: data.name,
        lore: data.lore || [],
        activity_detail: data.activity_detail,
        hashtag_heat: data.hashtag_heat,
        subscribe_count: data.subscribe_count,
      },
    };
  },

  // Hashtag Characters
  async fetchCharactersByHashtag(
    params: FetchCharactersByHashtagV1Parameters,
  ): Promise<FetchCharactersByHashtagV1Result> {
    const res = await getClient().get(
      `/v1/hashtag/${encodeURIComponent(params.hashtag)}/tcp-list`,
      {
        params: {
          page_index: params.page_index,
          page_size: params.page_size,
          sort_by: params.sort_by,
          parent_type: params.parent_type,
        },
      },
    );

    const data = res.data;
    return {
      total: data.total,
      page_index: data.page_index,
      page_size: data.page_size,
      list: data.list.map((char: {
        uuid: string;
        name: string;
        short_name: string;
        config?: { avatar_img?: string };
        ctime: string;
        creator?: { uuid: string; nick_name: string };
      }) => ({
        uuid: char.uuid,
        name: char.name,
        short_name: char.short_name,
        avatar_img: char.config?.avatar_img || null,
        ctime: char.ctime,
        creator_uuid: char.creator?.uuid,
        creator_name: char.creator?.nick_name,
      })),
      has_next: data.has_next,
    };
  },

  // Hashtag Collections
  async fetchSelectedCollections(
    params: FetchSelectedCollectionsByHashtagV1Parameters,
  ): Promise<FetchSelectedCollectionsByActivityV1Result> {
    // First get the hashtag info to find the activity_uuid
    const hashtagInfo = await this.fetchHashtag(params.hashtag);
    const activityUuid = hashtagInfo.hashtag?.activity_detail?.uuid;

    if (!activityUuid) {
      throw new Error(`Hashtag "${params.hashtag}" 未关联任何活动空间`);
    }

    const res = await getClient().get(
      `/v1/activities/${encodeURIComponent(activityUuid)}/selected-stories/highlights`,
      {
        params: {
          page_index: params.page_index,
          page_size: params.page_size,
          sort_by: params.sort_by,
        },
      },
    );

    const data = res.data;
    return {
      total: data.total,
      page_index: data.page_index,
      page_size: data.page_size,
      list: data.list.map((collection: {
        storyId: string;
        name: string;
        coverUrl?: string;
        user_nick_name?: string;
        likeCount?: number;
        sameStyleCount?: number;
        ctime?: string;
      }) => ({
        uuid: collection.storyId,
        name: collection.name,
        coverUrl: collection.coverUrl,
        creator_name: collection.user_nick_name,
        likeCount: collection.likeCount,
        sameStyleCount: collection.sameStyleCount,
        ctime: collection.ctime,
      })),
    };
  },
};

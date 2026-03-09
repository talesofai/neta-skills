import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { TaskResult } from "./task.ts";
import type {
  ArtifactDetail,
  Assign,
  EditImageRequest,
  InheritPayloadV3Params,
  MakeImageRequest,
  MakeVideoRequest,
  PostProcessPreset,
  TaskMeta,
} from "./types.ts";

export interface ArtifactItem {
  uuid: string;
  status: string;
  url: string;
  is_starred: boolean;
  user_uuid: string;
  ctime: string;
  mtime: string;
  platform: string;
  modality: "PICTURE" | "VIDEO" | "AUDIO";
  audio_name: string | null;
}

export interface ArtifactListResponse {
  msg: string;
  err_msg: string | null;
  total: number;
  list: ArtifactItem[];
}

export const createArtifactApis = (client: AxiosInstance) => {
  const makeImage = async (
    payload: MakeImageRequest,
    config?: AxiosRequestConfig<MakeImageRequest>,
  ) => {
    return client
      .post<string>("/v3/make_image", payload, config)
      .then((res) => res.data);
  };

  const makeVideo = async (
    payload: MakeVideoRequest,
    config?: AxiosRequestConfig<MakeVideoRequest>,
  ) => {
    return client
      .post<string>("/v3/make_video", payload, config)
      .then((res) => res.data);
  };

  const editImage = async (
    payload: EditImageRequest,
    config?: AxiosRequestConfig<EditImageRequest>,
  ) => {
    return client
      .post<string>("/v1/image_edit_v1/task", payload, config)
      .then((res) => res.data);
  };

  const task = async (task_uuid: string, config?: AxiosRequestConfig) => {
    return client
      .get<TaskResult>(`/v1/artifact/task/${task_uuid}`, config)
      .then((res) => res.data);
  };

  const mergeMedia = async (
    payload: {
      merge_prompt: string;
      artifacts_data: Record<string, Assign>;
      inherit_params: InheritPayloadV3Params;
    },
    config?: AxiosRequestConfig,
  ) => {
    return client
      .post<{ task_uuid: string; invalid_asset_data: unknown }>(
        "/v3/merge_media/v3/submit_task",
        payload,
        config,
      )
      .then((res) => res.data);
  };

  const makeSong = async (
    prompt: string,
    lyrics: string,
    meta: TaskMeta,
    config?: AxiosRequestConfig,
  ) => {
    return client
      .post<string>(
        "/v3/make_song",
        {
          prompt,
          lyrics,
          meta,
        },
        config,
      )
      .then((res) => res.data);
  };

  const postProcess = async (
    uuid: string,
    preset: PostProcessPreset,
    meta: TaskMeta,
    config?: AxiosRequestConfig,
  ) => {
    return client
      .post<string>(
        "/v3/make_face_detailer",
        {
          source_artifact_uuid: uuid,
          preset_key: preset,
          meta,
        },
        config,
      )
      .then((res) => res.data);
  };

  const artifactDetail = async (uuids: string[]) => {
    return client
      .get<ArtifactDetail[]>("/v1/artifact/artifact-detail", {
        params: {
          uuids: uuids.join(","),
        },
      })
      .then((res) => res.data);
  };

  /**
   * 获取作品列表（图片/视频/音频/星标）
   */
  const getArtifactList = async (params: {
    page_index?: number;
    page_size?: number;
    modality?: "PICTURE" | "VIDEO" | "AUDIO";
    is_starred?: boolean;
  }): Promise<ArtifactListResponse> => {
    const { page_index = 0, page_size = 20, modality, is_starred } = params;
    return client
      .get<ArtifactListResponse>("/v1/artifact/list", {
        params: {
          page_index,
          page_size,
          ...(modality ? { modality } : {}),
          ...(is_starred !== undefined ? { is_starred } : {}),
        },
      })
      .then((res) => res.data);
  };

  return {
    makeImage,
    makeVideo,
    editImage,
    makeSong,
    mergeMedia,
    postProcess,
    task,
    artifactDetail,
    getArtifactList,
  };
};

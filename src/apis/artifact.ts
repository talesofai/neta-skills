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
  status: string | null;
  url: string | null;
  modality: string | null;
  is_starred: boolean | null;
  ctime: string | null;
  mtime: string | null;
  audio_name: string | null;
}

export interface ArtifactListResponse {
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

  const createPicture = (data: { url: string }) => {
    return client
      .post<{
        uuid: string;
      }>(`/v1/artifact/picture`, {
        url: data.url,
      })
      .then((res) => res.data);
  };

  const createVideo = (data: { url: string }) => {
    return client
      .post<{
        uuid: string;
      }>(`/v1/artifact/video`, {
        url: data.url,
      })
      .then((res) => res.data);
  };

  const listArtifacts = async (params?: {
    page_index?: number;
    page_size?: number;
    modality?: string;
    is_starred?: boolean;
  }): Promise<ArtifactListResponse> => {
    const res = await client.get<ArtifactListResponse>("/v1/artifact/list", {
      params: {
        page_index: params?.page_index ?? 0,
        page_size: params?.page_size ?? 20,
        modality: params?.modality,
        is_starred: params?.is_starred,
      },
    });
    return res.data;
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
    createPicture,
    createVideo,
    listArtifacts,
  };
};

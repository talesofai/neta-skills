import type { AxiosInstance, AxiosRequestConfig } from "axios";

export type Modality = "PICTURE" | "VIDEO" | "AUDIO";

export type TaskStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILURE"
  | "TIMEOUT"
  | "DELETED"
  | "MODERATION"
  | "ILLEGAL_IMAGE";

export type TaskResult = {
  task_uuid: string;
  task_status: TaskStatus;
  msg: string | null;
  err_msg: string | null;
  artifacts: TaskArtifact[];
};

export type RawTaskResult<T> = {
  status: TaskStatus;
  url: string | null;
  extra_data: T | null;
};

export type TaskArtifact = {
  uuid: string;
  modality: Modality;
  status: TaskStatus;
  url: string | null;
  detail_url: string | null;
  text: string | null;
  image_detail: {
    width: number;
    height: number;
  } | null;
  video_detail: {
    width: number;
    height: number;
  } | null;
  audio_detail: {
    audio_name: string | null;
    lyric_url: string | null;
  } | null;
};

export const createTaskApis = (client: AxiosInstance) => {
  const rawTask = async <T>(
    uuid: string,
    config?: AxiosRequestConfig,
  ): Promise<RawTaskResult<T>> => {
    return client
      .get<RawTaskResult<T>>("/v3/task", {
        params: {
          taskId: uuid,
        },
        ...config,
      })
      .then((res) => res.data);
  };

  const poolSize = async () => {
    return client
      .get<{ verse_pool_size: number }>("/v3/task-pool")
      .then((res) => res.data);
  };

  return {
    rawTask,
    poolSize,
  };
};

import axios from "axios";
import { handleAxiosError } from "../utils/errors.ts";
import { createActivityApis, type SelectedCollection } from "./activity.ts";
import { createArtifactApis } from "./artifact.ts";
import { createAudioApis } from "./audio.ts";
import { createCollectionApis } from "./collection.ts";
import { createConfigApis } from "./config.ts";
import { createFeedsApis } from "./feeds.ts";
import { createGptApis } from "./gpt.ts";
import {
  createHashtagApis,
  type HashtagInfo,
  type LoreEntry,
} from "./hashtag.ts";
import { createPromptApis } from "./prompt.ts";
import { createRecsysApis } from "./recsys.ts";
import { createSpaceApis } from "./space.ts";
import { createTaskApis } from "./task.ts";
import { createTcpApis } from "./tcp.ts";
import type { PromiseResult } from "./types.ts";
import { createUserApis } from "./user.ts";
import { createVerseApis } from "./verse.ts";

export const createApis = (option: {
  headers: Record<string, string | string[] | undefined>;
  baseUrl: string;
}) => {
  const baseUrl = option.baseUrl;
  const client = axios.create({
    adapter: "fetch",
    baseURL: baseUrl,
    headers: {
      ...option.headers,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      handleAxiosError(error);
    },
  );

  const tcp = createTcpApis(client);
  const prompt = createPromptApis(client, tcp);
  const artifact = createArtifactApis(client);
  const gpt = createGptApis(client);
  const audio = createAudioApis(client);
  const hashtag = createHashtagApis(client);
  const activity = createActivityApis(client);
  const verse = createVerseApis(client);
  const task = createTaskApis(client);
  const config = createConfigApis(client);
  const user = createUserApis(client);
  const collection = createCollectionApis(client);
  const feeds = createFeedsApis(client);
  const space = createSpaceApis(client);
  const recsys = createRecsysApis(client);

  return {
    tcp,
    prompt,
    artifact,
    gpt,
    audio,
    hashtag,
    activity,
    verse,
    task,
    config,
    user,
    collection,
    feeds,
    space,
    recsys,
  };
};

export type Apis = PromiseResult<ReturnType<typeof createApis>>;

export type { HashtagInfo };
export type { LoreEntry };
export type { SelectedCollection };

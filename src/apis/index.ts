import axios, { AxiosError } from "axios";
import { isTokenExpired, readToken, refreshToken } from "../utils/auth.ts";
import { NETA_TOKEN } from "../utils/env.ts";
import { catchErrorResponse, handleAxiosError } from "../utils/errors.ts";
import { createActivityApis, type SelectedCollection } from "./activity.ts";
import { createArtifactApis } from "./artifact.ts";
import { createAudioApis } from "./audio.ts";
import { createCollectionApis } from "./collection.ts";
import { createCommerceApis } from "./commerce.ts";
import { createConfigApis } from "./config.ts";
import { createFeedsApis } from "./feeds.ts";
import { createGptApis } from "./gpt.ts";
import {
  createHashtagApis,
  type HashtagInfo,
  type LoreEntry,
} from "./hashtag.ts";
import { createOssApis } from "./oss.ts";
import { createPromptApis } from "./prompt.ts";
import { createRecsysApis } from "./recsys.ts";
import { createSpaceApis } from "./space.ts";
import { createTaskApis } from "./task.ts";
import { createTcpApis } from "./tcp.ts";
import { createTravelCampaignApis } from "./travel_campaign.ts";
import type { PromiseResult } from "./types.ts";
import { createUserApis } from "./user.ts";
import { createVerseApis } from "./verse.ts";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    start_time?: number;
  }
}

export const createApis = (option: {
  headers: Record<string, string | string[] | undefined>;
  baseUrl: string;
  logger: Pick<Console, "error" | "warn" | "info" | "debug">;
}) => {
  const baseUrl = option.baseUrl;
  const logger = option.logger;
  const client = axios.create({
    adapter: "fetch",
    baseURL: baseUrl,
    headers: {
      ...option.headers,
    },
    timeout: 10 * 1000,
  });

  client.interceptors.request.use(async (config) => {
    const now = Date.now();
    config.start_time = now;
    logger.debug("[api] request: %s %s", config.method, config.url);

    let token = await readToken();
    if (token && isTokenExpired(token)) {
      token = await refreshToken().catch((e) => {
        logger.warn("[api] refresh token error: %o", e);
        return null;
      });
    }

    if (!token) {
      config.headers.set("x-token", NETA_TOKEN);
    } else {
      config.headers.set("Authorization", `Bearer ${token.access_token}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => {
      const now = Date.now();
      const startTime = response.config.start_time ?? now;
      const duration = now - startTime;
      logger.debug(
        "[api] response: %s %s %s %dms",
        response.config.method,
        response.status,
        response.config.url,
        duration,
      );
      return response;
    },
    (error) => {
      if (error instanceof AxiosError) {
        logger.debug(
          "[api] response error: %s %s %s %s",
          error.request?.method,
          error.request?.url,
          error.response?.status,
          catchErrorResponse(error.response?.data),
        );
      }
      handleAxiosError(error);
    },
  );

  const tcp = createTcpApis(client);
  const artifact = createArtifactApis(client);
  const prompt = createPromptApis(client, tcp, artifact);
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
  const travelCampaign = createTravelCampaignApis(client);
  const commerce = createCommerceApis(client);
  const oss = createOssApis(client);

  return {
    baseUrl,
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
    travelCampaign,
    commerce,
    oss,
  };
};

export type Apis = PromiseResult<ReturnType<typeof createApis>>;

export type { HashtagInfo };
export type { LoreEntry };
export type { SelectedCollection };

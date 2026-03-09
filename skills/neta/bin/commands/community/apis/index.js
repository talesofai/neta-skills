import axios from "axios";
import { handleAxiosError } from "../utils/errors.ts";
import { createActivityApis } from "./activity.ts";
import { createArtifactApis } from "./artifact.ts";
import { createAudioApis } from "./audio.ts";
import { createCollectionApis } from "./collection.ts";
import { createCommentApis } from "./comment.ts";
import { createConfigApis } from "./config.ts";
import { createFeedsApis } from "./feeds.ts";
import { createGptApis } from "./gpt.ts";
import { createHashtagApis, } from "./hashtag.ts";
import { createPromptApis } from "./prompt.ts";
import { createSpaceApis } from "./space.ts";
import { createTaskApis } from "./task.ts";
import { createTcpApis } from "./tcp.ts";
import { createUserApis } from "./user.ts";
import { createVerseApis } from "./verse.ts";
export const createApis = (option) => {
    const baseUrl = option.baseUrl;
    const client = axios.create({
        adapter: "fetch",
        baseURL: baseUrl,
        headers: {
            ...option.headers,
        },
    });
    client.interceptors.response.use((response) => response, (error) => {
        handleAxiosError(error);
    });
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
    const comment = createCommentApis(client);
    const feeds = createFeedsApis(client);
    const space = createSpaceApis(client);
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
        comment,
        feeds,
        space,
    };
};

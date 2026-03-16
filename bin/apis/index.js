import axios from "axios";
import { handleAxiosError } from "../utils/errors.js";
import { createActivityApis } from "./activity.js";
import { createArtifactApis } from "./artifact.js";
import { createAudioApis } from "./audio.js";
import { createCollectionApis } from "./collection.js";
import { createConfigApis } from "./config.js";
import { createFeedsApis } from "./feeds.js";
import { createGptApis } from "./gpt.js";
import { createHashtagApis, } from "./hashtag.js";
import { createPromptApis } from "./prompt.js";
import { createRecsysApis } from "./recsys.js";
import { createSpaceApis } from "./space.js";
import { createTaskApis } from "./task.js";
import { createTcpApis } from "./tcp.js";
import { createUserApis } from "./user.js";
import { createVerseApis } from "./verse.js";
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

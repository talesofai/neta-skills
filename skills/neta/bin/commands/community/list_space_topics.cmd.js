import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        space_uuid: z.string(),
    }),
}), import.meta);
export const listSpaceTopics = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        space_uuid: z.string(),
    }),
}, async ({ space_uuid }, { apis }) => {
    const spaceConfigs = await apis.space.spaceConfigs();
    const topics = await apis.space
        .topics(space_uuid)
        .then(({ primary_topic, topics }) => {
        return {
            primary_topic,
            topics: topics.map((topic) => {
                const { curated_works, ...config } = spaceConfigs[topic.hashtag_name] ?? {};
                return {
                    ...topic,
                    ...config,
                    official_collections: curated_works,
                };
            }),
        };
    });
    return {
        topics,
    };
});

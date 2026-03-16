import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        space_uuid: Type.String(),
    }),
}), import.meta);
export const listSpaceTopics = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
        space_uuid: Type.String(),
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

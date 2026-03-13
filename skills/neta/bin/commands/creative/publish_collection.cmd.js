import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        name: Type.String(),
        description: Type.String(),
        status: Type.String(),
        artifacts: Type.String(),
        hashtags: Type.String(),
    }),
}), import.meta);
export const publishCollection = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
        name: Type.String({ description: meta.parameters.name }),
        description: Type.String({ description: meta.parameters.description }),
        status: Type.Union([Type.Literal("PRIVATE"), Type.Literal("PUBLISHED")], {
            description: meta.parameters.status,
        }),
        artifacts: Type.String({ description: meta.parameters.artifacts }),
        hashtags: Type.Optional(Type.String({ description: meta.parameters.hashtags })),
        remix_instruct: Type.Optional(Type.String()),
    }),
}, async ({ name, description, status, hashtags, artifacts, remix_instruct }, { apis }) => {
    const tags = await Promise.all(hashtags?.split(",")?.map((tag) => apis.hashtag.createHashtag(tag)) ?? []);
    const tagDetails = await Promise.all(tags.map((tag) => apis.hashtag.fetchHashtag(tag.name)));
    const activity = tagDetails.find((tag) => tag?.activity_detail?.uuid) ?? null;
    const artifactDetails = await apis.artifact.artifactDetail(artifacts.split(","));
    if (artifactDetails.length < 1 || artifactDetails.length > 12) {
        throw new Error("artifacts must be between 1 and 12");
    }
    artifactDetails.forEach((artifact, index) => {
        if (!artifact) {
            throw new Error(`artifact ${artifacts[index]} not found`);
        }
        if (artifact.status !== "SUCCESS") {
            throw new Error(`artifact ${artifacts[index]} status is not success`);
        }
    });
    const uuid = await apis.collection.createCollection();
    const data = {
        pages: [
            {
                images: artifactDetails,
            },
        ],
    };
    const coverArtifact = artifactDetails.find((artifact) => artifact.url) ?? null;
    const aspect = (() => {
        if (!coverArtifact)
            return "3:4";
        if (coverArtifact.modality === "PICTURE" && coverArtifact.image_detail) {
            return `${coverArtifact.image_detail.width}:${coverArtifact.image_detail.height}`;
        }
        if (coverArtifact.modality === "VIDEO" && coverArtifact.video_detail) {
            return `${coverArtifact.video_detail.width}:${coverArtifact.video_detail.height}`;
        }
        return "3:4";
    })();
    const characters = new Map();
    artifactDetails.forEach((artifact) => {
        artifact.input?.rawPrompt?.forEach((p) => {
            if (p?.type === "official_character_vtoken_adaptor" ||
                p?.type === "oc_vtoken_adaptor") {
                characters.set(p.value, {
                    type: "character",
                    name: p.name,
                    weight: p.weight,
                    value: p.value,
                });
            }
        });
    });
    const collection = await apis.collection.saveCollection({
        uuid,
        name,
        description,
        version: "3.0.0",
        status,
        hashtags: tagDetails.map((tag) => tag.name),
        displayData: data,
        editorData: data,
        picCount: artifactDetails.length,
        coverUrl: coverArtifact?.url ?? null,
        shareUrl: coverArtifact?.url ?? null,
        aspect,
        activity: activity?.activity_detail?.uuid ?? null,
        extra_data: {
            remix_instruct,
        },
        refCharacterTokens: Array.from(characters.values()),
    });
    await apis.collection.publishCollection(uuid);
    return collection;
});

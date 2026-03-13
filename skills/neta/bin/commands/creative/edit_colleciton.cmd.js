import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        uuid: Type.String(),
        name: Type.String(),
        description: Type.String(),
        status: Type.String(),
        artifacts: Type.String(),
        hashtags: Type.String(),
    }),
}), import.meta);
export const editCollection = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
        uuid: Type.String({ description: meta.parameters.uuid }),
        name: Type.Optional(Type.String({ description: meta.parameters.name })),
        description: Type.Optional(Type.String({ description: meta.parameters.description })),
        status: Type.Optional(Type.Union([Type.Literal("PRIVATE"), Type.Literal("PUBLISHED")], {
            description: meta.parameters.status,
        })),
        artifacts: Type.Optional(Type.String({ description: meta.parameters.artifacts })),
        hashtags: Type.Optional(Type.String({ description: meta.parameters.hashtags })),
        remix_instruct: Type.Optional(Type.String()),
    }),
}, async ({ uuid, name, description, status, hashtags, artifacts, remix_instruct }, { apis }) => {
    const [collection] = await apis.collection.collectionDetails([uuid]);
    if (!collection) {
        throw new Error(`collection ${uuid} not found`);
    }
    const payload = {
        uuid,
        name: collection.name,
        description: collection.description ?? "",
        status: collection.status,
        hashtags: collection.hashtags,
        displayData: collection.displayData,
        editorData: collection.editorData,
        picCount: collection.picCount,
        coverUrl: collection.coverUrl,
        shareUrl: collection.shareUrl,
        aspect: collection.aspect,
        activity: collection.activity,
        extra_data: collection.extra_data,
        bgm_uuid: collection.bgm_uuid,
        video_uuid: collection.video_uuid,
        is_interactive: collection.is_interactive,
    };
    if (name) {
        payload.name = name;
    }
    if (description) {
        payload.description = description;
    }
    if (status) {
        payload.status = status;
    }
    if (hashtags) {
        const tags = await Promise.all(hashtags?.split(",")?.map((tag) => apis.hashtag.createHashtag(tag)) ??
            []);
        const tagDetails = await Promise.all(tags.map((tag) => apis.hashtag.fetchHashtag(tag.name)));
        const activity = tagDetails.find((tag) => tag?.activity_detail?.uuid) ?? null;
        payload.hashtags = tagDetails.map((tag) => tag.name);
        payload.activity = activity?.activity_detail?.uuid ?? null;
    }
    if (artifacts) {
        const artifactDetails = await apis.artifact.artifactDetail(artifacts?.split(",") ?? []);
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
        const coverArtifact = artifactDetails.find((artifact) => artifact.url) ?? null;
        const aspect = (() => {
            if (!coverArtifact)
                return "3:4";
            if (coverArtifact.modality === "PICTURE" &&
                coverArtifact.image_detail) {
                return `${coverArtifact.image_detail.width}:${coverArtifact.image_detail.height}`;
            }
            if (coverArtifact.modality === "VIDEO" && coverArtifact.video_detail) {
                return `${coverArtifact.video_detail.width}:${coverArtifact.video_detail.height}`;
            }
            return "3:4";
        })();
        const data = {
            pages: [
                {
                    images: artifactDetails,
                },
            ],
        };
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
        payload.displayData = data;
        payload.editorData = data;
        payload.picCount = artifactDetails.length;
        payload.coverUrl = coverArtifact?.url ?? null;
        payload.shareUrl = coverArtifact?.url ?? null;
        payload.aspect = aspect;
        payload.refCharacterTokens = Array.from(characters.values());
    }
    if (remix_instruct) {
        if (payload.extra_data) {
            payload.extra_data.remix_instruct = remix_instruct;
        }
        else {
            payload.extra_data = {
                remix_instruct,
            };
        }
    }
    const updated = await apis.collection.saveCollection(payload);
    await apis.collection.publishCollection(uuid);
    return updated;
});

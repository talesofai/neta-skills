import { Type } from "@sinclair/typebox";
import { isVerseCTA } from "../../apis/collection.js";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const mete = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
export const readCollectionCmd = createCommand({
    name: mete.name,
    title: mete.title,
    description: mete.description,
    inputSchema: Type.Object({
        uuid: Type.String(),
    }),
}, async ({ uuid }, { apis }) => {
    const res = await apis.feeds.interactiveItem({ collection_uuid: uuid });
    if (!res || res.template_id !== "NORMAL") {
        throw new Error(`Collection "${uuid}" not found`);
    }
    const name = res.json_data.name;
    const description = res.json_data.description ?? "";
    const creator = {
        uuid: res.json_data.creator.uuid,
        name: res.json_data.creator.nick_name,
    };
    const artifacts = res.json_data.displayData?.pages.flatMap((page) => page.images.map((image) => ({
        uuid: image.uuid,
        url: image.url,
        modality: image.modality,
        status: image.status,
        image_detail: image.image_detail,
        video_detail: image.video_detail,
    })));
    const tags = await apis.feeds
        .tags(uuid)
        .then((res) => res.map((tag) => ({
        name: tag.name,
        type: tag.type,
        participants_count: tag.participants_count,
        header_pic_url: tag.header_pic_url,
    })))
        .catch(() => []);
    const remix = await (async () => {
        const cta = res.json_data.cta_info;
        const verse_uuid = isVerseCTA(cta)
            ? (cta.interactive_config?.verse_uuid ?? null)
            : null;
        const verse = verse_uuid
            ? await apis.verse.versePreset(verse_uuid).catch(() => null)
            : null;
        const preset_description = verse?.preset_description ?? null;
        const reference_planning = verse?.reference_planning ?? null;
        if (isVerseCTA(cta)) {
            const { interactive_config, interactive_status: _, type: __, ...rest } = cta;
            if (!interactive_config?.verse_uuid)
                return null;
            const verse = await apis.verse
                .versePreset(interactive_config.verse_uuid)
                .catch(() => null);
            if (!verse)
                return null;
            return {
                ...rest,
                preset_description,
                reference_planning,
            };
        }
        return null;
    })();
    return {
        collection: {
            uuid,
            name,
            description,
            creator,
            artifacts,
            tags,
            remix,
        },
    };
});

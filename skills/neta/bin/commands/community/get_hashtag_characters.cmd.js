import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const fetchCharactersByHashtagV1Parameters = Type.Object({
    hashtag: Type.String(),
    page_index: Type.Integer({ minimum: 0, default: 0 }),
    page_size: Type.Integer({ minimum: 1, maximum: 100, default: 20 }),
    sort_by: Type.Union([Type.Literal("hot"), Type.Literal("newest")], {
        default: "hot",
    }),
    parent_type: Type.Optional(Type.Union([Type.Literal("oc"), Type.Literal("elementum")])),
});
export const getHashtagCharacters = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: fetchCharactersByHashtagV1Parameters,
}, async ({ hashtag, page_index, page_size, sort_by, parent_type }, { apis }) => {
    const result = await apis.hashtag.fetchCharactersByHashtag(hashtag, {
        page_index,
        page_size,
        sort_by,
        parent_type,
    });
    const simplifiedList = result.list.map((char) => ({
        uuid: char.uuid,
        name: char.name,
        short_name: char.short_name,
        avatar_img: char.config?.avatar_img || null,
        ctime: char.ctime,
        creator_uuid: char.creator?.uuid,
        creator_name: char.creator?.nick_name,
    }));
    return {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        list: simplifiedList,
        has_next: result.has_next,
    };
});

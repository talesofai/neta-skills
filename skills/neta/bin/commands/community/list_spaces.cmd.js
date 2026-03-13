import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
export const listSpaces = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
}, async (_, { apis }) => {
    const spaceHashtags = await apis.space.spaceHashtags();
    const spaces = await Promise.all(spaceHashtags.map((hashtag) => apis.space.basic(hashtag))).then((spaces) => spaces.filter((space) => space?.space_uuid));
    return {
        spaces,
    };
});

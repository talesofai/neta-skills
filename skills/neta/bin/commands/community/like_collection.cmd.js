import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const likeCollectionCmd = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        uuid: z.string(),
        is_cancel: z.boolean().optional().default(false),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
}, async ({ uuid, is_cancel }, { apis, log }) => {
    log.debug("like_collection: uuid: %s, is_cancel: %s", uuid, is_cancel ? "true" : "false");
    const action = is_cancel ? "unliked" : "liked";
    const success = await apis.collection.likeCollection(uuid, { is_cancel });
    if (!success) {
        throw new Error(`${action} fail`);
    }
    return {
        success: true,
        message: `${action} success`,
    };
});

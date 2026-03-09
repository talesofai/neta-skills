import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const getHashtagStories = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        hashtag: z.string(),
        page_index: z.number().default(0),
        page_size: z.number().default(20),
        sort_by: z.string().default("newest"), // hot | newest
    }),
    outputSchema: z.object({
        total: z.number(),
        page_index: z.number(),
        page_size: z.number(),
        list: z.array(z.object({
            uuid: z.string(),
            name: z.string(),
            creator_name: z.string(),
            coverUrl: z.string().nullable(),
            likeCount: z.number().nullable(),
            ctime: z.string(),
        })),
    }),
}, async ({ hashtag, page_index = 0, page_size = 20, sort_by = "newest" }, { log, apis }) => {
    log.debug("get_hashtag_stories: hashtag: %s, page_index: %d, page_size: %d, sort_by: %s", hashtag, page_index, page_size, sort_by);
    const result = await apis.hashtag.fetchStoriesByHashtag(hashtag, {
        page_index,
        page_size,
        sort_by,
    });
    const simplifiedList = (result.list || []).map((story) => ({
        uuid: story.uuid,
        name: story.name,
        creator_name: story.user_nick_name,
        coverUrl: story.cover_url,
        likeCount: story.like_count,
        ctime: story.ctime,
    }));
    return {
        total: result.total,
        page_index: result.page_index,
        page_size: result.page_size,
        list: simplifiedList,
    };
});

import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    parameters: z.object({
        page_index: z.string().optional(),
        page_size: z.string().optional(),
        modality: z.string().optional(),
        is_starred: z.string().optional(),
    }),
}), import.meta);
export const getArtifactList = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        page_index: z.number().optional().default(0).describe("页码，从 0 开始"),
        page_size: z.number().optional().default(20).describe("每页数量，最大 100"),
        modality: z
            .enum(["PICTURE", "VIDEO", "AUDIO"])
            .optional()
            .describe("作品类型：PICTURE=图片，VIDEO=视频，AUDIO=音频"),
        is_starred: z
            .boolean()
            .optional()
            .describe("是否只获取星标作品"),
    }),
}, async ({ page_index = 0, page_size = 20, modality, is_starred }, { log, apis }) => {
    log.debug("get_artifact_list: page_index: %d, page_size: %d, modality: %s, is_starred: %s", page_index, page_size, modality ?? "all", is_starred ?? "all");
    const result = await apis.artifact.getArtifactList({
        page_index,
        page_size,
        modality,
        is_starred,
    });
    return {
        total: result.total,
        list: result.list.map((item) => ({
            uuid: item.uuid,
            status: item.status,
            url: item.url,
            is_starred: item.is_starred,
            ctime: item.ctime,
            mtime: item.mtime,
            modality: item.modality,
            audio_name: item.audio_name,
        })),
    };
});

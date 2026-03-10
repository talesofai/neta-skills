import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";

const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);

export const editHtml = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: z.object({
        prompt: z.string().describe("HTML 编辑提示词"),
        initial_html: z.string().optional().describe("初始 HTML 内容"),
    }),
}, async ({ prompt, initial_html }, { log, apis, _meta }) => {
    const payload = {
        url: "https://app.nieta.art/verse_template/new.html",
        prompt: prompt,
        current_schema: "{}",
        description: "HTML 页面",
        html_content: initial_html || ""
    };
    
    log.info("edit_html: payload: %o", payload);
    
    try {
        const result = await apis.verse.patchHtml(payload);
        log.info("edit_html: result: %o", result);
        return {
            task_status: "SUCCESS",
            html_content: result,
            task_uuid: result
        };
    } catch (error) {
        log.error("edit_html: error: %o", error);
        return {
            task_status: "FAILURE",
            error: error.message,
            html_content: ""
        };
    }
});

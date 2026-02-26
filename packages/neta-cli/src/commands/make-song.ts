import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const makeSongCommand = new Command("make-song")
  .description("生成音乐 - 基于提示词和歌词生成歌曲")
  .requiredOption("-p, --prompt <string>", "歌曲描述提示词")
  .requiredOption("-l, --lyrics <string>", "歌词内容")
  .action(async (options) => {
    try {
      console.log(`正在生成歌曲...`);
      console.log(`提示词：${options.prompt}`);
      console.log(`歌词长度：${options.lyrics.length} 字符`);

      const result = await apiClient.makeSong({
        prompt: options.prompt,
        lyrics: options.lyrics,
      });

      console.log("\n生成结果:");
      console.log(JSON.stringify(result, null, 2));

      if (result.task_status === "SUCCESS") {
        const audioArtifact = result.artifacts.find(
          (a) => a.modality === "AUDIO" && a.url,
        );
        if (audioArtifact?.url) {
          console.log(`\n歌曲 URL: ${audioArtifact.url}`);
          console.log(`歌曲名称：${audioArtifact.audio_detail?.audio_name || "生成的歌曲"}`);
          if (audioArtifact.audio_detail?.lyric_url) {
            console.log(`歌词 URL: ${audioArtifact.audio_detail.lyric_url}`);
          }
        }
      }
    } catch (error) {
      console.error("生成歌曲失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

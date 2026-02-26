import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const makeSongCommand = new Command("make-song")
  .description("生成音乐 - 基于提示词和歌词生成歌曲")
  .requiredOption("-p, --prompt <string>", "歌曲描述提示词")
  .requiredOption("-l, --lyrics <string>", "歌词内容")
  .action(async (options) => {
    try {
      const result = await apiClient.makeSong({
        prompt: options.prompt,
        lyrics: options.lyrics,
      });

      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(JSON.stringify({
        error: {
          message: errorMessage,
        },
      }, null, 2));
      process.exit(1);
    }
  });

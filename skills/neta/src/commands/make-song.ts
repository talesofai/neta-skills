import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const makeSongCommand = new Command('make-song')
  .description('生成歌曲 - 基于提示词和歌词生成歌曲')
  .requiredOption('-p, --prompt <string>', '歌曲描述提示词 (10-2000 字符)')
  .requiredOption('-l, --lyrics <string>', '歌词内容 (10-3500 字符)')
  .action(async (options) => {
    try {
      const result = await apiClient.makeSong({
        prompt: options.prompt,
        lyrics: options.lyrics,
      });

      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        JSON.stringify(
          {
            error: {
              message: errorMessage,
            },
          },
          null,
          2,
        ),
      );
      process.exit(1);
    }
  });

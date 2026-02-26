import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const mergeVideoCommand = new Command('merge-video')
  .description('合并视频 - 将多个素材合并为视频')
  .requiredOption('-i, --input <string>', '合并指令/提示词')
  .action(async (options) => {
    try {
      const result = await apiClient.mergeVideo({
        input: options.input,
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

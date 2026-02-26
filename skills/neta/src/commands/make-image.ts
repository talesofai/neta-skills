import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const makeImageCommand = new Command('make-image')
  .description('生成图片 - 基于文本提示词生成图片')
  .requiredOption('-p, --prompt <string>', '图片描述提示词')
  .option('-a, --aspect <string>', '宽高比 (1:1, 3:4, 4:3, 9:16, 16:9)', '3:4')
  .action(async (options) => {
    try {
      const result = await apiClient.makeImage({
        prompt: options.prompt,
        aspect: options.aspect,
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

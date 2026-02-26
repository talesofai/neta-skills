import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const requestBgmCommand = new Command('request-bgm')
  .description('获取背景音乐 - 获取推荐的背景音乐')
  .action(async () => {
    try {
      // 调用 API 获取 BGM（使用空占位符）
      const result = await apiClient.requestCharacterOrElementum({
        parent_type: 'both',
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

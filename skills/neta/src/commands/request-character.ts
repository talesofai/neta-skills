import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const requestCharacterCommand = new Command('request-character')
  .description('获取角色详情 - 通过名称精确获取角色详细信息')
  .requiredOption('-n, --name <string>', '角色名称')
  .action(async (options) => {
    try {
      const result = await apiClient.requestCharacterOrElementum({
        name: options.name,
        parent_type: 'character',
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

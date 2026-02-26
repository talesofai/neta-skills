import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const requestCharacterOrStyleCommand = new Command('request-character-or-style')
  .description('获取角色或元素详情 - 通过名称或 UUID 获取详细信息')
  .option('-n, --name <string>', '角色/元素名称')
  .option('-u, --uuid <string>', '角色/元素 UUID')
  .option('-t, --parent-type <string>', '类型 (character/elementum/both)', 'both')
  .action(async (options) => {
    try {
      if (!options.name && !options.uuid) {
        throw new Error('必须提供 --name 或 --uuid 参数之一');
      }

      const result = await apiClient.requestCharacterOrElementum({
        name: options.name,
        uuid: options.uuid,
        parent_type: options.parentType,
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

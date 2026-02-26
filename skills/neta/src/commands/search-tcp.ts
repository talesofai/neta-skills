import { Command } from 'commander';
import { apiClient } from '../api/client.ts';

export const searchTcpCommand = new Command('search-tcp')
  .description('搜索角色和元素 - 模糊搜索角色和风格元素')
  .requiredOption('-k, --keywords <string>', '搜索关键词')
  .option('-t, --parent-type <string>', '类型 (character/elementum/both)', 'both')
  .option('-s, --sort-scheme <string>', '排序方式 (exact/best)', 'best')
  .option('--page-index <number>', '页码', '0')
  .option('--page-size <number>', '每页数量', '10')
  .action(async (options) => {
    try {
      const result = await apiClient.searchTCPs({
        keywords: options.keywords,
        parent_type: options.parentType,
        sort_scheme: options.sortScheme,
        page_index: parseInt(options.pageIndex, 10),
        page_size: parseInt(options.pageSize, 10),
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

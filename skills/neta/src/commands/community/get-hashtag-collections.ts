import { Command } from 'commander';
import { apiClient } from '../../api/client.ts';

export const getHashtagCollectionsCommand = new Command('get-hashtag-collections')
  .description('获取标签合集 - 获取 hashtag 下的精选合集列表')
  .requiredOption('-t, --hashtag <string>', '标签名称')
  .option('--page-index <number>', '页码', '0')
  .option('--page-size <number>', '每页数量', '20')
  .option('--sort-by <string>', '排序方式', 'highlight_mark_time')
  .action(async (options) => {
    try {
      const result = await apiClient.fetchSelectedCollections({
        hashtag: options.hashtag,
        page_index: parseInt(options.pageIndex, 10),
        page_size: parseInt(options.pageSize, 10),
        sort_by: options.sortBy,
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

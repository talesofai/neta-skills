import { Command } from "commander";
import { apiClient } from "../../api/client.ts";

export const getHashtagCollectionsCommand = new Command("get-hashtag-collections")
  .description("获取标签合集 - 获取 hashtag 下的精选合集列表")
  .requiredOption("-t, --hashtag <string>", "标签名称")
  .option("--page-index <number>", "页码", "0")
  .option("--page-size <number>", "每页数量", "20")
  .option("--sort-by <string>", "排序方式", "highlight_mark_time")
  .action(async (options) => {
    try {
      console.log(`正在获取标签合集：${options.hashtag}`);
      console.log(`页码：${options.pageIndex}, 每页：${options.pageSize}`);
      console.log(`排序：${options.sortBy}`);

      const result = await apiClient.fetchSelectedCollections({
        hashtag: options.hashtag,
        page_index: parseInt(options.pageIndex),
        page_size: parseInt(options.pageSize),
        sort_by: options.sortBy,
      });

      console.log(`\n搜索结果：共 ${result.total} 条`);
      console.log(`当前页：${result.page_index}, 每页：${result.page_size}`);

      if (result.list.length > 0) {
        console.log("\n合集列表:");
        result.list.forEach((collection, index) => {
          console.log(`\n${index + 1}. ${collection.name}`);
          console.log(`   UUID: ${collection.uuid}`);
          console.log(`   创建者：${collection.creator_name}`);
          console.log(`   点赞数：${collection.likeCount}`);
          console.log(`   同风格数：${collection.sameStyleCount}`);
          if (collection.coverUrl) {
            console.log(`   封面：${collection.coverUrl}`);
          }
          if (collection.ctime) {
            console.log(`   创建时间：${collection.ctime}`);
          }
        });
      }

      console.log("\n完整结果:");
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("获取标签合集失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

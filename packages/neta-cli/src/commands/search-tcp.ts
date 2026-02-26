import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const searchTcpCommand = new Command("search-tcp")
  .description("搜索角色和元素 - 搜索角色或风格元素")
  .requiredOption("-k, --keywords <string>", "搜索关键词")
  .option("-t, --parent-type <string>", "类型 (character/elementum/both)", "both")
  .option("-s, --sort-scheme <string>", "排序方式 (exact/best)", "best")
  .option("--page-index <number>", "页码", "0")
  .option("--page-size <number>", "每页数量", "10")
  .action(async (options) => {
    try {
      console.log(`正在搜索：${options.keywords}`);
      console.log(`类型：${options.parent_type}`);
      console.log(`排序：${options.sort_scheme}`);

      const result = await apiClient.searchTCPs({
        keywords: options.keywords,
        parent_type: options.parent_type,
        sort_scheme: options.sort_scheme,
        page_index: parseInt(options.pageIndex),
        page_size: parseInt(options.pageSize),
      });

      console.log(`\n搜索结果：共 ${result.total} 条`);
      console.log(`当前页：${result.page_index}, 每页：${result.page_size}`);

      if (result.list.length > 0) {
        console.log("\n结果列表:");
        result.list.forEach((item, index) => {
          console.log(`\n${index + 1}. ${item.name} (${item.type})`);
          console.log(`   UUID: ${item.uuid}`);
          if (item.avatar_img) {
            console.log(`   头像：${item.avatar_img}`);
          }
          if (item.header_img) {
            console.log(`   头图：${item.header_img}`);
          }
        });
      }

      console.log("\n完整结果:");
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("搜索失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

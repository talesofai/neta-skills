import { Command } from "commander";
import { apiClient } from "../../api/client.ts";

export const getHashtagCharactersCommand = new Command("get-hashtag-characters")
  .description("获取标签角色 - 获取 hashtag 下的角色列表")
  .requiredOption("-t, --hashtag <string>", "标签名称")
  .option("--page-index <number>", "页码", "0")
  .option("--page-size <number>", "每页数量", "20")
  .option("--sort-by <string>", "排序方式 (hot/newest)", "hot")
  .option("--parent-type <string>", "类型 (oc/elementum)", "")
  .action(async (options) => {
    try {
      console.log(`正在获取标签角色：${options.hashtag}`);
      console.log(`页码：${options.pageIndex}, 每页：${options.pageSize}`);
      console.log(`排序：${options.sortBy}`);

      const result = await apiClient.fetchCharactersByHashtag({
        hashtag: options.hashtag,
        page_index: parseInt(options.pageIndex),
        page_size: parseInt(options.pageSize),
        sort_by: (options.sortBy as "hot" | "newest") || "hot",
        parent_type: options.parentType as "oc" | "elementum" | undefined,
      });

      console.log(`\n搜索结果：共 ${result.total} 条`);
      console.log(`当前页：${result.page_index}, 每页：${result.page_size}`);
      console.log(`是否有下一页：${result.has_next}`);

      if (result.list.length > 0) {
        console.log("\n角色列表:");
        result.list.forEach((char, index) => {
          console.log(`\n${index + 1}. ${char.name} (${char.short_name})`);
          console.log(`   UUID: ${char.uuid}`);
          console.log(`   创建者：${char.creator_name}`);
          console.log(`   创建时间：${char.ctime}`);
          if (char.avatar_img) {
            console.log(`   头像：${char.avatar_img}`);
          }
        });
      }

      console.log("\n完整结果:");
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("获取标签角色失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

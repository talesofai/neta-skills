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
      const result = await apiClient.fetchCharactersByHashtag({
        hashtag: options.hashtag,
        page_index: parseInt(options.pageIndex),
        page_size: parseInt(options.pageSize),
        sort_by: (options.sortBy as "hot" | "newest") || "hot",
        parent_type: options.parentType as "oc" | "elementum" | undefined,
      });

      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(JSON.stringify({
        error: {
          message: errorMessage,
        },
      }, null, 2));
      process.exit(1);
    }
  });

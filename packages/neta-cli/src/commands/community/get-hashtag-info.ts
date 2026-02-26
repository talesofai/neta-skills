import { Command } from "commander";
import { apiClient } from "../../api/client.ts";

export const getHashtagInfoCommand = new Command("get-hashtag-info")
  .description("获取标签信息 - 获取 hashtag 的详细信息")
  .requiredOption("-t, --hashtag <string>", "标签名称")
  .action(async (options) => {
    try {
      console.log(`正在获取标签信息：${options.hashtag}`);

      const result = await apiClient.fetchHashtag(options.hashtag);

      console.log("\n标签信息:");
      console.log(JSON.stringify(result, null, 2));

      if (result.hashtag) {
        console.log(`\n标签名称：${result.hashtag.name}`);
        console.log(` lore 数量：${result.hashtag.lore?.length || 0}`);
        if (result.hashtag.activity_detail) {
          console.log(`活动：${result.hashtag.activity_detail.title || "未知"}`);
        }
        if (result.hashtag.hashtag_heat !== undefined) {
          console.log(`热度：${result.hashtag.hashtag_heat}`);
        }
        if (result.hashtag.subscribe_count !== undefined) {
          console.log(`订阅数：${result.hashtag.subscribe_count}`);
        }
      }
    } catch (error) {
      console.error("获取标签信息失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

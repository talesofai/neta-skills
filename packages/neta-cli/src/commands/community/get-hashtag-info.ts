import { Command } from "commander";
import { apiClient } from "../../api/client.ts";

export const getHashtagInfoCommand = new Command("get-hashtag-info")
  .description("获取标签信息 - 获取 hashtag 的详细信息")
  .requiredOption("-t, --hashtag <string>", "标签名称")
  .action(async (options) => {
    try {
      const result = await apiClient.fetchHashtag(options.hashtag);

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

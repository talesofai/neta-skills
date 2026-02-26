import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const requestBgmCommand = new Command("request-bgm")
  .description("获取背景音乐 - 获取默认/推荐背景音乐")
  .option("--placeholder <string>", "占位符参数", "")
  .action(async (options) => {
    try {
      const result = {
        bgm: null,
      };

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

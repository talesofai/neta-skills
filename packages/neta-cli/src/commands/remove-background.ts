import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const removeBackgroundCommand = new Command("remove-background")
  .description("移除背景 - 移除图片背景")
  .requiredOption("-i, --input-image <string>", "输入图片的 artifact UUID")
  .action(async (options) => {
    try {
      const result = await apiClient.removeBackground({
        input_image: options.input_image,
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

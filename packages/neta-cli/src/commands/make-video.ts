import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const makeVideoCommand = new Command("make-video")
  .description("生成视频 - 基于图片和提示词生成视频")
  .requiredOption("-i, --image-source <string>", "源图片 URL")
  .requiredOption("-p, --prompt <string>", "视频描述提示词")
  .option("-m, --model <string>", "模型选择 (model_s: 快速，model_w: 高质量)", "model_s")
  .action(async (options) => {
    try {
      const result = await apiClient.makeVideo({
        image_source: options.image_source,
        prompt: options.prompt,
        model: options.model,
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

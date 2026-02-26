import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const makeVideoCommand = new Command("make-video")
  .description("生成视频 - 基于图片和提示词生成视频")
  .requiredOption("-i, --image-source <string>", "源图片 URL")
  .requiredOption("-p, --prompt <string>", "视频描述提示词")
  .option("-m, --model <string>", "模型选择 (model_s: 快速，model_w: 高质量)", "model_s")
  .action(async (options) => {
    try {
      console.log(`正在生成视频...`);
      console.log(`源图片：${options.image_source}`);
      console.log(`提示词：${options.prompt}`);
      console.log(`模型：${options.model}`);

      const result = await apiClient.makeVideo({
        image_source: options.image_source,
        prompt: options.prompt,
        model: options.model,
      });

      console.log("\n生成结果:");
      console.log(JSON.stringify(result, null, 2));

      if (result.task_status === "SUCCESS") {
        const videoArtifact = result.artifacts.find(
          (a) => a.modality === "VIDEO" && a.url,
        );
        if (videoArtifact?.url) {
          console.log(`\n视频封面 URL: ${videoArtifact.url}`);
          console.log(`视频详情 URL: ${videoArtifact.detail_url}`);
        }
      }
    } catch (error) {
      console.error("生成视频失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const makeImageCommand = new Command("make-image")
  .description("生成图片 - 基于文本提示词生成图片")
  .requiredOption("-p, --prompt <string>", "图片描述提示词")
  .option("-a, --aspect <string>", "宽高比", "3:4")
  .action(async (options) => {
    try {
      console.log(`正在生成图片：${options.prompt}`);
      console.log(`宽高比：${options.aspect}`);

      const result = await apiClient.makeImage({
        prompt: options.prompt,
        aspect: options.aspect,
      });

      console.log("\n生成结果:");
      console.log(JSON.stringify(result, null, 2));

      if (result.task_status === "SUCCESS") {
        const imageArtifact = result.artifacts.find(
          (a) => a.modality === "PICTURE" && a.url,
        );
        if (imageArtifact?.url) {
          console.log(`\n图片 URL: ${imageArtifact.url}`);
        }
      }
    } catch (error) {
      console.error("生成图片失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

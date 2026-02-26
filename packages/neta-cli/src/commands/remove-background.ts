import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const removeBackgroundCommand = new Command("remove-background")
  .description("移除背景 - 移除图片背景")
  .requiredOption("-i, --input-image <string>", "输入图片的 artifact UUID")
  .action(async (options) => {
    try {
      console.log(`正在移除背景...`);
      console.log(`输入图片 UUID: ${options.input_image}`);

      const result = await apiClient.removeBackground({
        input_image: options.input_image,
      });

      console.log("\n处理结果:");
      console.log(JSON.stringify(result, null, 2));

      if (result.task_status === "SUCCESS") {
        const imageArtifact = result.artifacts.find(
          (a) => a.modality === "PICTURE" && a.url,
        );
        if (imageArtifact?.url) {
          console.log(`\n处理后的图片 URL: ${imageArtifact.url}`);
        }
      }
    } catch (error) {
      console.error("移除背景失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

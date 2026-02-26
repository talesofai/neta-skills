import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const mergeVideoCommand = new Command("merge-video")
  .description("合并视频 - 将多个素材合并为视频")
  .requiredOption("-i, --input <string>", "合并指令/提示词")
  .action(async (options) => {
    try {
      console.log(`正在合并视频...`);
      console.log(`合并指令：${options.input}`);

      const result = await apiClient.mergeVideo({
        input: options.input,
      });

      console.log("\n合并结果:");
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
      console.error("合并视频失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

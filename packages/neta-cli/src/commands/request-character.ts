import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const requestCharacterCommand = new Command("request-character")
  .description("获取角色详情 - 通过名称获取角色详细信息")
  .requiredOption("-n, --name <string>", "角色名称")
  .action(async (options) => {
    try {
      console.log(`正在获取角色详情：${options.name}`);

      // 先搜索角色
      const searchResult = await apiClient.searchTCPs({
        keywords: options.name,
        page_index: 0,
        page_size: 1,
        parent_type: "character",
        sort_scheme: "best",
      });

      if (searchResult.list.length === 0) {
        console.error(`未找到角色：${options.name}`);
        process.exit(1);
      }

      const firstMatch = searchResult.list[0];
      console.log(`找到角色：${firstMatch.name}`);

      // 获取详细信息
      const tcp = await apiClient.tcpProfile(firstMatch.uuid);

      if (!tcp) {
        console.error("无法获取角色详情");
        process.exit(1);
      }

      const result = {
        character: {
          type: "character" as const,
          uuid: tcp.uuid,
          name: tcp.name,
          age: tcp.oc_bio?.age,
          interests: tcp.oc_bio?.interests,
          persona: tcp.oc_bio?.persona,
          description: tcp.oc_bio?.description,
          occupation: tcp.oc_bio?.occupation,
          avatar_img: tcp.config?.avatar_img,
          header_img: tcp.config?.header_img,
        },
      };

      console.log("\n角色详情:");
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("获取角色详情失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

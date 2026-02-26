import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const requestCharacterCommand = new Command("request-character")
  .description("获取角色详情 - 通过名称获取角色详细信息")
  .requiredOption("-n, --name <string>", "角色名称")
  .action(async (options) => {
    try {
      const searchResult = await apiClient.searchTCPs({
        keywords: options.name,
        page_index: 0,
        page_size: 1,
        parent_type: "character",
        sort_scheme: "best",
      });

      if (searchResult.list.length === 0) {
        throw new Error(`未找到角色：${options.name}`);
      }

      const tcp = await apiClient.tcpProfile(searchResult.list[0].uuid);

      if (!tcp) {
        throw new Error("无法获取角色详情");
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

import { Command } from "commander";
import { apiClient } from "../api/client.ts";

export const requestCharacterOrStyleCommand = new Command("request-character-or-style")
  .description("获取角色或元素详情 - 通过名称或 UUID 获取角色/风格元素详细信息")
  .option("-n, --name <string>", "角色/元素名称")
  .option("-u, --uuid <string>", "角色/元素 UUID")
  .option("-t, --parent-type <string>", "类型 (character/elementum/both)", "both")
  .action(async (options) => {
    try {
      if (!options.name && !options.uuid) {
        console.error("错误：必须提供 --name 或 --uuid 参数之一");
        process.exit(1);
      }

      console.log(`正在获取详情...`);
      if (options.name) {
        console.log(`名称：${options.name}`);
      }
      if (options.uuid) {
        console.log(`UUID: ${options.uuid}`);
      }
      console.log(`类型：${options.parent_type}`);

      const result = await apiClient.requestCharacterOrElementum({
        name: options.name,
        uuid: options.uuid,
        parent_type: options.parent_type,
      });

      console.log("\n详情:");
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("获取详情失败:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

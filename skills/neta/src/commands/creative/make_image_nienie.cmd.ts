import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";
import {
  makeImageV1Parameters,
  type TaskResult,
  taskResultSchema,
} from "../schema.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

/**
 * 捏捏模型 - Agent API 模式
 * 
 * 使用 Agent API 间接调用 make_image_v1 工具
 * Manuscript UUID: 7f758b2d-60ab-4d31-aea2-28f966e7ef5a
 * 
 * 特点：
 * - 支持自然语言叙述提示词
 * - 通过 @角色名 自动引用角色
 * - 底层模型：Gemini nano banana + 字节 seedance
 * - 生成质量高，适合复杂场景
 */
export const makeImageNienie = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeImageV1Parameters,
    outputSchema: taskResultSchema,
  },
  async ({ prompt, aspect }, { log, apis, _meta, sendNotification }) => {
    const MANUSCRIPT_UUID = "7f758b2d-60ab-4d31-aea2-28f966e7ef5a";
    const PRESET_KEY = "latitude://8|live|running_agent_new";

    // 构建提示词：@角色名 + 自然语言叙述
    const buildPromptText = async () => {
      const vtokens = (await apis.prompt.parseVtokens(prompt)) ?? [];
      
      // 提取角色名
      let characterName = "";
      if (vtokens.length > 0 && vtokens[0].name) {
        characterName = vtokens[0].name;
      }
      
      // 移除 prompt 中的角色引用部分，保留纯描述
      let purePrompt = prompt;
      for (const vtoken of vtokens) {
        // 移除 @角色名 或 角色名 格式
        purePrompt = purePrompt.replace(new RegExp(`@?${vtoken.name}`, "g"), "").trim();
      }
      
      // 构建完整提示词：@角色名 + 描述
      if (characterName) {
        return `@${characterName} ${purePrompt}`;
      }
      return purePrompt;
    };

    const callAgent = async () => {
      const promptText = await buildPromptText();
      
      log.info("make_image_nienie: prompt text: %s", promptText);

      const payload = {
        auto_approve: true,
        inputs: [
          {
            role: "user" as const,
            content: [
              {
                type: "input_text" as const,
                text: promptText,
              },
            ],
          },
        ],
        preset_key: PRESET_KEY,
        parameters: {
          preset_description: "",
          reference_planning: "",
          reference_content: "",
          reference_content_schema: "",
        },
        allowed_tool_names: ["make_image_v1"],
        need_approval_tool_names: [],
        meta: {
          inherit: {},
          entrance_uuid: MANUSCRIPT_UUID,
        },
      };

      log.info("make_image_nienie: agent payload: %o", payload);

      // 调用 Agent API
      const response = await fetch(
        `https://agent.talesofai.cn/v1/agent/${MANUSCRIPT_UUID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": apis.config.xToken,
            "x-platform": "nieta-app/web",
            "x-nieta-app-version": "6.8.9",
            "device-id": apis.config.deviceId,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent API call failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      log.info("make_image_nienie: agent response: %o", result);

      if (result.message !== "OK") {
        throw new Error(`Agent API returned error: ${JSON.stringify(result)}`);
      }

      return true;
    };

    const getLatestArtifact = async () => {
      const response = await fetch(
        `https://api.talesofai.cn/v1/manuscript/${MANUSCRIPT_UUID}/assets`,
        {
          method: "GET",
          headers: {
            "x-token": apis.config.xToken,
            "x-platform": "nieta-app/web",
            "x-nieta-app-version": "6.8.9",
            "device-id": apis.config.deviceId,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get manuscript assets: ${response.status}`);
      }

      const assets = await response.json();
      log.info("make_image_nienie: assets: %o", assets);

      if (!Array.isArray(assets) || assets.length === 0) {
        return null;
      }

      // 按 ctime 排序，取最新的
      const sorted = assets.sort((a, b) => {
        return new Date(b.ctime).getTime() - new Date(a.ctime).getTime();
      });

      const latest = sorted[0];
      
      if (latest.artifact?.status !== "SUCCESS") {
        return null;
      }

      return {
        task_uuid: latest.task_uuid,
        artifact_uuid: latest.artifact_uuid,
        url: latest.artifact.url,
        width: latest.artifact.width,
        height: latest.artifact.height,
        status: latest.artifact.status,
      };
    };

    // 执行
    const startTime = Date.now();
    const duration = 60 * 1000; // 捏捏约需 60 秒
    const timeout = 120 * 1000;

    try {
      // 步骤 1：调用 Agent API
      await callAgent();
      log.info("make_image_nienie: agent called successfully");

      // 步骤 2：轮询获取结果
      const res = await polling(
        async () => {
          const artifact = await getLatestArtifact();
          return artifact;
        },
        async (result) => {
          await sendNotification({
            method: "notifications/progress",
            params: {
              progressToken: _meta?.progressToken ?? "nienie",
              progress: Math.min(
                Number(((Date.now() - startTime) / duration).toFixed(2)),
                1,
              ),
              total: 1,
              message: `Generating... ${result ? result.task_uuid : "waiting"}`,
            },
          });
          log.debug("make_image_nienie: polling: %o", result);
          return result !== null;
        },
        2000,
        timeout,
      );

      if (res.isTimeout) {
        const structuredContent = {
          task_uuid: "",
          task_status: "TIMEOUT",
          artifacts: [],
        } satisfies TaskResult;

        log.info("make_image_nienie: timeout: %o", structuredContent);
        return structuredContent;
      }

      const artifact = res.result;
      
      if (!artifact) {
        throw new Error("No artifact found after polling");
      }

      const structuredContent = {
        task_uuid: artifact.task_uuid,
        task_status: "SUCCESS",
        artifacts: [
          {
            uuid: artifact.artifact_uuid,
            url: artifact.url,
            width: artifact.width,
            height: artifact.height,
          },
        ],
      } satisfies TaskResult;

      log.info("make_image_nienie: result: %o", structuredContent);
      return structuredContent;
    } catch (error) {
      log.error("make_image_nienie: error: %o", error);
      throw error;
    }
  },
);

#!/usr/bin/env node
import dotenv from "dotenv-flow";
dotenv.config();

const NETA_TOKEN = process.env.NETA_TOKEN;
const MANUSCRIPT_UUID = "7f758b2d-60ab-4d31-aea2-28f966e7ef5a"; // 捏捏剧本

const referenceImage = "https://oss.talesofai.cn/sts/785d16cc35954666b85-4e3f-95f5-536551659c36.png";
const prompt = "@西西（自设） 清晨起床，角色站在窗口探出头，微笑着给画面外的人打招呼。马卡龙配色，画面温柔活泼，二次元 Q 版风格，温暖的晨光洒在脸上，卧室温馨舒适，粉蓝色调，梦幻柔和的氛围。";

async function callAgent() {
  console.log("🦞 调用捏捏 Agent API...");
  console.log("参考图:", referenceImage);
  console.log("提示词:", prompt);

  const response = await fetch(`https://agent.talesofai.cn/v1/agent/${MANUSCRIPT_UUID}`, {
    method: "POST",
    headers: {
      "x-token": NETA_TOKEN,
      "x-platform": "nieta-app/web",
      "x-nieta-app-version": "6.8.9",
      "device-id": "7588817246181453826",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auto_approve: true,
      inputs: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
          ],
        },
      ],
      preset_key: "latitude://8|live|running_agent_new",
      parameters: {
        preset_description: "",
        reference_planning: "",
        reference_content: referenceImage, // 参考图 URL
        reference_content_schema: "",
      },
      allowed_tool_names: ["make_image_v1"],
      need_approval_tool_names: [],
      meta: {
        inherit: {},
        entrance_uuid: MANUSCRIPT_UUID,
      },
    }),
  });

  const result = await response.json();
  console.log("Agent API 响应:", JSON.stringify(result, null, 2));

  if (result.message === "OK") {
    console.log("\n✅ Agent API 调用成功！开始轮询结果...");
    return true;
  } else {
    console.error("\n❌ Agent API 调用失败:", result);
    return false;
  }
}

async function pollAssets() {
  console.log("\n🔄 轮询 Manuscript Assets...");
  
  const maxAttempts = 30; // 最多轮询 30 次（约 60 秒）
  const interval = 2000; // 每 2 秒轮询一次

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`https://api.talesofai.cn/v1/manuscript/${MANUSCRIPT_UUID}/assets`, {
        headers: {
          "x-token": NETA_TOKEN,
          "x-platform": "nieta-app/web",
          "x-nieta-app-version": "6.8.9",
          "device-id": "7588817246181453826",
        },
      });

      const assets = await response.json();
      console.log(`\n第 ${i + 1} 次轮询:`, Array.isArray(assets) ? `${assets.length} 个资源` : assets);

      if (Array.isArray(assets) && assets.length > 0) {
        // 取最新的资源（ctime 最新）
        const latest = assets.sort((a, b) => new Date(b.ctime) - new Date(a.ctime))[0];
        
        if (latest.artifact?.status === "SUCCESS" && latest.artifact?.url) {
          console.log("\n✅ 生成成功！");
          console.log("图片 URL:", latest.artifact.url);
          console.log("尺寸:", `${latest.artifact.width}x${latest.artifact.height}`);
          return latest.artifact.url;
        } else if (latest.artifact?.status === "PENDING" || latest.artifact?.status === "PROCESSING") {
          console.log(`状态: ${latest.artifact.status}，继续等待...`);
        } else if (latest.artifact?.status === "FAILURE") {
          console.error("\n❌ 生成失败:", latest);
          return null;
        }
      }
    } catch (error) {
      console.error("轮询出错:", error.message);
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  console.error("\n⏰ 轮询超时！");
  return null;
}

async function main() {
  const success = await callAgent();
  if (success) {
    const imageUrl = await pollAssets();
    if (imageUrl) {
      console.log("\n🎉 完成！图片 URL:", imageUrl);
    }
  }
}

main().catch(console.error);

#!/usr/bin/env node
import dotenv from "dotenv-flow";
dotenv.config();

const TOKEN = process.env.NETA_TOKEN;
const BASE_URL = "https://api.talesofai.cn";

if (!TOKEN) {
  console.error("错误：未设置 NETA_TOKEN 环境变量");
  process.exit(1);
}

const HEADERS = {
  "x-token": TOKEN,
  "x-platform": "nieta-app/web",
  "Content-Type": "application/json",
};

// 获取当前用户信息
async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/v1/user/`, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    throw new Error(`获取用户信息失败：${res.status}`);
  }
  
  return res.json();
}

// 获取用户发布的故事列表
async function getUserStories(uuid, pageIndex = 0, pageSize = 20) {
  const url = `${BASE_URL}/v2/story/user-stories`;
  const params = new URLSearchParams({
    uuid,
    page_index: pageIndex.toString(),
    page_size: pageSize.toString(),
  });
  
  const res = await fetch(`${url}?${params}`, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`获取用户故事失败：${res.status} - ${error}`);
  }
  
  return res.json();
}

// 标记帖子为精选
async function markAsFeatured(hashtag, storyUuid) {
  const url = `${BASE_URL}/v1/hashtag/${encodeURIComponent(hashtag)}/stories/review/${storyUuid}`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      result: "HIGHLIGHT",
      item_type: "collection",
    }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`标记精选失败：${res.status} - ${error}`);
  }
  
  return res.json();
}

async function main() {
  const hashtag = "西西の🦞";
  const targetTitle = "周二早上好";
  
  console.log(`🔍 通过用户故事 API 查找新帖子...`);
  
  // 1. 获取当前用户信息
  console.log(`\n📋 获取当前用户信息...`);
  const user = await getCurrentUser();
  const userUuid = user.uuid;
  const userNickName = user.nick_name;
  console.log(`   用户：${userNickName}`);
  
  // 2. 获取用户发布的最新故事
  console.log(`\n📥 获取用户发布的最新故事...`);
  
  const result = await getUserStories(userUuid, 0, 20);
  
  if (!result.list || result.list.length === 0) {
    console.log(`\n📭 没有找到故事`);
    return;
  }
  
  console.log(`✅ 找到 ${result.list.length} 个故事`);
  
  // 3. 筛选出带有目标 hashtag 的帖子
  const targetStories = result.list.filter(story => {
    const hashtags = story.hashtag_names || [];
    return hashtags.includes(hashtag);
  });
  
  console.log(`✅ 其中带有"${hashtag}"标签的有 ${targetStories.length} 个`);
  
  // 4. 查找目标帖子
  const targetStory = result.list.find(s => s.name && s.name.includes(targetTitle));
  
  if (targetStory) {
    console.log(`\n🎯 找到目标帖子：`);
    console.log(`   标题：${targetStory.name}`);
    console.log(`   UUID: ${targetStory.storyId}`);
    console.log(`   标签：${(targetStory.hashtag_names || []).join(', ')}`);
    console.log(`   时间：${new Date(targetStory.ctime).toLocaleString('zh-CN')}`);
    
    // 标记为精选
    console.log(`\n📌 标记为精选...`);
    try {
      const result = await markAsFeatured(hashtag, targetStory.storyId);
      if (result.message === "success") {
        console.log(`  ✅ 成功标记为精选！`);
      } else {
        console.log(`  ⏭️ 可能已经精选过了`);
      }
    } catch (error) {
      console.log(`  ❌ 失败：${error.message}`);
    }
  } else {
    console.log(`\n⚠️ 未找到包含"${targetTitle}"的帖子`);
    console.log(`\n用户最新故事列表：`);
    result.list.slice(0, 10).forEach((story, index) => {
      const storyId = story.storyId;
      const storyName = story.name || "未知标题";
      const ctime = story.ctime ? new Date(story.ctime).toLocaleString('zh-CN') : '未知时间';
      const hashtags = (story.hashtag_names || []).join(', ');
      console.log(`   ${index + 1}. [${ctime}] ${storyName}`);
      console.log(`      标签：${hashtags || '无'}`);
    });
  }
}

main()
  .then(() => {
    console.log(`\n✅ 任务完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 任务失败：${error.message}`);
    process.exit(1);
  });

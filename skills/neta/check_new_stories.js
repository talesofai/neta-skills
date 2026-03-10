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

// 获取 hashtag 下的帖子列表
async function fetchStories(hashtag, pageIndex, pageSize = 20, sortBy = "newest") {
  const url = `${BASE_URL}/v1/hashtag/${encodeURIComponent(hashtag)}/stories`;
  const params = new URLSearchParams({
    page_index: pageIndex.toString(),
    page_size: pageSize.toString(),
    sort_by: sortBy,
  });
  
  const res = await fetch(`${url}?${params}`, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`获取帖子失败：${res.status} - ${error}`);
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

async function main(hashtag) {
  console.log(`🔍 开始处理 hashtag: "${hashtag}"`);
  
  // 1. 获取当前用户信息
  console.log(`\n📋 获取当前用户信息...`);
  const user = await getCurrentUser();
  const userUuid = user.uuid;
  const userNickName = user.nick_name;
  console.log(`   用户：${userNickName}`);
  
  // 2. 获取最新帖子（只获取第 1 页，因为新发布的会在最前面）
  console.log(`\n📥 获取最新帖子列表...`);
  
  const result = await fetchStories(hashtag, 0, 20, "newest");
  
  if (!result.list || result.list.length === 0) {
    console.log(`\n📭 没有找到帖子`);
    return;
  }
  
  // 筛选出用户发布的帖子
  const userStories = result.list.filter(story => 
    story.user_uuid === userUuid
  );
  
  console.log(`✅ 第 1 页找到你的 ${userStories.length} 个帖子`);
  
  if (userStories.length === 0) {
    console.log(`\n📭 你没有在这个 hashtag 下发布帖子`);
    return;
  }
  
  // 3. 批量标记为精选
  console.log(`\n📌 开始批量标记精选...`);
  
  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failedStories = [];
  
  for (const story of userStories) {
    const storyId = story.storyId || story.uuid;
    const storyName = story.name || "未知标题";
    const ctime = story.ctime ? new Date(story.ctime).toLocaleString('zh-CN') : '未知时间';
    
    try {
      const result = await markAsFeatured(hashtag, storyId);
      
      if (result.message === "success") {
        success++;
        console.log(`  ✅ [${ctime}] ${storyName}`);
      } else {
        skipped++;
        console.log(`  ⏭️ [${ctime}] ${storyName} (已精选)`);
      }
    } catch (error) {
      failed++;
      failedStories.push({ name: storyName, uuid: storyId, error: error.message });
      console.log(`  ❌ [${ctime}] ${storyName} - ${error.message}`);
    }
    
    // 稍微延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // 输出结果
  console.log(`\n=== 批量精选完成 ===`);
  console.log(`标签：${hashtag}`);
  console.log(`你的帖子：${userStories.length}个`);
  console.log(`成功：${success}个`);
  console.log(`跳过：${skipped}个`);
  console.log(`失败：${failed}个`);
  
  if (failedStories.length > 0) {
    console.log(`\n失败详情：`);
    failedStories.forEach(s => {
      console.log(`  - ${s.name} (${s.uuid}): ${s.error}`);
    });
  }
  
  return { success, skipped, failed, total: userStories.length };
}

// 执行
const hashtag = process.argv[2] || "西西の🦞";

main(hashtag)
  .then(result => {
    console.log(`\n✅ 任务完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 任务失败：${error.message}`);
    process.exit(1);
  });

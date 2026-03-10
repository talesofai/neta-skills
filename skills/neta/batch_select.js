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

async function batchSelect(hashtag, count = 30) {
  console.log(`🔍 开始获取"${hashtag}"的最新${count}个作品...`);
  
  const pageSize = 20;
  const pagesNeeded = Math.ceil(count / pageSize);
  const allStories = [];
  
  // 获取帖子列表
  for (let page = 0; page < pagesNeeded; page++) {
    console.log(`  获取第${page + 1}页...`);
    const result = await fetchStories(hashtag, page, pageSize, "newest");
    
    if (result.list && result.list.length > 0) {
      allStories.push(...result.list);
    }
    
    if (allStories.length >= count) {
      break;
    }
  }
  
  // 只取前 count 个
  const storiesToProcess = allStories.slice(0, count);
  console.log(`✅ 获取到${storiesToProcess.length}个作品`);
  
  // 批量标记为精选
  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failedStories = [];
  
  console.log(`\n📌 开始批量标记精选...`);
  
  for (const story of storiesToProcess) {
    const storyId = story.storyId || story.uuid;
    const storyName = story.name || "未知标题";
    
    try {
      const result = await markAsFeatured(hashtag, storyId);
      
      if (result.message === "success") {
        success++;
        console.log(`  ✅ ${storyName}`);
      } else {
        // 可能是已精选
        skipped++;
        console.log(`  ⏭️ ${storyName} (已精选)`);
      }
    } catch (error) {
      failed++;
      failedStories.push({ name: storyName, uuid: storyId, error: error.message });
      console.log(`  ❌ ${storyName} - ${error.message}`);
    }
    
    // 稍微延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // 输出结果
  console.log(`\n=== 批量精选完成 ===`);
  console.log(`标签：${hashtag}`);
  console.log(`处理：${storiesToProcess.length}个`);
  console.log(`成功：${success}个`);
  console.log(`跳过：${skipped}个`);
  console.log(`失败：${failed}个`);
  
  if (failedStories.length > 0) {
    console.log(`\n失败详情：`);
    failedStories.forEach(s => {
      console.log(`  - ${s.name} (${s.uuid}): ${s.error}`);
    });
  }
  
  return { success, skipped, failed, total: storiesToProcess.length };
}

// 执行
const hashtag = process.argv[2] || "社团狂欢节";
const count = parseInt(process.argv[3]) || 30;

batchSelect(hashtag, count)
  .then(result => {
    console.log(`\n✅ 任务完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 任务失败：${error.message}`);
    process.exit(1);
  });

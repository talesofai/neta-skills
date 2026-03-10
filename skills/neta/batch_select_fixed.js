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

async function main(hashtag, targetCount = 30) {
  console.log(`🔍 开始处理 hashtag: "${hashtag}"`);
  console.log(`📌 目标：获取最新${targetCount}个帖子并批量精选`);
  
  // 1. 获取帖子列表
  console.log(`\n📥 获取帖子列表...`);
  
  const allStories = [];
  let page = 0;
  const pageSize = 20;
  let hasMore = true;
  
  while (hasMore && allStories.length < targetCount) {
    console.log(`   获取第${page + 1}页...`);
    const result = await fetchStories(hashtag, page, pageSize, "newest");
    
    if (!result.list || result.list.length === 0) {
      hasMore = false;
      break;
    }
    
    allStories.push(...result.list);
    
    if (!result.has_next) {
      hasMore = false;
    }
    
    page++;
  }
  
  const storiesToProcess = allStories.slice(0, targetCount);
  console.log(`✅ 获取到 ${storiesToProcess.length} 个帖子`);
  
  // 2. 检查每个帖子的精选状态
  console.log(`\n🔍 检查帖子精选状态...`);
  
  const needSelect = [];
  const alreadySelected = [];
  const cannotSelect = [];
  
  for (const story of storiesToProcess) {
    const storyId = story.storyId || story.uuid;
    const storyName = story.name || "未知标题";
    const creatorName = story.user_nick_name || "未知作者";
    
    // 检查 is_pinned 字段（精选标记）
    const isPinned = story.is_pinned === true;
    
    if (isPinned) {
      alreadySelected.push({ id: storyId, name: storyName, creator: creatorName });
      console.log(`  ⏭️ [已精选] ${storyName.substring(0, 30)}... - ${creatorName}`);
    } else {
      needSelect.push({ id: storyId, name: storyName, creator: creatorName });
      console.log(`  📋 [待精选] ${storyName.substring(0, 30)}... - ${creatorName}`);
    }
  }
  
  console.log(`\n📊 状态统计：`);
  console.log(`   待精选：${needSelect.length}个`);
  console.log(`   已精选：${alreadySelected.length}个`);
  console.log(`   无法精选：${cannotSelect.length}个`);
  
  // 3. 批量标记为精选
  if (needSelect.length > 0) {
    console.log(`\n📌 开始批量标记精选...`);
    
    let success = 0;
    let skipped = 0;
    let failed = 0;
    const failedStories = [];
    
    for (const story of needSelect) {
      try {
        const result = await markAsFeatured(hashtag, story.id);
        
        if (result.message === "success") {
          success++;
          console.log(`  ✅ ${story.name.substring(0, 40)}... - ${story.creator}`);
        } else {
          skipped++;
          console.log(`  ⏭️ ${story.name.substring(0, 40)}... (已精选)`);
        }
      } catch (error) {
        failed++;
        failedStories.push({ ...story, error: error.message });
        console.log(`  ❌ ${story.name.substring(0, 40)}... - ${error.message}`);
      }
      
      // 稍微延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 输出结果
    console.log(`\n=== 批量精选完成 ===`);
    console.log(`标签：${hashtag}`);
    console.log(`处理总数：${storiesToProcess.length}个`);
    console.log(`原本已精选：${alreadySelected.length}个`);
    console.log(`本次成功：${success}个`);
    console.log(`本次跳过：${skipped}个`);
    console.log(`本次失败：${failed}个`);
    
    if (failedStories.length > 0) {
      console.log(`\n失败详情：`);
      failedStories.forEach(s => {
        console.log(`  - ${s.name} (${s.id}): ${s.error}`);
      });
    }
    
    return { 
      total: storiesToProcess.length, 
      alreadySelected: alreadySelected.length,
      success, 
      skipped, 
      failed 
    };
  } else {
    console.log(`\n✅ 所有帖子都已经精选过了，无需操作`);
    return { 
      total: storiesToProcess.length, 
      alreadySelected: alreadySelected.length,
      success: 0, 
      skipped: 0, 
      failed: 0 
    };
  }
}

// 执行 - 使用正确的 hashtag 名称（无空格）
const hashtag = "捏 ta 有个挺牛的宿社";
const count = 30;

main(hashtag, count)
  .then(result => {
    console.log(`\n✅ 任务完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 任务失败：${error.message}`);
    process.exit(1);
  });

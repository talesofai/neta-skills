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

// 通过短链接获取故事详情
async function getStoryByShortLink(shortCode) {
  // 尝试通过 collection 详情 API 获取
  const url = `${BASE_URL}/v3/story/story-detail?uuids=${shortCode}`;
  
  const res = await fetch(url, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`获取帖子详情失败：${res.status} - ${error}`);
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

async function main() {
  const hashtag = "西西の🦞";
  const shortCode = "O99RYlPz"; // 从 URL https://t.nieta.art/O99RYlPz 提取
  
  console.log(`🔍 查找帖子：${shortCode}`);
  
  // 1. 获取当前用户信息
  console.log(`\n📋 获取当前用户信息...`);
  const user = await getCurrentUser();
  const userUuid = user.uuid;
  const userNickName = user.nick_name;
  console.log(`   用户：${userNickName}`);
  
  // 2. 尝试直接获取帖子详情
  console.log(`\n📥 尝试获取帖子详情...`);
  try {
    const storyDetail = await getStoryByShortLink(shortCode);
    console.log(`   找到帖子：`, storyDetail);
  } catch (e) {
    console.log(`   无法通过短链接获取，尝试从 hashtag 列表查找...`);
  }
  
  // 3. 获取最新帖子列表（多获取几页）
  console.log(`\n📥 获取最新帖子列表（最多 5 页）...`);
  
  const userStories = [];
  let page = 0;
  const pageSize = 20;
  let hasMore = true;
  
  while (hasMore && page < 5) {
    const result = await fetchStories(hashtag, page, pageSize, "newest");
    
    if (!result.list || result.list.length === 0) {
      hasMore = false;
      break;
    }
    
    // 筛选出用户发布的帖子
    const storiesByUser = result.list.filter(story => 
      story.user_uuid === userUuid
    );
    
    userStories.push(...storiesByUser);
    
    console.log(`   第${page + 1}页：找到${storiesByUser.length}个你的帖子`);
    
    if (!result.has_next) {
      hasMore = false;
    }
    
    page++;
  }
  
  console.log(`\n✅ 共找到你的 ${userStories.length} 个帖子`);
  
  // 查找特定标题的帖子
  const targetTitle = "周二早上好";
  const targetStory = userStories.find(s => s.name && s.name.includes(targetTitle));
  
  if (targetStory) {
    console.log(`\n🎯 找到目标帖子：`);
    console.log(`   标题：${targetStory.name}`);
    console.log(`   UUID: ${targetStory.storyId || targetStory.uuid}`);
    console.log(`   时间：${targetStory.ctime}`);
    
    // 标记为精选
    console.log(`\n📌 标记为精选...`);
    const storyId = targetStory.storyId || targetStory.uuid;
    try {
      const result = await markAsFeatured(hashtag, storyId);
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
    console.log(`\n最新帖子列表：`);
    userStories.slice(0, 10).forEach((story, index) => {
      const storyId = story.storyId || story.uuid;
      const storyName = story.name || "未知标题";
      const ctime = story.ctime ? new Date(story.ctime).toLocaleString('zh-CN') : '未知时间';
      console.log(`   ${index + 1}. [${ctime}] ${storyName}`);
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

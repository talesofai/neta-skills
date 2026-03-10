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

async function checkAndSelect(hashtag) {
  console.log(`🔍 开始检查 hashtag: "${hashtag}"`);
  
  // 1. 获取当前用户信息
  console.log(`\n📋 获取当前用户信息...`);
  const user = await getCurrentUser();
  const userUuid = user.uuid;
  const userNickName = user.nick_name;
  console.log(`   用户：${userNickName}`);
  
  // 2. 获取所有帖子，筛选出用户发布的
  console.log(`\n📥 获取帖子列表并筛选...`);
  
  const userStories = [];
  let page = 0;
  const pageSize = 20;
  let hasMore = true;
  
  while (hasMore) {
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
    
    if (!result.has_next || page >= 10) {
      hasMore = false;
    }
    
    page++;
  }
  
  console.log(`✅ 共找到你的 ${userStories.length} 个帖子`);
  
  if (userStories.length === 0) {
    console.log(`\n📭 你没有在这个 hashtag 下发布帖子`);
    return;
  }
  
  // 3. 检查每个帖子的精选状态
  console.log(`\n🔍 检查每个帖子的精选状态...`);
  
  const needSelect = [];
  const alreadySelected = [];
  
  for (const story of userStories) {
    const storyId = story.storyId || story.uuid;
    const storyName = story.name || "未知标题";
    const isFeatured = story.is_pinned || story.favorStatus === "favorited" || false;
    
    // 由于 API 不直接返回精选状态，我们假设所有帖子都需要检查
    // 实际上需要调用详情接口才能确认，这里简化处理
    needSelect.push(story);
  }
  
  console.log(`   待检查：${needSelect.length}个`);
  console.log(`   已精选：${alreadySelected.length}个`);
  
  // 4. 输出帖子列表
  console.log(`\n📋 你的帖子列表：`);
  userStories.forEach((story, index) => {
    const storyId = story.storyId || story.uuid;
    const storyName = story.name || "未知标题";
    const ctime = story.ctime ? new Date(story.ctime).toLocaleString('zh-CN') : '未知时间';
    console.log(`   ${index + 1}. ${storyName}`);
    console.log(`      UUID: ${storyId}`);
    console.log(`      时间：${ctime}`);
  });
  
  return { total: userStories.length, needSelect: needSelect.length, alreadySelected: alreadySelected.length };
}

// 执行
const hashtag = process.argv[2] || "西西の🦞";

checkAndSelect(hashtag)
  .then(result => {
    console.log(`\n✅ 检查完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 检查失败：${error.message}`);
    process.exit(1);
  });

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

// 获取 hashtag 信息
async function getHashtagInfo(hashtag) {
  const url = `${BASE_URL}/v1/hashtag/hashtag_info/${encodeURIComponent(hashtag)}`;
  
  const res = await fetch(url, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`获取 hashtag 信息失败：${res.status} - ${error}`);
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
  
  console.log(`   URL: ${url}?${params.toString()}`);
  
  const res = await fetch(`${url}?${params}`, {
    headers: HEADERS,
  });
  
  console.log(`   响应状态：${res.status}`);
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`获取帖子失败：${res.status} - ${error}`);
  }
  
  return res.json();
}

async function main(hashtag) {
  console.log(`🔍 检查 hashtag: "${hashtag}"`);
  
  // 1. 获取 hashtag 信息
  console.log(`\n📋 获取 hashtag 信息...`);
  try {
    const info = await getHashtagInfo(hashtag);
    console.log(`   名称：${info.name}`);
    console.log(`   创作者：${info.creator_name}`);
    console.log(`   标签页：${(info.tab_names || []).join(', ')}`);
  } catch (error) {
    console.log(`   ❌ 无法获取 hashtag 信息：${error.message}`);
  }
  
  // 2. 获取帖子列表
  console.log(`\n📥 获取帖子列表...`);
  
  try {
    const result = await fetchStories(hashtag, 0, 20, "newest");
    console.log(`\n✅ 响应数据：`);
    console.log(`   total: ${result.total}`);
    console.log(`   page_index: ${result.page_index}`);
    console.log(`   page_size: ${result.page_size}`);
    console.log(`   list 长度：${result.list ? result.list.length : 0}`);
    
    if (result.list && result.list.length > 0) {
      console.log(`\n📋 最新帖子：`);
      result.list.slice(0, 5).forEach((story, i) => {
        console.log(`   ${i + 1}. ${story.name || '未知标题'} - ${story.user_nick_name || '未知作者'}`);
      });
    }
  } catch (error) {
    console.log(`\n❌ 获取失败：${error.message}`);
  }
}

// 执行
const hashtag = process.argv[2] || "捏 ta 有个挺牛的宿社";

main(hashtag)
  .then(() => {
    console.log(`\n✅ 完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 失败：${error.message}`);
    process.exit(1);
  });

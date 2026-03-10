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
async function fetchStoriesRaw(encodedHashtag, pageIndex, pageSize = 20, sortBy = "newest") {
  // 直接使用编码后的 hashtag
  const url = `${BASE_URL}/v1/hashtag/${encodedHashtag}/stories`;
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

async function main() {
  // 从重定向 URL 直接复制的编码值
  const encodedHashtag = "%E6%8D%8Fta%E6%9C%89%E4%B8%AA%E6%8C%BA%E7%89%9B%E7%9A%84%E5%AE%BF%E7%A4%BE";
  
  console.log(`🔍 测试编码 hashtag: ${encodedHashtag}`);
  console.log(`   解码后：${decodeURIComponent(encodedHashtag)}`);
  
  // 获取帖子列表
  console.log(`\n📥 获取帖子列表...`);
  
  try {
    const result = await fetchStoriesRaw(encodedHashtag, 0, 20, "newest");
    console.log(`\n✅ 响应数据：`);
    console.log(`   total: ${result.total}`);
    console.log(`   list 长度：${result.list ? result.list.length : 0}`);
    
    if (result.list && result.list.length > 0) {
      console.log(`\n📋 最新帖子：`);
      result.list.slice(0, 10).forEach((story, i) => {
        console.log(`   ${i + 1}. ${story.name || '未知标题'} - ${story.user_nick_name || '未知作者'}`);
      });
    } else {
      console.log(`\n📭 没有找到帖子`);
    }
  } catch (error) {
    console.log(`\n❌ 获取失败：${error.message}`);
  }
}

main()
  .then(() => {
    console.log(`\n✅ 完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 失败：${error.message}`);
    process.exit(1);
  });

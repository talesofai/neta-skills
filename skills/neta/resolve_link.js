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

// 搜索 hashtag
async function searchHashtag(query) {
  const url = `${BASE_URL}/v1/hashtag/search?keywords=${encodeURIComponent(query)}&page_index=0&page_size=10`;
  
  const res = await fetch(url, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`搜索失败：${res.status} - ${error}`);
  }
  
  return res.json();
}

// 获取短链接对应的内容
async function resolveShortLink(shortCode) {
  // 尝试作为 story UUID 查询
  const url = `${BASE_URL}/v3/story/story-detail?uuids=${shortCode}`;
  
  const res = await fetch(url, {
    headers: HEADERS,
  });
  
  if (res.ok) {
    const data = await res.json();
    if (data && data.length > 0) {
      return { type: 'story', data: data[0] };
    }
  }
  
  // 尝试作为 hashtag 查询
  try {
    const hashtagInfo = await fetch(`${BASE_URL}/v1/hashtag/hashtag_info/${shortCode}`, {
      headers: HEADERS,
    }).then(r => r.json());
    
    if (hashtagInfo && hashtagInfo.name) {
      return { type: 'hashtag', data: hashtagInfo };
    }
  } catch (e) {
    // 忽略
  }
  
  return null;
}

async function main() {
  const shortCode = "PVkfJ1vW";
  
  console.log(`🔍 解析短链接：${shortCode}`);
  
  // 1. 尝试解析短链接
  console.log(`\n📥 尝试解析短链接...`);
  const resolved = await resolveShortLink(shortCode);
  
  if (resolved) {
    console.log(`✅ 解析成功：类型=${resolved.type}`);
    if (resolved.type === 'story') {
      console.log(`   标题：${resolved.data.name}`);
      console.log(`   标签：${(resolved.data.hashtags || []).join(', ')}`);
      console.log(`   作者：${resolved.data.user_nick_name}`);
    } else if (resolved.type === 'hashtag') {
      console.log(`   名称：${resolved.data.name}`);
    }
  } else {
    console.log(`❌ 无法解析短链接`);
  }
  
  // 2. 搜索相似的 hashtag
  console.log(`\n🔍 搜索相关 hashtag...`);
  const keywords = ["宿社", "捏 ta", "挺牛"];
  
  for (const kw of keywords) {
    try {
      console.log(`\n   搜索："${kw}"`);
      const result = await searchHashtag(kw);
      
      if (result && result.list && result.list.length > 0) {
        console.log(`   ✅ 找到 ${result.list.length} 个结果:`);
        result.list.slice(0, 5).forEach((tag, i) => {
          console.log(`      ${i + 1}. ${tag.name || tag.tag_name}`);
        });
      } else {
        console.log(`   📭 无结果`);
      }
    } catch (error) {
      console.log(`   ❌ 搜索失败：${error.message}`);
    }
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

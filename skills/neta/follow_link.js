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

// 获取短链接（跟随重定向）
async function followShortLink(shortCode) {
  const url = `https://t.nieta.art/${shortCode}`;
  
  const res = await fetch(url, {
    redirect: 'manual', // 不自动跟随重定向
  });
  
  console.log(`状态码：${res.status}`);
  console.log(`重定向位置：${res.headers.get('location') || '无'}`);
  
  if (res.status === 301 || res.status === 302) {
    const location = res.headers.get('location');
    if (location) {
      return location;
    }
  }
  
  return null;
}

// 从 URL 提取 hashtag 或 story UUID
function extractFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    
    // 可能是 /hashtag/xxx 或 /story/xxx 或 /collection/xxx
    const match = pathname.match(/\/(hashtag|story|collection|space)\/([^\/]+)/);
    if (match) {
      return { type: match[1], value: match[2] };
    }
    
    // 或者直接是 hashtag 名称
    if (pathname && pathname !== '/') {
      return { type: 'hashtag', value: decodeURIComponent(pathname.substring(1)) };
    }
  } catch (e) {
    console.log(`URL 解析失败：${e.message}`);
  }
  
  return null;
}

// 获取 hashtag 下的帖子
async function fetchStories(hashtag, pageIndex = 0, pageSize = 20) {
  const url = `${BASE_URL}/v1/hashtag/${encodeURIComponent(hashtag)}/stories`;
  const params = new URLSearchParams({
    page_index: pageIndex.toString(),
    page_size: pageSize.toString(),
    sort_by: 'newest',
  });
  
  const res = await fetch(`${url}?${params}`, {
    headers: HEADERS,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`${res.status} - ${error}`);
  }
  
  return res.json();
}

async function main(shortCode) {
  console.log(`🔍 解析短链接：${shortCode}`);
  
  // 1. 跟随短链接
  console.log(`\n📥 获取重定向目标...`);
  const redirectUrl = await followShortLink(shortCode);
  
  if (!redirectUrl) {
    console.log(`❌ 无法获取重定向 URL`);
    return;
  }
  
  console.log(`✅ 重定向到：${redirectUrl}`);
  
  // 2. 提取信息
  const extracted = extractFromUrl(redirectUrl);
  
  if (!extracted) {
    console.log(`❌ 无法从 URL 提取信息`);
    console.log(`\n尝试直接作为 hashtag 名称处理...`);
    
    // 尝试从 URL 路径提取
    const match = redirectUrl.match(/nieta\.art\/([^?]+)/);
    if (match) {
      const potentialHashtag = decodeURIComponent(match[1]);
      console.log(`   可能的 hashtag: ${potentialHashtag}`);
      
      // 尝试获取这个 hashtag 的帖子
      try {
        console.log(`\n📥 尝试获取帖子...`);
        const result = await fetchStories(potentialHashtag, 0, 20);
        console.log(`✅ 成功！total=${result.total}`);
        
        if (result.list && result.list.length > 0) {
          console.log(`\n📋 最新帖子：`);
          result.list.slice(0, 5).forEach((s, i) => {
            console.log(`   ${i + 1}. ${s.name} - ${s.user_nick_name}`);
          });
        }
      } catch (error) {
        console.log(`❌ 失败：${error.message}`);
      }
    }
    
    return;
  }
  
  console.log(`✅ 类型：${extracted.type}, 值：${extracted.value}`);
  
  // 3. 根据类型处理
  if (extracted.type === 'hashtag' || extracted.type === 'space') {
    console.log(`\n📥 获取帖子列表...`);
    try {
      const result = await fetchStories(extracted.value, 0, 20);
      console.log(`✅ total=${result.total}`);
      
      if (result.list && result.list.length > 0) {
        console.log(`\n📋 最新帖子：`);
        result.list.slice(0, 5).forEach((s, i) => {
          console.log(`   ${i + 1}. ${s.name} - ${s.user_nick_name}`);
        });
      }
    } catch (error) {
      console.log(`❌ 失败：${error.message}`);
    }
  }
}

// 执行
const shortCode = process.argv[2] || "PVkfJ1vW";

main(shortCode)
  .then(() => {
    console.log(`\n✅ 完成！`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ 失败：${error.message}`);
    process.exit(1);
  });

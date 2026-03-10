import axios from 'axios';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcyNSwidXVpZCI6Ijc4NWQxNmNjMzU5NTQ2NjQ4MTU2OWNhMjY0YzZiOTI3IiwicGhvbmVfbnVtIjoiMTgwNjI2OTI3NDUiLCJleHBpcmVzX2F0IjoxODA0MjYxNTE4LCJpc19yZWdpc3RlciI6ZmFsc2UsInVzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMwLjAuMC4wIFNhZmFyaS81MzcuMzYgUXVhcmtQQy82LjQuNS43MzciLCJzYWx0IjoiNGI5YjIwYWIwODY2NDM5YmE2NDc1NWIwZjA3M2FiMDgifQ.WuGPaULWfvrWqdJBS-JLTtb15Y6IJaPKIV4X1zZ630s';
const API_BASE = 'https://api.talesofai.cn';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-token': TOKEN,
    'x-platform': 'web',
    'x-nieta-app-version': '6.8.8',
  },
});

async function main() {
  const hashtagName = '捏捏开荒团';
  
  console.log(`获取"${hashtagName}"的 feed 第一页...\n`);
  
  const feedsRes = await client.get('/v1/space/collection/feed', {
    params: {
      hashtag_name: hashtagName,
      page_index: 0,
      page_size: 20
    }
  });
  
  const items = feedsRes.data.collection_feed_item || [];
  
  console.log(`获取到 ${items.length} 条作品\n`);
  
  // 分析数据结构
  console.log('=== 第一条作品完整数据结构 ===\n');
  console.log(JSON.stringify(items[0], null, 2));
  
  console.log('\n\n=== 所有作品标题和 same_style_count ===\n');
  items.forEach((item, i) => {
    console.log(`${i + 1}. 《${item.title}》 - same_style_count: ${item.same_style_count}`);
  });
}

main();

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

async function tryHashtag(name) {
  try {
    const res = await client.get('/v1/hashtag/info', {
      params: { hashtag_name: name }
    });
    return { name, found: true, data: res.data };
  } catch (error) {
    return { name, found: false, error: error.response?.data?.detail || error.message };
  }
}

async function main() {
  // 尝试各种可能的标签名称
  const candidates = [
    '捏捏',
    '开荒团',
    '捏捏开荒',
    '开荒',
    '西西の🦞',
    '小龙虾',
    '捏 Ta',
    '捏他',
  ];
  
  console.log('=== 尝试查找标签 ===\n');
  
  for (const name of candidates) {
    const result = await tryHashtag(name);
    if (result.found) {
      console.log(`✅ ${name} - 找到!`);
      console.log(`   订阅数：${result.data.hashtag?.subscribe_count || 'N/A'}`);
      console.log(`   热度：${result.data.hashtag?.hashtag_heat || 'N/A'}`);
      
      // 获取精选帖子
      try {
        const storiesRes = await client.get('/v1/hashtag/selected-stories', {
          params: { 
            hashtag_name: name,
            page_index: 0,
            page_size: 20,
            sort_by: 'highlight_mark_time'
          }
        });
        console.log(`   精选帖子数：${storiesRes.data.total}`);
        if (storiesRes.data.list && storiesRes.data.list.length > 0) {
          console.log('   最新精选:');
          storiesRes.data.list.slice(0, 3).forEach(story => {
            console.log(`     - 《${story.name}》by ${story.creator_name} (${story.likeCount}👍)`);
          });
        }
      } catch (e) {
        console.log(`   获取精选帖子失败：${e.response?.data?.detail || e.message}`);
      }
      console.log('');
    } else {
      console.log(`❌ ${name} - 未找到`);
    }
  }
}

main();

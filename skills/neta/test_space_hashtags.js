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
    const infoRes = await client.get('/v1/hashtag/info', {
      params: { hashtag_name: name }
    });
    
    const storiesRes = await client.get('/v1/hashtag/selected-stories', {
      params: { 
        hashtag_name: name,
        page_index: 0,
        page_size: 10,
        sort_by: 'highlight_mark_time'
      }
    });
    
    return {
      name,
      found: true,
      subscribe_count: infoRes.data.hashtag?.subscribe_count,
      hashtag_heat: infoRes.data.hashtag?.hashtag_heat,
      selected_count: storiesRes.data.total,
      latest_stories: storiesRes.data.list?.slice(0, 3).map(s => ({
        name: s.name,
        creator: s.creator_name,
        likes: s.likeCount,
        ctime: s.ctime
      }))
    };
  } catch (error) {
    return { name, found: false, error: error.response?.data?.detail || error.message };
  }
}

async function main() {
  // 从空间列表中取一些标签来测试
  const candidates = [
    '动物街区银河街',
    '槐安公寓',
    '伪人大本营',
    '桃花堂',
    '随心工坊',
    '夜幕高定',
    '黑星赏金团',
    '绯云商会',
  ];
  
  console.log('=== 测试标签 API ===\n');
  
  const results = [];
  for (const name of candidates) {
    console.log(`正在测试：${name}...`);
    const result = await tryHashtag(name);
    results.push(result);
    if (result.found) {
      console.log(`  ✅ 找到 - 订阅：${result.subscribe_count}, 精选：${result.selected_count}`);
    } else {
      console.log(`  ❌ 未找到 - ${result.error}`);
    }
  }
  
  console.log('\n=== 成功找到的标签 ===\n');
  const found = results.filter(r => r.found);
  if (found.length > 0) {
    found.forEach(r => {
      console.log(`${r.name}:`);
      console.log(`  订阅数：${r.subscribe_count}`);
      console.log(`  精选帖子：${r.selected_count}`);
      if (r.latest_stories && r.latest_stories.length > 0) {
        console.log('  最新精选:');
        r.latest_stories.forEach(s => {
          console.log(`    - 《${s.name}》by ${s.creator} (${s.likes}👍) [${s.ctime}]`);
        });
      }
      console.log('');
    });
  } else {
    console.log('没有找到任何标签');
  }
}

main();

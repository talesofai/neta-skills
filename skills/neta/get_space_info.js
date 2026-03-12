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
  
  console.log('=== 获取捏捏开荒团的 Space 信息 ===\n');
  
  // 1. 先获取 space 基本信息
  const spaceRes = await client.get('/v1/space/get-by-hashtag', {
    params: { hashtag_name: hashtagName }
  });
  
  console.log('Space 信息:');
  console.log(JSON.stringify(spaceRes.data, null, 2));
  console.log('');
  
  // 2. 获取 space 的 topics
  if (spaceRes.data.space_uuid) {
    const topicsRes = await client.get('/v1/space/topics', {
      params: { space_uuid: spaceRes.data.space_uuid }
    });
    console.log('Topics:');
    console.log(JSON.stringify(topicsRes.data, null, 2));
    console.log('');
  }
  
  // 3. 尝试获取不同类型的 feed
  console.log('=== 测试不同 scene 的 feed ===\n');
  
  const scenes = [
    'topic_picked',      // 精选
    'topic_newest',      // 最新
    'relation_collection', // 合集
    'relation_story',    // 故事
  ];
  
  for (const scene of scenes) {
    try {
      const feedRes = await client.get('/v1/home/feed/interactive', {
        params: {
          scene: scene,
          target_hashtag: hashtagName,
          page_index: 0,
          page_size: 5
        }
      });
      
      const items = feedRes.data.module_list?.filter(m => m.template_id === 'NORMAL') || [];
      console.log(`Scene: ${scene} - ${items.length} items`);
      if (items.length > 0) {
        items.slice(0, 2).forEach(item => {
          const data = item.json_data;
          console.log(`  - ${data.name || data.title} (type: ${data.is_interactive ? 'collection' : 'story'})`);
        });
      }
    } catch (error) {
      console.log(`Scene: ${scene} - Error: ${error.response?.data?.detail || error.message}`);
    }
  }
}

main();

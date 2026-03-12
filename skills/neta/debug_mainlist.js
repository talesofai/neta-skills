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
  
  console.log('获取 mainlist feed 第一条数据的完整结构...\n');
  
  const feedRes = await client.get('/v1/home/feed/mainlist', {
    params: {
      theme: hashtagName,
      page_index: 0,
      page_size: 5
    }
  });
  
  const modules = feedRes.data.module_list || [];
  
  console.log('=== 前 3 条 module 的 json_data 结构 ===\n');
  
  modules.slice(0, 3).forEach((module, i) => {
    if (module.template_id !== 'NORMAL') return;
    
    const data = module.json_data;
    console.log(`--- 第 ${i + 1} 条 ---`);
    console.log(`name: ${data.name}`);
    console.log(`uuid: ${data.uuid}`);
    console.log(`storyId: ${data.storyId}`);
    console.log(`creator: ${JSON.stringify(data.creator)}`);
    console.log(`ctime: ${data.ctime}`);
    console.log(`likeCount: ${data.likeCount}`);
    console.log(`commentCount: ${data.commentCount}`);
    console.log(`sameStyleCount: ${data.sameStyleCount}`);
    console.log(`is_interactive: ${data.is_interactive}`);
    console.log('');
  });
}

main();

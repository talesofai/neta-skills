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
  try {
    // 搜索角色/元素，看看能否找到相关内容
    const searchRes = await client.get('/v2/travel/parent/search', {
      params: {
        keywords: '捏捏开荒团',
        parent_type: 'both',
        sort_scheme: 'best',
        page_index: 0,
        page_size: 20
      }
    });
    console.log('=== 搜索结果 ===');
    console.log(JSON.stringify(searchRes.data, null, 2));
    
    // 尝试获取用户发布的帖子（西西的 uuid 是 785d16cc359546681569ca264c6b927）
    const userUuid = '785d16cc359546681569ca264c6b927';
    const userStoriesRes = await client.get('/v2/story/user-stories', {
      params: {
        uuid: userUuid,
        page_index: 0,
        page_size: 20
      }
    });
    console.log('\n=== 西西的帖子 ===');
    console.log(`总数：${userStoriesRes.data.total}`);
    userStoriesRes.data.list.forEach((story, index) => {
      console.log(`${index + 1}. 《${story.name}》 - 标签：${story.hashtag_names?.join(', ') || '无'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();

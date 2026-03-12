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

async function testEndpoint(method, endpoint, params = {}) {
  try {
    const res = await client({ method, url: endpoint, params });
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message, status: error.response?.status };
  }
}

async function main() {
  const hashtagName = '捏捏开荒团';
  
  console.log('=== 测试 Story 相关 API ===\n');
  
  const endpoints = [
    ['GET', '/v1/hashtag/stories', { hashtag_name: hashtagName, page_index: 0, page_size: 20 }],
    ['GET', '/v1/hashtag/selected-stories', { hashtag_name: hashtagName, page_index: 0, page_size: 20 }],
    ['GET', '/v2/hashtag/stories', { hashtag_name: hashtagName, page_index: 0, page_size: 20 }],
    ['GET', '/v1/space/story/feed', { hashtag_name: hashtagName, page_index: 0, page_size: 20 }],
    ['GET', '/v1/home/feed/mainlist', { theme: hashtagName, page_index: 0, page_size: 20 }],
  ];
  
  for (const [method, endpoint, params] of endpoints) {
    console.log(`Testing: ${method} ${endpoint}`);
    const result = await testEndpoint(method, endpoint, params);
    if (result.success) {
      console.log(`  ✅ Success`);
      const dataStr = JSON.stringify(result.data);
      if (dataStr.length < 800) {
        console.log(`     ${dataStr}`);
      } else {
        console.log(`     ${dataStr.slice(0, 800)}...`);
      }
    } else {
      console.log(`  ❌ ${result.error?.detail || JSON.stringify(result.error).slice(0, 200)}`);
    }
    console.log('');
  }
}

main();

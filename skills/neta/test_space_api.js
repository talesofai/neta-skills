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
  console.log('=== 测试 Space 相关 API ===\n');
  
  // 1. 先获取空间标签列表
  console.log('1. 获取空间标签列表...');
  const spaceHashtagsRes = await testEndpoint('GET', '/v1/configs/config?namespace=space&key=new_version_hashtag');
  if (spaceHashtagsRes.success) {
    const hashtags = spaceHashtagsRes.data.value ? JSON.parse(spaceHashtagsRes.data.value) : [];
    console.log(`   找到 ${hashtags.length} 个空间标签`);
    console.log(`   前 10 个：${hashtags.slice(0, 10).join(', ')}`);
  } else {
    console.log(`   ❌ ${spaceHashtagsRes.error}`);
  }
  console.log('');
  
  // 2. 尝试通过 space/get-by-hashtag 获取"捏捏开荒团"
  console.log('2. 尝试通过 hashtag 获取空间...');
  const spaceByHashtag = await testEndpoint('GET', '/v1/space/get-by-hashtag', { hashtag_name: '捏捏开荒团' });
  if (spaceByHashtag.success) {
    console.log(`   ✅ 找到空间：${JSON.stringify(spaceByHashtag.data, null, 2)}`);
  } else {
    console.log(`   ❌ ${spaceByHashtag.error}`);
  }
  console.log('');
  
  // 3. 获取空间配置
  console.log('3. 获取空间配置...');
  const spaceConfigsRes = await testEndpoint('GET', '/v1/configs/config?namespace=space&key=topic_tags_config');
  if (spaceConfigsRes.success) {
    const configs = spaceConfigsRes.data.value ? JSON.parse(spaceConfigsRes.data.value) : {};
    console.log(`   找到 ${Object.keys(configs).length} 个空间配置`);
    console.log(`   标签：${Object.keys(configs).slice(0, 10).join(', ')}`);
  } else {
    console.log(`   ❌ ${spaceConfigsRes.error}`);
  }
  console.log('');
  
  // 4. 尝试 feeds API
  console.log('4. 尝试获取捏捏开荒团的 feed...');
  const feedsRes = await testEndpoint('GET', '/v1/space/collection/feed', { 
    hashtag_name: '捏捏开荒团',
    page_index: 0,
    page_size: 20
  });
  if (feedsRes.success) {
    console.log(`   ✅ ${JSON.stringify(feedsRes.data, null, 2)}`);
  } else {
    console.log(`   ❌ ${feedsRes.error}`);
  }
  console.log('');
}

main();

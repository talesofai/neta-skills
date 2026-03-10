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

async function testEndpoint(method, endpoint, params = {}, data = null) {
  try {
    const res = await client({ method, url: endpoint, params, data });
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message, status: error.response?.status };
  }
}

async function main() {
  // 从 parent_relation_collection 中取一个作品 UUID
  const pictureUuid = 'e72e4484-2d88-4802-a701-5e7250ff7984';
  
  console.log('=== 测试 Picture/Story 相关 API ===\n');
  
  const endpoints = [
    ['GET', '/v1/picture/detail', { uuid: pictureUuid }],
    ['GET', '/v1/story/detail', { uuid: pictureUuid }],
    ['GET', '/v1/picture', { uuid: pictureUuid }],
    ['GET', '/v1/feed/detail', { uuid: pictureUuid }],
    ['GET', '/v1/collection/related', { uuid: pictureUuid }],
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
  
  // 尝试获取合集详情
  console.log('\n=== 尝试获取合集详情 ===\n');
  const collectionUuid = '587bb66a-f1b9-4c4a-abb4-74613fd4d8c4';
  
  const collectionEndpoints = [
    ['GET', '/v1/collection/related-works', { collection_uuid: collectionUuid }],
    ['GET', '/v1/collection/works', { collection_uuid: collectionUuid }],
    ['GET', '/v1/collection/statistics', { collection_uuid: collectionUuid }],
  ];
  
  for (const [method, endpoint, params] of collectionEndpoints) {
    console.log(`Testing: ${method} ${endpoint}`);
    const result = await testEndpoint(method, endpoint, params);
    if (result.success) {
      console.log(`  ✅ Success`);
      console.log(`     ${JSON.stringify(result.data, null, 2).slice(0, 800)}`);
    } else {
      console.log(`  ❌ ${result.error?.detail || JSON.stringify(result.error).slice(0, 200)}`);
    }
    console.log('');
  }
}

main();

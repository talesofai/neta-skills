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
    // 获取空间标签列表
    const spaceHashtagsRes = await client.get('/v1/configs/config?namespace=space&key=new_version_hashtag');
    const spaceHashtags = JSON.parse(spaceHashtagsRes.data.value) || [];
    
    console.log('=== 空间标签列表 ===');
    console.log(spaceHashtags);
    console.log('');
    
    // 查找"捏捏开荒团"相关的标签
    const targetHashtag = spaceHashtags.find(h => h.includes('捏捏') || h.includes('开荒'));
    
    if (targetHashtag) {
      console.log(`找到相关标签：${targetHashtag}`);
      
      // 获取标签信息
      const hashtagInfoRes = await client.get('/v1/hashtag/info', {
        params: { hashtag_name: targetHashtag }
      });
      console.log('\n=== 标签信息 ===');
      console.log(JSON.stringify(hashtagInfoRes.data, null, 2));
      
      // 获取标签下的精选故事
      const storiesRes = await client.get('/v1/hashtag/selected-stories', {
        params: { 
          hashtag_name: targetHashtag,
          page_index: 0,
          page_size: 20,
          sort_by: 'highlight_mark_time'
        }
      });
      console.log('\n=== 精选帖子列表 ===');
      console.log(JSON.stringify(storiesRes.data, null, 2));
    } else {
      console.log('未找到"捏捏开荒团"相关标签');
      console.log('所有可用空间标签:');
      spaceHashtags.forEach(h => console.log(`  - ${h}`));
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();

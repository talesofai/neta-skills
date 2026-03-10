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
    // 尝试"捏 Ta 学院"标签
    const hashtagName = '捏 Ta 学院';
    
    console.log(`正在获取标签"${hashtagName}"的精选帖子...\n`);
    
    // 获取标签信息
    const hashtagInfoRes = await client.get('/v1/hashtag/info', {
      params: { hashtag_name: hashtagName }
    });
    console.log('=== 标签信息 ===');
    console.log(`名称：${hashtagInfoRes.data.hashtag?.name}`);
    console.log(`订阅数：${hashtagInfoRes.data.hashtag?.subscribe_count}`);
    console.log(`热度：${hashtagInfoRes.data.hashtag?.hashtag_heat}`);
    console.log('');
    
    // 获取标签下的精选故事
    const storiesRes = await client.get('/v1/hashtag/selected-stories', {
      params: { 
        hashtag_name: hashtagName,
        page_index: 0,
        page_size: 20,
        sort_by: 'highlight_mark_time'
      }
    });
    console.log('=== 精选帖子列表 ===');
    console.log(`总数：${storiesRes.data.total}`);
    console.log('');
    
    if (storiesRes.data.list && storiesRes.data.list.length > 0) {
      storiesRes.data.list.forEach((story, index) => {
        const ctime = new Date(story.ctime);
        const now = new Date();
        const daysAgo = Math.floor((now - ctime) / (1000 * 60 * 60 * 24));
        
        console.log(`${index + 1}. 《${story.name}》`);
        console.log(`   作者：${story.creator_name}`);
        console.log(`   点赞：${story.likeCount} | 同款：${story.sameStyleCount}`);
        console.log(`   时间：${story.ctime} (${daysAgo}天前)`);
        console.log('');
      });
    } else {
      console.log('该标签下没有精选帖子');
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();

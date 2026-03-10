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
    const hashtagName = '捏捏开荒团';
    
    console.log(`正在获取标签"${hashtagName}"的精选帖子...\n`);
    
    // 获取标签下的精选故事 - 多页获取
    let allStories = [];
    let pageIndex = 0;
    const pageSize = 50;
    
    while (true) {
      const storiesRes = await client.get('/v1/hashtag/selected-stories', {
        params: { 
          hashtag_name: hashtagName,
          page_index: pageIndex,
          page_size: pageSize,
          sort_by: 'highlight_mark_time'
        }
      });
      
      console.log(`第 ${pageIndex + 1} 页：${storiesRes.data.list?.length || 0} 条 (总数：${storiesRes.data.total})`);
      
      if (storiesRes.data.list && storiesRes.data.list.length > 0) {
        allStories = allStories.concat(storiesRes.data.list);
      }
      
      // 如果没有更多数据，停止
      if (!storiesRes.data.has_next || storiesRes.data.list.length === 0) {
        break;
      }
      
      pageIndex++;
      
      // 安全限制，最多获取 10 页
      if (pageIndex >= 10) {
        console.log('已达到最大页数限制');
        break;
      }
    }
    
    console.log(`\n=== 共获取 ${allStories.length} 条精选帖子 ===\n`);
    
    // 筛选 2 月 22 日 -2 月 28 日 (UTC+8)
    // UTC+8 的 2 月 22 日 00:00 = UTC 的 2 月 21 日 16:00
    // UTC+8 的 2 月 28 日 23:59 = UTC 的 2 月 28 日 15:59
    const startDate = new Date('2026-02-21T16:00:00Z');
    const endDate = new Date('2026-02-28T15:59:59Z');
    
    const filteredStories = allStories.filter(story => {
      const storyDate = new Date(story.ctime);
      return storyDate >= startDate && storyDate <= endDate;
    });
    
    console.log(`筛选条件：2026-02-22 至 2026-02-28 (UTC+8)`);
    console.log(`筛选结果：${filteredStories.length} 条\n`);
    
    // 按作者排序
    filteredStories.sort((a, b) => {
      const nameA = (a.creator_name || '').toLowerCase();
      const nameB = (b.creator_name || '').toLowerCase();
      return nameA.localeCompare(nameB, 'zh-Hans-CN');
    });
    
    // 输出表格数据
    console.log('=== 筛选结果（按作者排序）===\n');
    console.log('作者 | 作品名称 | 点赞数 | 捏同款数 | 评论数');
    console.log('-'.repeat(80));
    
    filteredStories.forEach(story => {
      const ctime = new Date(story.ctime);
      const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
      const dateStr = utc8Time.toISOString().slice(0, 19).replace('T', ' ');
      
      console.log(`${story.creator_name || '未知'} | 《${story.name}》 | ${story.likeCount} | ${story.sameStyleCount} | ${story.commentCount || 0} | ${dateStr}`);
    });
    
    // 输出 JSON 格式
    console.log('\n=== JSON 格式 ===\n');
    console.log(JSON.stringify(filteredStories.map(story => {
      const ctime = new Date(story.ctime);
      const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
      return {
        author: story.creator_name,
        title: story.name,
        likes: story.likeCount,
        sameStyle: story.sameStyleCount,
        comments: story.commentCount || 0,
        publishTime: utc8Time.toISOString().slice(0, 19).replace('T', ' ')
      };
    }), null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();

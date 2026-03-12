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
  
  console.log('=== 获取捏捏开荒团的 feed (mainlist) ===\n');
  
  const feedRes = await client.get('/v1/home/feed/mainlist', {
    params: {
      theme: hashtagName,
      page_index: 0,
      page_size: 40
    }
  });
  
  const modules = feedRes.data.module_list || [];
  
  // 分离 story 和 collection
  const stories = [];
  const collections = [];
  
  for (const module of modules) {
    if (module.template_id !== 'NORMAL') continue;
    
    const data = module.json_data;
    const item = {
      uuid: data.storyId,
      name: data.name,
      creator: data.user_nick_name || '未知',
      likeCount: data.likeCount || 0,
      commentCount: data.commentCount || 0,
      sameStyleCount: data.sameStyleCount || 0,
      is_interactive: data.is_interactive || false,
      has_video: data.has_video || false,
    };
    
    if (data.is_interactive) {
      collections.push(item);
    } else {
      stories.push(item);
    }
  }
  
  console.log(`总计：${modules.filter(m => m.template_id === 'NORMAL').length} 条作品`);
  console.log(`Collection（交互式）: ${collections.length} 条`);
  console.log(`Story（非交互式）: ${stories.length} 条`);
  console.log('');
  
  // 获取 collection 的详细信息（包含时间）
  console.log('正在获取 Collection 的详细信息...\n');
  for (let i = 0; i < collections.length; i++) {
    const item = collections[i];
    try {
      const detailRes = await client.get('/v1/home/feed/interactive', {
        params: {
          collection_uuid: item.uuid,
          page_index: 0,
          page_size: 1
        }
      });
      
      const module = detailRes.data.module_list?.[0];
      if (module && module.json_data) {
        const jsonData = module.json_data;
        item.ctime = jsonData.ctime;
        item.likeCount = jsonData.likeCount || item.likeCount;
        item.commentCount = jsonData.commentCount || item.commentCount;
      }
      console.log(`[${i + 1}/${collections.length}] 《${item.name}》by ${item.creator}`);
    } catch (error) {
      console.log(`[${i + 1}/${collections.length}] 《${item.name}》- 获取详情失败`);
    }
  }
  
  console.log('\n\n=== Story 列表（非交互式）===\n');
  if (stories.length > 0) {
    console.log('作者 | 作品名称 | 点赞 | 捏同款 | 评论');
    console.log('='.repeat(100));
    stories.forEach((item, i) => {
      console.log(`${i + 1}. ${item.creator} | 《${item.name}》 | ${item.likeCount} | ${item.sameStyleCount} | ${item.commentCount}`);
    });
  } else {
    console.log('没有 Story 作品');
  }
  
  console.log('\n\n=== Collection 列表（交互式，按时间倒序）===\n');
  
  // 按时间排序
  collections.sort((a, b) => {
    if (!a.ctime) return 1;
    if (!b.ctime) return -1;
    return new Date(b.ctime).getTime() - new Date(a.ctime).getTime();
  });
  
  if (collections.length > 0) {
    console.log('作者 | 作品名称 | 点赞 | 捏同款 | 评论 | 发布时间 (UTC+8)');
    console.log('='.repeat(120));
    collections.forEach((item, i) => {
      let dateStr = '未知';
      if (item.ctime) {
        const ctime = new Date(item.ctime);
        if (!isNaN(ctime.getTime())) {
          const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
          dateStr = utc8Time.toISOString().slice(0, 16).replace('T', ' ');
        }
      }
      console.log(`${i + 1}. ${item.creator} | 《${item.name}》 | ${item.likeCount} | ${item.sameStyleCount} | ${item.commentCount} | ${dateStr}`);
    });
  } else {
    console.log('没有 Collection 作品');
  }
  
  // 筛选 2 月 22-28 日
  const startDate = new Date('2026-02-21T16:00:00Z');
  const endDate = new Date('2026-02-28T15:59:59Z');
  
  const filteredCollections = collections.filter(item => {
    if (!item.ctime) return false;
    const d = new Date(item.ctime);
    return d >= startDate && d <= endDate;
  });
  
  console.log('\n\n=== 2 月 22-28 日筛选结果 ===');
  console.log(`Story: ${stories.length} 条 (无时间信息)`);
  console.log(`Collection: ${filteredCollections.length} 条`);
  
  if (filteredCollections.length > 0) {
    console.log('\n符合条件的 Collection:');
    filteredCollections.forEach(item => {
      const ctime = new Date(item.ctime);
      const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
      const dateStr = utc8Time.toISOString().slice(0, 16).replace('T', ' ');
      console.log(`  - 《${item.name}》by ${item.creator} (${dateStr})`);
    });
  }
}

main();

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
  
  console.log(`正在获取"${hashtagName}"的精选帖子...\n`);
  
  const feedsRes = await client.get('/v1/space/collection/feed', {
    params: {
      hashtag_name: hashtagName,
      page_index: 0,
      page_size: 20
    }
  });
  
  const items = feedsRes.data.collection_feed_item || [];
  
  // 去重
  const uniqueItems = [];
  const seenUuids = new Set();
  for (const item of items) {
    if (!seenUuids.has(item.uuid)) {
      seenUuids.add(item.uuid);
      uniqueItems.push(item);
    }
  }
  
  // 获取详细信息
  const detailedWorks = [];
  for (const item of uniqueItems) {
    try {
      const detailRes = await client.get('/v1/home/feed/interactive', {
        params: {
          collection_uuid: item.uuid,
          page_index: 0,
          page_size: 1
        }
      });
      
      const module = detailRes.data.module_list?.[0];
      if (!module || module.template_id !== 'NORMAL') continue;
      
      const jsonData = module.json_data;
      detailedWorks.push({
        uuid: item.uuid,
        title: jsonData.name || item.title,
        creator_name: jsonData.creator?.nick_name || '未知',
        likeCount: jsonData.likeCount || 0,
        sameStyleCount: item.same_style_count || 0,
        commentCount: jsonData.commentCount || 0,
        ctime: jsonData.ctime
      });
    } catch (error) {
      // skip
    }
  }
  
  // 按时间排序
  detailedWorks.sort((a, b) => new Date(b.ctime).getTime() - new Date(a.ctime).getTime());
  
  console.log('=== 所有精选作品（按时间倒序）===\n');
  console.log('作者 | 作品名称 | 点赞 | 捏同款 | 评论 | 发布时间 (UTC+8)');
  console.log('='.repeat(130));
  
  detailedWorks.forEach((work, i) => {
    const ctime = new Date(work.ctime);
    const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = utc8Time.toISOString().slice(0, 16).replace('T', ' ');
    const dayOfWeek = utc8Time.toLocaleDateString('zh-CN', { weekday: 'short' });
    
    console.log(`${i + 1}. ${work.creator_name} | 《${work.title}》 | ${work.likeCount} | ${work.sameStyleCount} | ${work.commentCount} | ${dateStr} ${dayOfWeek}`);
  });
  
  // 统计日期范围
  const dates = detailedWorks.map(w => new Date(w.ctime));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  console.log('\n=== 日期范围统计 ===');
  console.log(`最早发布：${minDate.toISOString()}`);
  console.log(`最晚发布：${maxDate.toISOString()}`);
  console.log(`\n2 月 22-28 日期间的作品数：${detailedWorks.filter(w => {
    const d = new Date(w.ctime);
    return d >= new Date('2026-02-21T16:00:00Z') && d <= new Date('2026-02-28T15:59:59Z');
  }).length}`);
}

main();

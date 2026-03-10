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
  
  // 获取所有页面
  let allCollections = [];
  let pageIndex = 0;
  
  while (true) {
    const feedsRes = await client.get('/v1/space/collection/feed', {
      params: {
        hashtag_name: hashtagName,
        page_index: pageIndex,
        page_size: 20
      }
    });
    
    const items = feedsRes.data.collection_feed_item || [];
    console.log(`第 ${pageIndex + 1} 页：${items.length} 条`);
    allCollections = allCollections.concat(items);
    
    if (!feedsRes.data.trace_info?.has_next_page || items.length === 0) {
      break;
    }
    
    pageIndex++;
    if (pageIndex >= 10) {
      console.log('已达到最大页数限制');
      break;
    }
  }
  
  console.log(`\n共获取 ${allCollections.length} 条精选帖子`);
  console.log('正在获取每个作品的详细信息...\n');
  
  // 获取每个作品的详细信息
  const detailedWorks = [];
  for (let i = 0; i < allCollections.length; i++) {
    const item = allCollections[i];
    try {
      const detailRes = await client.get('/v1/collection/detail', {
        params: { uuid: item.uuid }
      });
      
      const detail = detailRes.data;
      detailedWorks.push({
        uuid: item.uuid,
        title: item.title,
        creator_name: detail.creator?.nick_name || detail.creator_name || '未知',
        creator_uuid: detail.creator?.uuid || detail.creator_uuid,
        likeCount: detail.like_count || item.same_style_count || 0,
        sameStyleCount: item.same_style_count || detail.same_style_count || 0,
        commentCount: detail.comment_count || 0,
        ctime: detail.ctime || new Date().toISOString(),
        cover_url: item.cover_url
      });
      
      console.log(`[${i + 1}/${allCollections.length}] 《${item.title}》by ${detail.creator?.nick_name || '未知'}`);
    } catch (error) {
      console.log(`[${i + 1}/${allCollections.length}] 《${item.title}》- 获取详情失败`);
      detailedWorks.push({
        uuid: item.uuid,
        title: item.title,
        creator_name: '未知',
        likeCount: item.same_style_count || 0,
        sameStyleCount: item.same_style_count || 0,
        commentCount: 0,
        ctime: new Date().toISOString()
      });
    }
  }
  
  // 筛选 2 月 22 日 -2 月 28 日 (UTC+8)
  const startDate = new Date('2026-02-21T16:00:00Z');
  const endDate = new Date('2026-02-28T15:59:59Z');
  
  const filteredWorks = detailedWorks.filter(work => {
    const workDate = new Date(work.ctime);
    return workDate >= startDate && workDate <= endDate;
  });
  
  console.log(`\n=== 筛选结果 ===`);
  console.log(`时间范围：2026-02-22 至 2026-02-28 (UTC+8)`);
  console.log(`符合条件的作品：${filteredWorks.length} 个\n`);
  
  // 按作者排序
  filteredWorks.sort((a, b) => {
    const nameA = (a.creator_name || '').toLowerCase();
    const nameB = (b.creator_name || '').toLowerCase();
    return nameA.localeCompare(nameB, 'zh-Hans-CN');
  });
  
  // 输出表格
  console.log('=== 作品列表（按作者排序）===\n');
  console.log('作者 | 作品名称 | 点赞数 | 捏同款数 | 评论数 | 发布时间');
  console.log('='.repeat(100));
  
  filteredWorks.forEach((work, index) => {
    const ctime = new Date(work.ctime);
    const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = utc8Time.toISOString().slice(0, 16).replace('T', ' ');
    
    console.log(`${work.creator_name} | 《${work.title}》 | ${work.likeCount} | ${work.sameStyleCount} | ${work.commentCount} | ${dateStr}`);
  });
  
  // 输出 JSON
  console.log('\n=== JSON 格式 ===\n');
  console.log(JSON.stringify(filteredWorks.map(work => {
    const ctime = new Date(work.ctime);
    const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
    return {
      author: work.creator_name,
      title: work.title,
      likes: work.likeCount,
      sameStyle: work.sameStyleCount,
      comments: work.commentCount,
      publishTime: utc8Time.toISOString().slice(0, 16).replace('T', ' ')
    };
  }), null, 2));
}

main();

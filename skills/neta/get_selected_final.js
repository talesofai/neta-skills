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
  
  // 第一步：获取 feed 列表
  const feedsRes = await client.get('/v1/space/collection/feed', {
    params: {
      hashtag_name: hashtagName,
      page_index: 0,
      page_size: 20
    }
  });
  
  const items = feedsRes.data.collection_feed_item || [];
  console.log(`获取到 ${items.length} 条精选作品\n`);
  
  // 去重（API 返回重复数据）
  const uniqueItems = [];
  const seenUuids = new Set();
  for (const item of items) {
    if (!seenUuids.has(item.uuid)) {
      seenUuids.add(item.uuid);
      uniqueItems.push(item);
    }
  }
  
  console.log(`去重后：${uniqueItems.length} 条唯一作品\n`);
  
  // 第二步：获取每个作品的详细信息
  const detailedWorks = [];
  for (let i = 0; i < uniqueItems.length; i++) {
    const item = uniqueItems[i];
    try {
      const detailRes = await client.get('/v1/home/feed/interactive', {
        params: {
          collection_uuid: item.uuid,
          page_index: 0,
          page_size: 1
        }
      });
      
      const module = detailRes.data.module_list?.[0];
      if (!module || module.template_id !== 'NORMAL') {
        console.log(`[${i + 1}/${uniqueItems.length}] 《${item.title}》- 无法获取详情`);
        continue;
      }
      
      const jsonData = module.json_data;
      detailedWorks.push({
        uuid: item.uuid,
        title: jsonData.name || item.title,
        creator_name: jsonData.creator?.nick_name || '未知',
        creator_uuid: jsonData.creator?.uuid,
        likeCount: jsonData.likeCount || 0,
        sameStyleCount: item.same_style_count || 0,
        commentCount: jsonData.commentCount || 0,
        ctime: jsonData.ctime,
        cover_url: item.cover_url
      });
      
      console.log(`[${i + 1}/${uniqueItems.length}] 《${item.title}》by ${jsonData.creator?.nick_name || '未知'}`);
    } catch (error) {
      console.log(`[${i + 1}/${uniqueItems.length}] 《${item.title}》- 获取详情失败`);
    }
  }
  
  // 第三步：筛选 2 月 22 日 -2 月 28 日 (UTC+8)
  // UTC+8 的 2 月 22 日 00:00 = UTC 的 2 月 21 日 16:00
  // UTC+8 的 2 月 28 日 23:59 = UTC 的 2 月 28 日 15:59
  const startDate = new Date('2026-02-21T16:00:00Z');
  const endDate = new Date('2026-02-28T15:59:59Z');
  
  const filteredWorks = detailedWorks.filter(work => {
    const workDate = new Date(work.ctime);
    return workDate >= startDate && workDate <= endDate;
  });
  
  console.log(`\n=== 筛选结果 ===`);
  console.log(`时间范围：2026-02-22 至 2026-02-28 (UTC+8)`);
  console.log(`符合条件的作品：${filteredWorks.length} 个\n`);
  
  // 第四步：按作者排序
  filteredWorks.sort((a, b) => {
    const nameA = (a.creator_name || '').toLowerCase();
    const nameB = (b.creator_name || '').toLowerCase();
    return nameA.localeCompare(nameB, 'zh-Hans-CN');
  });
  
  // 第五步：输出表格
  console.log('=== 作品列表（按作者排序）===\n');
  console.log('作者 | 作品名称 | 点赞数 | 捏同款数 | 评论数 | 发布时间 (UTC+8)');
  console.log('='.repeat(120));
  
  filteredWorks.forEach((work) => {
    const ctime = new Date(work.ctime);
    const utc8Time = new Date(ctime.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = utc8Time.toISOString().slice(0, 16).replace('T', ' ');
    
    console.log(`${work.creator_name} | 《${work.title}》 | ${work.likeCount} | ${work.sameStyleCount} | ${work.commentCount} | ${dateStr}`);
  });
  
  // 第六步：输出 JSON
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

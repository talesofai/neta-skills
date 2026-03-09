# 获取标签下的所有帖子列表，并批量标记为精选或过审 - 执行技能

**流程名称：** 获取标签下的所有帖子列表，并批量标记为精选或过审

**简称：** 标签帖子管理

**用途：** 获取标签下的所有帖子列表，并批量标记为精选或过审

**版本：** v1.0 (2026-03-09)

---

## ⚠️ 核心原则（强制）

**任何大规模任务、批量操作，都必须先确认再执行。**

**禁止行为：**
- ❌ 批量执行前不确认范围
- ❌ 替用户决定哪些帖子需要标记
- ❌ 不验证 API 响应就继续

---

## 一、API 端点

### 1. 获取标签帖子列表

**API:** `GET /v1/hashtag/{hashtag_name}/stories`

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page_index` | number | 0 | 页码（0 索引） |
| `page_size` | number | 20 | 每页数量（最大 100） |
| `sort_by` | string | "newest" | 排序方式：`newest`（最新）/ `hot`（最热） |

**响应数据结构：**
```json
{
  "total": 10000,
  "page_index": 0,
  "page_size": 20,
  "list": [
    {
      "id": 10189511,
      "storyId": "e05cd0dd-dbaa-465d-86d1-e0699266770d",
      "name": "帖子标题",
      "coverUrl": "https://...",
      "user_nick_name": "作者名",
      "likeCount": 4,
      "ctime": "2026-03-09 21:41:19"
    }
  ]
}
```

**关键字段：**
- `storyId` ← 帖子 UUID（用于标记操作）
- `name` ← 帖子标题
- `user_nick_name` ← 作者昵称

---

### 2. 标记帖子为过审

**API:** `POST /v1/hashtag/{hashtag_name}/stories/review/{story_uuid}`

**请求体：**
```json
{"action": "select"}
```

**响应：**
```json
{"message": "success"}
```

---

### 3. 标记帖子为精选

**API:** `POST /v1/hashtag/{hashtag_name}/stories/review/{story_uuid}`

**请求体：**
```json
{"result": "HIGHLIGHT", "item_type": "collection"}
```

**响应：**
```json
{"message": "success"}
```

---

## 二、命令使用

### 1. 获取帖子列表

```bash
pnpm start get_hashtag_stories --hashtag "社团狂欢节" --page_index 0 --page_size 20 --sort_by newest
```

**参数：**
- `--hashtag`: 标签名称（必填）
- `--page_index`: 页码，从 0 开始
- `--page_size`: 每页数量，默认 20
- `--sort_by`: 排序方式，`newest`（最新）或 `hot`（最热）

**输出示例：**
```json
{
  "total": 10000,
  "page_index": 0,
  "page_size": 20,
  "list": [
    {
      "uuid": "e05cd0dd-dbaa-465d-86d1-e0699266770d",
      "name": "诸天寰宇的无上帝尊",
      "creator_name": "神秘人",
      "coverUrl": "https://...",
      "likeCount": 4,
      "ctime": "2026-03-09 21:41:19"
    }
  ]
}
```

---

### 2. 标记为过审

```bash
pnpm start mark_selected --hashtag "社团狂欢节" --story_uuid "<帖子 UUID>"
```

---

### 3. 标记为精选

```bash
pnpm start mark_featured --hashtag "社团狂欢节" --story_uuid "<帖子 UUID>"
```

---

## 三、执行流程

### 场景 1：批量标记最新帖子为精选

```
1. 获取最新帖子列表
   pnpm start get_hashtag_stories --hashtag "社团狂欢节" --page_index 0 --page_size 20 --sort_by newest
   ↓
2. 提取帖子 UUID 列表
   ↓
3. 确认范围和数量（必须！）
   "找到 20 个帖子，是否全部标记为精选？"
   ↓
4. 用户确认后批量执行
   for uuid in UUID_LIST:
     pnpm start mark_featured --hashtag "社团狂欢节" --story_uuid "$uuid"
   ↓
5. 报告执行结果
   "20/20 成功"
```

---

### 场景 2：标记特定帖子

```
1. 用户提供帖子链接或 UUID
   ↓
2. 直接调用 mark_featured 或 mark_selected
   ↓
3. 验证响应
   ↓
4. 报告结果
```

---

## 四、常见问题

### Q1: API 返回成功但网页没变化？

**A:** 需要强制刷新网页（Ctrl+Shift+R），API 同步有延迟。

---

### Q2: 帖子标题和网页显示不一致？

**A:** API 返回的标题 emoji 可能和网页显示不同，这是两个不同的帖子。需要通过 UUID 精确匹配。

---

### Q3: 获取到的帖子没有 UUID？

**A:** 检查 API 响应中的 `storyId` 字段，这是正确的 UUID 字段。

---

### Q4: 排序方式不对？

**A:** 
- `sort_by=newest` → 按发布时间倒序（最新在前）
- `sort_by=hot` → 按热度排序

---

## 五、文件位置

| 文件 | 路径 |
|------|------|
| **API 函数** | `/home/node/.openclaw/workspace/skills/neta/src/apis/hashtag.ts` |
| **获取帖子命令** | `/home/node/.openclaw/workspace/skills/neta/src/commands/community/get_hashtag_stories.cmd.ts` |
| **标记过审命令** | `/home/node/.openclaw/workspace/skills/neta/src/commands/community/mark_selected.cmd.ts` |
| **标记精选命令** | `/home/node/.openclaw/workspace/skills/neta/src/commands/community/mark_featured.cmd.ts` |

---

## 六、注意事项

1. **批量操作前必须确认** - 告诉用户要标记多少个帖子，等待确认
2. **验证 API 响应** - 每次调用后检查 `{"message":"success"}`
3. **网页刷新** - 标记后需要强制刷新才能看到变化
4. **UUID 字段** - 使用 `storyId` 而不是 `uuid` 或 `id`
5. **API 限制** - 每页最多 100 个帖子，总数最多 10000 个

---

## 七、更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-03-09 | 初始版本，包含获取帖子列表和批量标记功能 |

---

**技能文档完成！** 🦞

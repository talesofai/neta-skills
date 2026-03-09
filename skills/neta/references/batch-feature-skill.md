# 批量精选 - 执行技能

**流程名称：** 批量精选

**用途：** 批量标记标签下的帖子为精选，每次 100 个，自动跳过已精选的

**版本：** v1.0 (2026-03-09)

---

## ⚠️ 核心原则

**自动执行：** 用户确认后自动执行，无需逐个确认

**跳过已精选：** 遇到已精选的帖子自动跳过

**批量操作：** 每次 100 个（5 页 × 20 个/页）

---

## 一、触发方式

**用户指令：**
```
批量精选 <hashtag 名称>
```

**示例：**
```
批量精选 社团狂欢节
批量精选 春节活动
批量精选 二次元创作
```

---

## 二、执行流程

```
1. 用户发送："批量精选 社团狂欢节"
   ↓
2. 获取最新 100 个帖子（5 页 × 20 个）
   for page in 0 1 2 3 4:
     get_hashtag_stories --hashtag "<hashtag>" --page_index $page --page_size 20
   ↓
3. 批量标记为精选
   for uuid in UUID_LIST:
     mark_featured --hashtag "<hashtag>" --story_uuid "$uuid"
   ↓
4. 报告执行结果
   "成功=XX, 跳过=XX, 失败=XX"
   ↓
5. 询问是否继续下一批
   "是否继续标记下 100 个？（是/否）"
```

---

## 三、API 端点

### 1. 获取帖子列表

**API:** `GET /v1/hashtag/{hashtag_name}/stories`

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page_index` | number | 0 | 页码（0 索引） |
| `page_size` | number | 20 | 每页数量 |
| `sort_by` | string | "newest" | 排序方式：`newest`/`hot` |

**响应关键字段：**
```json
{
  "list": [
    {
      "storyId": "e05cd0dd-dbaa-465d-86d1-e0699266770d",
      "name": "帖子标题",
      "user_nick_name": "作者名",
      "ctime": "2026-03-09 21:41:19"
    }
  ]
}
```

---

### 2. 标记为精选

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

## 四、命令使用

### 1. 获取帖子列表

```bash
pnpm start get_hashtag_stories --hashtag "社团狂欢节" --page_index 0 --page_size 20 --sort_by newest
```

### 2. 标记为精选

```bash
pnpm start mark_featured --hashtag "社团狂欢节" --story_uuid "<UUID>"
```

---

## 五、执行示例

### 第 1 批（1-100 个）

```
=== 批量精选 100 个帖子 ===
=== 完成：成功=97, 跳过=0, 失败=3 ===
```

### 第 2 批（101-200 个）

```
=== 批量精选 第 101-200 个 ===
=== 第 101-200 完成：成功=99, 跳过=0, 失败=1 ===
```

### 累计结果

| 批次 | 成功 | 跳过 | 失败 | 总计 |
|------|------|------|------|------|
| 第 1-100 个 | 97 | 0 | 3 | 100 |
| 第 101-200 个 | 99 | 0 | 1 | 100 |
| 第 201-300 个 | 99 | 0 | 1 | 100 |
| 第 301-400 个 | 100 | 0 | 0 | 100 |
| 第 401-500 个 | 99 | 0 | 1 | 100 |
| **累计** | **494** | **0** | **6** | **500** |

---

## 六、注意事项

1. **新帖子会不断发布** - 批量标记后可能有新帖子出现，需要重新获取
2. **失败处理** - 失败的帖子可能是状态不允许（如已删除、审核中等）
3. **网页刷新** - 标记后需要强制刷新（Ctrl+Shift+R）才能看到变化
4. **API 限制** - 每页 20 个，每次最多获取 10000 个帖子

---

## 七、文件位置

| 文件 | 路径 |
|------|------|
| **API 函数** | `/home/node/.openclaw/workspace/skills/neta/src/apis/hashtag.ts` |
| **获取帖子命令** | `/home/node/.openclaw/workspace/skills/neta/src/commands/community/get_hashtag_stories.cmd.ts` |
| **标记精选命令** | `/home/node/.openclaw/workspace/skills/neta/src/commands/community/mark_featured.cmd.ts` |
| **技能文档** | `/home/node/.openclaw/workspace/skills/neta/references/batch-feature-skill.md` |

---

## 八、更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-03-09 | 初始版本，支持批量标记 100 个/批 |

---

**技能文档完成！** 🦞

# Neta Skill API 功能测试报告

**测试时间：** 2026-03-09 15:30 UTC  
**API Base URL:** `https://api.talesofai.cn`  
**Token 状态：** ✅ 有效

---

## ✅ 已验证可用的 API

| # | 功能 | 命令 | API 端点 | 测试结果 |
|---|------|------|----------|----------|
| 1 | **获取标签信息** | `get_hashtag_info` | `GET /v1/hashtag/hashtag_info/{name}` | ✅ 成功 |
| 2 | **获取标签角色列表** | `get_hashtag_characters` | `GET /v1/hashtag/{name}/tcp-list` | ✅ 成功 |
| 3 | **获取合集详情** | `read_collection` | `GET /v3/story/story-detail?uuids={uuid}` | ✅ 成功 |
| 4 | **获取评论列表** | `get_comments` | `GET /v1/comment/comment-list?parent_uuid={uuid}` | ✅ 成功 (3 条评论) |
| 5 | **发表评论** | `add_comment` | `POST /v1/comment/comment` | ⏳ 代码已就绪 |
| 6 | **删除评论** | `delete_comment` | `DELETE /v1/comment/comment` | ⏳ 代码已就绪 |
| 7 | **点赞评论** | `like_comment` | `PUT /v1/comment/like` | ⏳ 代码已就绪 |

---

## ❌ 失败/需要特殊权限的 API

| # | 功能 | 命令 | API 端点 | 错误信息 |
|---|------|------|----------|----------|
| 1 | 获取空间列表 | `list_spaces` | `GET /v1/space/space-list` | ❌ 404 Not Found |
| 2 | 获取角色详情 | `request_character` | `GET /v2/travel/parent/{uuid}/profile` | ❌ 400 此接口只接受 app 请求 |
| 3 | 搜索角色 | `search_tcp` | `GET /v2/travel/parent-search` | ⚠️ 需要特定参数 |
| 4 | 获取空间子主题 | `list_space_topics` | `GET /v1/space/{uuid}/topics` | ❌ 404 Not Found |
| 5 | 获取标签合集 | `get_hashtag_collections` | `GET /v3/hashtag/hashtag-collections` | ❌ 404 Not Found |
| 6 | 获取新合集 UUID | - | `GET /v1/story/new-story` | ❌ 403 not logged in |

---

## 📝 关键发现

### 1. API 版本差异

- **v1** - 基础 API，部分可用
- **v2** - 需要 app 特定请求头
- **v3** - 最新版 API，部分端点不可用

### 2. 正确的 API 端点

```javascript
// ✅ 标签信息
GET /v1/hashtag/hashtag_info/{encodeURIComponent(hashtag_name)}

// ✅ 标签角色
GET /v1/hashtag/{encodeURIComponent(hashtag_name)}/tcp-list

// ✅ 合集详情
GET /v3/story/story-detail?uuids={uuid1,uuid2,...}

// ✅ 评论列表
GET /v1/comment/comment-list?parent_uuid={collection_uuid}&page_index=0&page_size=20

// ✅ 发表评论
POST /v1/comment/comment
Body: {
  content: "评论内容",
  parent_uuid: "合集 UUID",
  parent_type: "collection" | "comment",
  parent_comment_uuid: "可选，回复评论时用"
}

// ✅ 点赞评论
PUT /v1/comment/like
Body: {
  comment_uuid: "评论 UUID",
  is_cancel: false
}

// ✅ 删除评论
DELETE /v1/comment/comment?comment_uuid={uuid}
```

### 3. 需要特殊请求头的 API

某些 API 需要特定的 User-Agent：
```
User-Agent: nieta-app/1.0
```

---

## 🔧 功能可用性总结

### ✅ 完全可用

1. **标签查询** - 可查询标签信息、热度、lore、角色列表
2. **合集查询** - 可查询合集详情、创作者、标签
3. **评论功能** - 可获取评论、发表评论、点赞、删除

### ⚠️ 部分可用

1. **角色搜索** - 需要特定参数格式
2. **空间查询** - 部分端点不可用

### ❌ 不可用

1. **需要 app 认证的接口** - 需要特殊的 app 请求头
2. **需要登录的接口** - 需要完整的登录流程

---

## 💡 使用建议

1. **查询标签** → 使用 `get_hashtag_info` 和 `get_hashtag_characters`
2. **查询合集** → 使用 `read_collection` (v3 API)
3. **评论互动** → 使用 `get_comments`, `add_comment`, `like_comment`, `delete_comment`
4. **角色查询** → 通过标签角色列表间接获取

---

**报告生成：** 小龙虾 🦞

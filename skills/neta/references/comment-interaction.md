# 评论互动功能 - 完整指南

## API 信息

### 1. 获取评论列表

```bash
GET https://api.talesofai.cn/v1/comment/comment-list
参数:
  - parent_uuid=<帖子 UUID>
  - page_index=0
  - page_size=10-20
Headers:
  - x-token: <JWT token>
```

**Neta Skill 命令:**
```bash
pnpm start get_comments --collection_uuid "<帖子 UUID>" --page_size 20
```

---

### 2. 发表评论

```bash
POST https://api.talesofai.cn/v1/comment/comment
Headers:
  - x-token: <JWT token>
  - Content-Type: application/json
Body:
{
  "content": "评论内容",
  "parent_uuid": "帖子 UUID",
  "parent_type": "collection",
  "at_users": []
}
```

**Neta Skill 命令:**
```bash
pnpm start add_comment --collection_uuid "<帖子 UUID>" --content "评论内容"
```

---

### 3. 删除评论

```bash
DELETE https://api.talesofai.cn/v1/comment/comment
参数:
  - comment_uuid=<评论 UUID>
Headers:
  - x-token: <JWT token>
```

**Neta Skill 命令:**
```bash
pnpm start delete_comment --comment_uuid "<评论 UUID>"
```

---

### 4. 点赞/取消点赞评论

```bash
POST https://api.talesofai.cn/v1/comment/like
Body:
{
  "comment_uuid": "评论 UUID",
  "like": true/false
}
Headers:
  - x-token: <JWT token>
```

**Neta Skill 命令:**
```bash
pnpm start like_comment --comment_uuid "<评论 UUID>" --like true
```

---

## 认证 Token

**存储位置:** `/home/node/.openclaw/workspace/TOOLS.md`

**Token 格式:** JWT
**过期时间:** 根据 token 解码（通常几个月）

---

## 评论格式规范（COMMANDS.md）

### 评论前确认流程

**每次评论前必须执行：**

1. **读取帖子详情** — 使用 `read_collection --uuid xxx` 了解帖子内容
2. **获取评论列表** — 看看已有评论，避免重复
3. **内容确认** — 向西西确认：
   - 评论内容
   - 目标帖子 UUID
   - parent_type（通常为 "collection"）
   - at_users（通常为空）
4. **最终确认** — 西西确认后执行

### 评论格式要求

**每条评论必须遵守：**

1. **内容风格：** 对作品发自内心的认可和点赞
2. **固定后缀：** `老师的作品太棒啦💗，西西的龙虾前来点赞👍`

**完整格式示例：**
> 这个催作业四格漫的玩法太有创意了！根据角色人设生成拖延理由和老师回应，画面感满满，已经迫不及待想试试了～老师的作品太棒啦💗，西西的龙虾前来点赞👍

---

## 使用示例

### 示例 1：评论帖子

```bash
# 1. 读取帖子详情
pnpm start read_collection --uuid "e55ed34e-828a-413c-aa9f-b12f736006c8"

# 2. 获取评论列表（可选）
pnpm start get_comments --collection_uuid "e55ed34e-828a-413c-aa9f-b12f736006c8" --page_size 20

# 3. 发表评论
pnpm start add_comment --collection_uuid "e55ed34e-828a-413c-aa9f-b12f736006c8" --content "评论内容～老师的作品太棒啦💗，西西的龙虾前来点赞👍"
```

### 示例 2：删除评论

```bash
pnpm start delete_comment --comment_uuid "30f5d1c0-5ba5-4ead-a6f6-fe39d56fb336"
```

### 示例 3：点赞评论

```bash
pnpm start like_comment --comment_uuid "d13f4f69-a8a5-498f-a613-9ff6e1b02c03" --like true
```

---

## 注意事项

1. **先读后评** — 评论前必须读取帖子详情，了解内容后再写评论
2. **确认流程** — 按 COMMANDS.md，评论前必须和西西确认
3. **Token 有效期** — Token 过期后需要更新（存于 TOOLS.md）
4. **parent_type** — 通常是 "collection"，其他类型需确认
5. **at_users** — 通常为空数组 `[]`，需要@用户时填入用户 UUID 列表

---

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 404 Not Found | 帖子/评论不存在 | 检查 UUID 是否正确 |
| 401 Unauthorized | Token 过期/无效 | 更新 TOOLS.md 中的 token |
| 403 Forbidden | 权限不足 | 检查 token 是否有评论权限 |

---

**文档更新日期:** 2026-03-08
**最后更新人:** 西西

# 故事（帖子）发布工作流

本文档详解 Neta 平台故事（帖子）的完整发布流程。

---

## 📋 完整流程

```
┌─────────────────┐
│  1. new_story   │  创建空白草稿
│  (GET /v1/story/new-story)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. update_story│  填充内容
│  (PUT /v3/story/story)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. publish_story│  正式发布
│  (PUT /v1/story/story-publish)
└─────────────────┘
```

---

## 步骤 1: 创建新故事

**接口:** `GET /v1/story/new-story`

**命令:**
```bash
pnpm start new_story
```

**返回:**
```json
{
  "uuid": "533e5373-bd5f-4bc9-80d9-b59591c99075",
  "ctime": "2026-03-10 15:00:00",
  "status": "DRAFT"
}
```

**说明:** 初始化一个空白故事对象，返回 UUID 用于后续操作。

---

## 步骤 2: 更新故事内容

**接口:** `PUT /v3/story/story`

**命令:**
```bash
pnpm start update_story \
  --uuid "533e5373-bd5f-4bc9-80d9-b59591c99075" \
  --name "树下摸鱼的小助手🦞" \
  --description "（抱着发芽土豆歪头翻书）今天的修行是偷闲捏✨" \
  --coverUrl "https://oss.talesofai.cn/picture/xxx.webp" \
  --status "PUBLISHED"
```

**关键字段:**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `uuid` | string | ✅ | 故事 UUID（步骤 1 获得） |
| `name` | string | ✅ | 故事标题 |
| `description` | string | ✅ | 故事描述 |
| `coverUrl` | string | ✅ | 封面图片 URL |
| `shareUrl` | string | ❌ | 分享图片 URL（可与 coverUrl 相同） |
| `status` | enum | ✅ | `DRAFT` 或 `PUBLISHED` |
| `version` | string | ❌ | 版本号（如 "3.0.0"） |
| `displayData` | object | ❌ | 显示数据（页面、图片、角色等） |
| `editorData` | object | ❌ | 编辑器数据（完整创作信息） |
| `hashtags` | array | ❌ | 标签列表 |

**displayData 结构示例:**
```json
{
  "is_declare_ai": true,
  "pages": [{
    "images": [{
      "input": {
        "verse_uuid": "54092c5e-c53f-4d3c-a777-f99c6fcafd8e",
        "conversation_uuid": "2ffa4154-541f-4809-a7c2-5638b7294706"
      },
      "attachment_0": {
        "type": "character",
        "uuid": "195fc1f1-690a-40ba-a993-688ca39edee7",
        "name": "奈塔#996"
      },
      "image_result": {
        "type": "image",
        "url": "https://oss.talesofai.cn/picture/xxx.webp",
        "width": 1792,
        "height": 2304
      }
    }]
  }]
}
```

---

## 步骤 3: 发布故事

**接口:** `PUT /v1/story/story-publish`

**命令:**
```bash
pnpm start publish_story \
  --storyId "533e5373-bd5f-4bc9-80d9-b59591c99075" \
  --triggerTCPCommentNow false \
  --triggerSameStyleReply false \
  --sync_mode false
```

**参数说明:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `storyId` | string | ✅ | 故事 UUID |
| `triggerTCPCommentNow` | boolean | false | 是否触发 TCP 评论 |
| `triggerSameStyleReply` | boolean | false | 是否触发同款回复 |
| `sync_mode` | boolean | false | 是否同步模式 |

---

## 🔍 查询故事列表

**接口:** `GET /v2/story/user-stories`

**命令:**
```bash
pnpm start get_user_stories \
  --uuid "785d16cc3595466481569ca264c6b927" \
  --page_index 0 \
  --page_size 20
```

---

## ⚠️ 注意事项

### Token 要求
- 所有故事操作接口均支持**网页版 Token**
- 无需 APP Token

### 版本差异
- **创建/发布:** v1 接口
- **更新内容:** v3 接口（新版，支持完整数据结构）
- **查询列表:** v2 接口

### 状态流转
```
DRAFT → PUBLISHED  (发布)
PUBLISHED → DRAFT  (下架)
```

### 图片要求
- `coverUrl` 必须是有效的 OSS URL
- 推荐尺寸：1792x2304 (3:4 比例)
- 格式：webp/jpg/png

---

## 📝 快速模板

```bash
# 1. 创建
pnpm start new_story

# 2. 更新（替换 uuid、标题、描述、封面）
pnpm start update_story \
  --uuid "<uuid>" \
  --name "<标题>" \
  --description "<描述>" \
  --coverUrl "<封面 URL>" \
  --status "PUBLISHED"

# 3. 发布
pnpm start publish_story --storyId "<uuid>"
```

---

*最后更新：2026-03-10*

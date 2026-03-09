# Neta Skills 更新日志

## 2026-03-09 - 新增用户相关 API

### 新增 API 接口

#### 1. `/v2/story/user-stories` - 获取用户帖子列表
**文件:** `src/apis/user.ts`
**命令:** `get_user_stories`

**用途:** 获取用户发布的所有帖子/故事列表

**参数:**
- `uuid` (必填): 用户 UUID
- `page_index` (可选): 页码，从 0 开始，默认 0
- `page_size` (可选): 每页数量，默认 20，最大 100

**返回:**
```json
{
  "total": 999999,
  "page_index": 0,
  "page_size": 20,
  "list": [
    {
      "id": 6542640,
      "storyId": "0aac0ef2-77da-4205-85ef-1440ba0b0fef",
      "name": "🌟锵锵！这里是合集",
      "coverUrl": "...",
      "status": "PUBLISHED",
      "likeCount": 2249,
      "commentCount": 0,
      "sharedCount": 0,
      "sameStyleCount": 59,
      "ctime": "2025-05-14 05:47:09",
      "is_pinned": true,
      "hashtag_names": []
    }
  ]
}
```

**使用示例:**
```bash
pnpm start get_user_stories --uuid "785d16cc3595466481569ca264c6b927" --page_index 0 --page_size 20
```

---

#### 2. `/v2/user/ap_info` - 获取用户电量信息
**文件:** `src/apis/user.ts`
**命令:** `get_ap_info`

**用途:** 获取用户的 AP（Action Point）电量详情

**返回:**
```json
{
  "ap": 113503,
  "temp_ap": 0,
  "ap_limit": 1600,
  "unlimited_until": null,
  "true_unlimited_until": null
}
```

**使用示例:**
```bash
pnpm start get_ap_info
```

---

#### 3. `/v1/manuscript/list` - 获取草稿列表
**文件:** `src/apis/user.ts`
**命令:** `get_manuscript_list`

**用途:** 获取用户的草稿/未完成作品列表

**参数:**
- `page_index` (可选): 页码，从 0 开始，默认 0
- `page_size` (可选): 每页数量，默认 24，最大 100

**返回:**
```json
{
  "total": 9999,
  "page_index": 0,
  "page_size": 24,
  "has_next": null,
  "list": [
    {
      "uuid": "...",
      "name": "...",
      "cover_url": "...",
      "status": "NORMAL",
      "ctime": "...",
      "mtime": "..."
    }
  ]
}
```

**使用示例:**
```bash
pnpm start get_manuscript_list --page_index 0 --page_size 24
```

---

#### 4. `/v1/checkin/status` - 获取签到状态
**文件:** `src/apis/user.ts`
**命令:** `get_checkin_status`

**用途:** 获取用户的每日签到状态

**返回:**
```json
{
  "today_signed": false,
  "streak_count": 4,
  "cycle_day": 15,
  "cycle_signed_history": [true, true, false, ...],
  "reward_list": [...]
}
```

**使用示例:**
```bash
pnpm start get_checkin_status
```

---

#### 5. `/v1/message/message-count` - 获取消息数量
**文件:** `src/apis/user.ts`
**命令:** `get_message_count`

**用途:** 获取用户各类消息的未读数量

**返回:**
```json
{
  "data": [
    {"section_enum": "SEC_PUBLIC", "unread_count": 6},
    {"section_enum": "SEC_LIKE", "unread_count": 7},
    {"section_enum": "SEC_SUBSCRIBE", "unread_count": 0},
    {"section_enum": "SEC_INTERACTS", "unread_count": 6}
  ]
}
```

**使用示例:**
```bash
pnpm start get_message_count
```

---

#### 6. `/v2/oc/list-worlds` - 获取 OC 世界列表
**文件:** `src/apis/user.ts`
**命令:** `get_oc_worlds`

**用途:** 获取用户创建的原创角色（OC）世界列表

**返回:**
```json
[
  {
    "uuid": "...",
    "name": "自由",
    "description": "...",
    "cover_url": "...",
    "character_count": 0,
    "ctime": "..."
  }
]
```

**使用示例:**
```bash
pnpm start get_oc_worlds
```

---

### 文件变更

#### 新增文件
- `src/commands/creative/get_user_stories.cmd.ts`
- `src/commands/creative/get_manuscript_list.cmd.ts`
- `src/commands/creative/get_checkin_status.cmd.ts`
- `src/commands/creative/get_message_count.cmd.ts`
- `src/commands/creative/get_ap_info.cmd.ts`
- `src/commands/creative/get_oc_worlds.cmd.ts`

#### 修改文件
- `src/apis/user.ts` - 新增 API 接口和类型定义
- `src/commands/schema.ts` - 新增 Schema 定义
- `src/commands/schema.zh_cn.yml` - 新增中文描述
- `SKILL.md` - 新增使用文档

---

### 使用场景

1. **查看我的帖子** - 使用 `get_user_stories` 获取自己发布的所有帖子
2. **检查电量** - 使用 `get_ap_info` 查看剩余 AP 电量
3. **管理草稿** - 使用 `get_manuscript_list` 查看未发布的草稿
4. **每日签到** - 使用 `get_checkin_status` 检查是否已签到
5. **查看消息** - 使用 `get_message_count` 查看未读消息数量
6. **管理 OC** - 使用 `get_oc_worlds` 查看创建的 OC 世界

---

### 测试状态

✅ 所有 API 均已测试通过
✅ 类型定义完整
✅ 文档已更新

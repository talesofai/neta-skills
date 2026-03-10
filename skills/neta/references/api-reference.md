# Neta API 参考文档

本文档记录所有已分析的 Neta API 接口（共 21+ 个）。

---

## 📋 API 分类总览

| 类型 | 数量 | 代表接口 |
|------|------|----------|
| 配置类 | 9 | `/v1/configs/config` (×9) |
| 故事/内容 | 4 | `new-story`, `story/story`, `story-publish`, `user-stories` |
| 任务系统 | 3 | `assignment-list`, `task-pool`, `complete-assignment` |
| 用户数据 | 3 | `ap_info`, `full-prompt-tags`, `feed/interactive` |
| 互动类 | 1 | `char_roll` |
| 权限类 | 1 | `has-permission` |

---

## 1️⃣ 配置类接口（9 个）

| 接口 | 命名空间 | 配置键 | 功能 | 命令 |
|------|----------|--------|------|------|
| `/v1/app/loads` | — | — | 应用启动全局配置（AB 测试、功能开关） | — |
| `/v1/configs/config` | `verse` | `generate_verse` | 诗词生成模块配置 | `get_config` |
| `/v1/configs/config` | `litellm` | `chat_presets` | AI 聊天预设（模型、角色） | `get_config` |
| `/v1/configs/config` | `litellm` | `bridge_say_hi` | AI 桥接打招呼文案 | `get_config` |
| `/v1/configs/config` | `frontend/travel` | `share-copy` | 游览功能分享文案 | `get_config` |
| `/v1/configs/config` | `frontend/v2/generate` | `MAKE_COUNT` | 生成次数限制配置 | `get_config` |
| `/v1/configs/config` | `frontend/generate` | `lightning_per_day` | 每日闪电次数配置 | `get_config` |
| `/v1/configs/config` | `generation_tips` | `generation_tips` | 生成功能使用提示 | `get_config` |
| `/v1/prompt/full-prompt-tags` | — | — | 完整提示词标签库 | `get_full_prompt_tags` |

**特点：** 统一端点 `/v1/configs/config`，通过 `namespace` + `key` 区分

---

## 2️⃣ 故事/内容接口（4 个）

| 接口 | 方法 | 版本 | 功能 | 命令 |
|------|------|------|------|------|
| `/v1/story/new-story` | GET | v1 | 创建新故事（初始化空白草稿） | `new_story` |
| `/v3/story/story` | PUT | v3 | 更新故事完整数据（编辑保存） | `update_story` |
| `/v1/story/story-publish` | PUT | v1 | 发布故事（设置发布状态） | `publish_story` |
| `/v2/story/user-stories` | GET | v2 | 获取用户故事列表 | `get_user_stories` |

### 故事工作流

```
1. new-story → 获取 uuid
2. update_story (PUT) → 填充内容
3. publish_story (PUT) → 正式发布
```

---

## 3️⃣ 任务系统接口（3 个）

| 接口 | 方法 | 版本 | 功能 | 命令 |
|------|------|------|------|------|
| `/v1/assignment/assignment-list` | GET | v1 | 获取用户任务列表 | `get_assignment_list` |
| `/v3/task-pool` | GET | v3 | 获取任务池（可用任务） | `get_task_pool` |
| `/v1/assignment/complete-assignment-action` | PUT | v1 | 完成任务（提交状态） | `complete_assignment` |

---

## 4️⃣ 用户数据接口（3 个）

| 接口 | 版本 | 功能 | 命令 |
|------|------|------|------|
| `/v2/user/ap_info` | v2 | 获取用户 AP 电量信息（余额、上限） | `get_ap_info` |
| `/v1/home/feed/interactive` | v1 | 首页推荐 Feed 流（个性化内容） | `get_feed` |
| `/v1/collection-interactive/char_roll` | v1 | 角色抽奖（Gacha 机制） | `char_roll` |

---

## 5️⃣ 权限/风控接口（1 个）

| 接口 | 功能 |
|------|------|
| `/v1/exposure/has-permission` | 检查曝光权限（广告/推荐展示权限） |

---

## 6️⃣ 生成/创作接口

| 接口 | 版本 | 功能 | 命令 | 状态 |
|------|------|------|------|------|
| `/v3/make_image` | v3 | 生成图片 | `make_image_nietu`, `make_image_nienie` | ⚠️ 文生图需 APP token |
| `/v1/make_video` | v1 | 生成视频 | `make_video` | ✅ 可用 |
| `/v1/make_song` | v1 | 生成歌曲 | `make_song` | ✅ 可用 |

---

## 🏗️ API 版本演进

| 版本 | 接口示例 | 说明 |
|------|----------|------|
| v1 | `/v1/configs/config` | 基础版本（配置类为主） |
| v2 | `/v2/user/ap_info`, `/v2/story/user-stories` | 用户数据/故事查询 |
| v3 | `/v3/story/story`, `/v3/task-pool`, `/v3/make_image` | 核心创作功能（新版） |

---

## 📝 请求头规范（所有接口通用）

```http
x-token: <用户 Token>
x-platform: nieta-app/web
x-nieta-app-version: 6.8.9
device-id: <设备 ID>
x-abtest: <AB 测试分组>
```

---

## 🎯 核心业务流

### 发帖流程
```
/v1/story/new-story 
  → /v3/story/story (PUT 内容) 
  → /v1/story/story-publish (PUT 状态)
```

### 任务流程
```
/v1/assignment/assignment-list 
  → /v3/task-pool 
  → /v1/assignment/complete-assignment-action (PUT)
```

### 配置读取
```
/v1/app/loads (启动) 
  → /v1/configs/config (按需读取)
```

---

## ⚠️ Token 类型差异

| 接口类型 | 网页版 Token | APP Token |
|----------|-------------|-----------|
| 配置查询 | ✅ 可用 | ✅ 可用 |
| 故事管理 | ✅ 可用 | ✅ 可用 |
| 任务系统 | ✅ 可用 | ✅ 可用 |
| 文生图 | ❌ 受限 | ✅ 可用 |
| 收藏夹 | ❌ 受限 | ✅ 可用 |
| 角色详情 | ❌ 受限 | ✅ 可用 |

**当前 Token:** 网页版 (`nieta-app/web`)
**过期时间:** 2027-03-04

---

## 📊 接口分布图

```
配置中心 (9) ─────┬───── 启动配置
                  ├───── 功能配置 (verse/litellm/frontend)
                  └───── 配额限制 (MAKE_COUNT/lightning)

故事系统 (4) ─────┬───── 创建 (new-story)
                  ├───── 编辑 (story/story v3)
                  ├───── 发布 (story-publish)
                  └───── 查询 (user-stories v2)

任务系统 (3) ─────┬───── 列表 (assignment-list)
                  ├───── 池子 (task-pool v3)
                  └───── 完成 (complete-assignment)

用户数据 (3) ─────┬───── 电量 (ap_info v2)
                  ├───── Feed 流 (home/feed)
                  └───── 抽奖 (char_roll)

其他 (2) ─────────┬───── 权限 (has-permission)
                  └───── 生图 (make_image v3)
```

---

*最后更新：2026-03-10*

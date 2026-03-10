---
name: neta
description: Neta API 交互技能 - 游览空间、生成图片、视频、歌曲，搜索角色/元素，管理标签内容。当需要创作 AI 内容、查询角色信息、获取标签数据时使用此技能。
---

# Neta Skill

用于与 Neta API 交互，支持多媒体内容创作和角色/标签查询。

**最后更新：** 2026-03-10  
**命令总数：** 46 个 (创意类 33 个 + 社区类 13 个)

## 前置条件

确保已设置环境变量 `NETA_TOKEN`。

确保已安装依赖：
```bash
corepack enabled
pnpm i
```

## 调用方式

```bash
pnpm start <command> [options]
```

---

## 📊 API 状态说明

| 状态 | 说明 |
|------|------|
| ✅ 可用 | 当前 token 可正常调用 |
| ⚠️ 需 APP token | 接口返回"此接口只接受 app 请求" |

**Token 类型：** 网页版 (`nieta-app/web`)

**受限制的接口：**
- `get_favor_list` - 收藏夹列表
- `request_character_or_elementum` - 直接查询角色详情
- `make_image` - 文生图（图生图可用）

---

## 🎨 创意类命令 (32 个)

### 🖼️ 内容创作 (7 个)

**生成图片（捏图模型 - 快速）**
```bash
pnpm start make_image_nietu --prompt "@角色名，/风格元素，描述词" --aspect "3:4"
```

**生成图片（捏捏模型 - 高质量）**

> ⚠️ **重要：** 当用户说"捏捏作图"/"捏捏生图"/"使用捏捏作图"时，指的就是这个 API。

```bash
pnpm start make_image_nienie --prompt "@角色名，/风格元素，描述词" --aspect "3:4"
```

#### 生图模型对比

| 模型 | 命令 | entrance | context_model_series | 生成时间 | 适用场景 |
|------|------|----------|---------------------|----------|----------|
| **捏图** | `make_image_nietu` | `PICTURE,PURE` | `null` | ~8 秒 | 快速测试、单图生成 |
| **捏捏** | `make_image_nienie` | `PICTURE,VERSE` | `8_image_edit` | ~50 秒 | 复杂场景、高质量输出 |

**选择建议：**
- 需要快速预览 → 用**捏图**
- 正式发帖、复杂场景 → 用**捏捏**

📖 [详细指南](./references/image-generation.md) - 提示词结构、宽高比选择、用例  
📖 [API 端点](./references/捏捏-API-端点.md) - 完整 API 调用细节

**生成视频**
```bash
pnpm start make_video --image_source "图片 URL" --prompt "动作描述" --model "model_s"
```
📖 [详细指南](./references/video-generation.md) - 动作描述原则、模型选择

**生成歌曲**
```bash
pnpm start make_song --prompt "风格描述" --lyrics "歌词内容"
```
📖 [详细指南](./references/song-creation.md) - 风格提示词、歌词格式

**制作 MV** - 结合歌曲和视频生成完整 MV。📖 [详细指南](./references/song-mv.md)

**移除背景**
```bash
pnpm start remove_background --input_image "image_url"
```

**发布合集**
```bash
pnpm start publish_collection --uuid "合集 uuid" --triggerTCPCommentNow false --triggerSameStyleReply false
```

---

### 📖 故事管理 (4 个)

**创建新故事**
```bash
pnpm start new_story
```
返回初始故事 UUID，用于后续编辑和发布。

**更新故事内容**
```bash
pnpm start update_story \
  --uuid "故事 uuid" \
  --name "故事标题" \
  --description "故事描述" \
  --coverUrl "封面图片 URL" \
  --status "PUBLISHED"
```

**发布故事**
```bash
pnpm start publish_story \
  --storyId "故事 uuid" \
  --triggerTCPCommentNow false \
  --triggerSameStyleReply false
```

**删除故事** ⚠️
```bash
pnpm start delete_story --uuid "故事 uuid"
```
> ⚠️ **删除后不可恢复**，删除前请确认！

📖 [故事工作流](./references/story-workflow.md) - 完整发帖流程

---

### ⚡ 任务系统 (3 个)

**获取任务列表**
```bash
pnpm start get_assignment_list
```

**获取任务池**
```bash
pnpm start get_task_pool
```

**完成任务**
```bash
pnpm start complete_assignment --uuid "任务 uuid"
```

---

### 👤 用户信息 (11 个)

**获取用户详情** ⭐
```bash
pnpm start get_user_info --uuid "用户 uuid"
```
通过用户 UUID 获取详细信息：昵称、手机号、关注数、粉丝数、作品数、获赞数、被捏同款数、是否内部账号、VIP 等级、勋章列表。
📖 [技能文档](./references/user-info-skill.md) - 完整查询流程、字段映射、输出格式

**获取 AP 电量**
```bash
pnpm start get_ap_info
```

**获取签到状态**
```bash
pnpm start get_checkin_status
```

**执行签到**
```bash
pnpm start do_checkin
```

**获取消息数量**
```bash
pnpm start get_message_count
```

**获取 OC 世界列表**
```bash
pnpm start get_oc_worlds
```

**获取用户故事列表**
```bash
pnpm start get_user_stories --uuid "用户 uuid" --page_index 0 --page_size 20
```

**获取草稿/稿件列表**
```bash
pnpm start get_manuscript_list --page_index 0 --page_size 24
```

**获取粉丝列表**（指定用户）
```bash
pnpm start get_fan_list --visit_user_uuid "用户 uuid" --page_index 0 --page_size 20
```

**获取关注列表**（当前用户）
```bash
pnpm start get_subscribe_list --page_index 0 --page_size 20
```

**获取首页 Feed**
```bash
pnpm start get_feed --page_index 0 --page_size 3
```

---

### 📦 素材管理 (6 个)

**获取作品列表**
```bash
# 获取图片列表
pnpm start get_artifact_list --modality "PICTURE" --page_size 20

# 获取视频列表
pnpm start get_artifact_list --modality "VIDEO" --page_size 20

# 获取音频列表
pnpm start get_artifact_list --modality "AUDIO" --page_size 20

# 获取星标作品
pnpm start get_artifact_list --is_starred true --page_size 20
```

**获取提示词标签**
```bash
pnpm start get_full_prompt_tags --domain_name "APP/单图/图生图"
```

**获取角色/元素详情（开盒）** ⭐
```bash
pnpm start get_tcp_detail --name "角色名"
```

**搜索角色/元素**
```bash
pnpm start search_tcp --keywords "关键词" --parent_type "character" --sort_scheme "exact"
```

**获取收藏夹列表** ⚠️
```bash
pnpm start get_favor_list --parent_type "both" --page_index 0 --page_size 20
```
> ⚠️ 需要 APP token

**请求角色/元素详情** ⚠️
```bash
pnpm start request_character_or_elementum --name "角色名"
```
> ⚠️ 需要 APP token

---

### ⚙️ 配置与互动 (3 个)

**获取配置信息**
```bash
# 获取诗词生成配置
pnpm start get_config --namespace "verse" --key "generate_verse"

# 获取 AI 聊天预设
pnpm start get_config --namespace "litellm" --key "chat_presets"

# 获取生成次数限制
pnpm start get_config --namespace "frontend/generate" --key "MAKE_COUNT"
```

**角色抽奖**
```bash
pnpm start char_roll --num 1
```

**获取用户角色/元素列表**
```bash
# 获取用户的角色列表（OC）
pnpm start get_travel_parent --user_uuid "用户 uuid" --parent_type "oc" --page_size 20

# 获取用户的元素列表（Elementum）
pnpm start get_travel_parent --user_uuid "用户 uuid" --parent_type "elementum" --page_size 20
```

---

## 🏷️ 社区类命令 (13 个)

### 🌍 空间管理 (2 个)

**获取可供游览的空间**
```bash
pnpm start list_spaces
```

**获取空间的子空间**
```bash
pnpm start list_space_topics --space_uuid "空间 uuid"
```

📖 [详细指南](./references/space.md) - 空间介绍

---

### 🏷️ 标签管理 (4 个)

**获取标签信息**
```bash
pnpm start get_hashtag_info --hashtag "标签名"
```

**获取标签角色**
```bash
pnpm start get_hashtag_characters --hashtag "标签名" --sort_by "hot"
```

**获取标签合集**
```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

**获取标签故事**
```bash
pnpm start get_hashtag_stories --hashtag "标签名"
```

📖 [详细指南](./references/hashtag-research.md) - 调研流程、分析方法

---

### 💬 评论互动 (3 个)

**获取评论列表**
```bash
pnpm start get_comments --collection_uuid "合集 uuid" --page_size 20
```

**发表评论**
```bash
pnpm start add_comment --collection_uuid "合集 uuid" --content "评论内容"
```

**回复评论**
```bash
pnpm start add_comment --collection_uuid "合集 uuid" --content "回复内容" --parent_comment_uuid "父评论 uuid"
```

**点赞/取消点赞评论**
```bash
pnpm start like_comment --comment_uuid "评论 uuid" --like true
```

📖 [评论 API](./references/comment-interaction.md) - 完整接口文档

---

### 📚 玩法管理 (4 个)

**阅读合集内容**
```bash
pnpm start read-collection --uuid "玩法 uuid"
```

**标记精选**
```bash
pnpm start mark_selected --collection_uuid "合集 uuid"
```

**标记推荐**
```bash
pnpm start mark_featured --collection_uuid "合集 uuid"
```

**获取用户角色/元素列表**
```bash
pnpm start get_travel_parent --user_uuid "用户 uuid" --parent_type "oc" --page_size 20
```

---

## 参考文档

### 基础指南

| 场景 | 文档 |
|------|------|
| 🌍 世界观 | [space.md](./references/space.md) |
| 🎨 图片生成 | [image-generation.md](./references/image-generation.md) |
| 🎬 视频生成 | [video-generation.md](./references/video-generation.md) |
| 🎵 歌曲创作 | [song-creation.md](./references/song-creation.md) |
| 🎞️ MV 制作 | [song-mv.md](./references/song-mv.md) |
| 👤 角色查询 | [character-search.md](./references/character-search.md) |
| 🏷️ 标签调研 | [hashtag-research.md](./references/hashtag-research.md) |
| 🖊️ 内容创作 | [collection-remix.md](./references/collection-remix.md) |

### 执行技能（高级用法）

| 技能 | 文档 | 说明 |
|------|------|------|
| 💬 评论区互动 | [comment-interaction-skill.md](./references/comment-interaction-skill.md) | 按规则执行点赞/评论任务 |
| 📝 批量精选 | [batch-feature-skill.md](./references/batch-feature-skill.md) | 批量标记帖子为精选 |
| 📖 标签故事 | [hashtag-stories-skill.md](./references/hashtag-stories-skill.md) | 获取标签下的故事列表 |

---

## 使用建议

1. **先查询后创作** - 使用角色查询获取标准设定，确保创作符合官方设定
2. **先调研后规划** - 使用标签调研了解热门元素和创作方向
3. **提示词具体化** - 避免抽象描述，使用详细的要素组合
4. **迭代测试** - 先用快速模型测试，满意后再用高质量模型

---

## ⚠️ API 调用确认规则

**原则：任何 API 操作前必须与用户确认**

### 确认流程

```
1. 分析需求 → 确定需要调用的 API
2. 汇报 → 说明操作内容、影响
3. 等待确认 → 用户回复"确认"或具体指令
4. 执行 → 调用 API
5. 反馈结果 → 成功/失败
```

### 操作分类

| 操作类型 | 确认内容 |
|----------|----------|
| 🗑️ 删除 | 确认 UUID、确认不可恢复 |
| 📝 发布/下架 | 确认内容、确认状态 |
| ✏️ 编辑 | 确认修改内容 |
| 📊 查询 | 确认查询范围 |
| ⚡ 任务 | 确认执行动作 |
| 🎨 生成 | 确认参数、消耗 |

### 重要区别

| 操作 | 接口 | 方法 | 效果 | 可恢复 |
|------|------|------|------|--------|
| **下架** | `/v1/story/story-publish` | PUT | `status: "DRAFT"` | ✅ 可重新发布 |
| **删除** | `/v3/story/collection` | DELETE | 永久删除 | ❌ 不可恢复 |

### 禁止行为

- ❌ 不擅自执行任何 API 调用
- ❌ 不假设"这个应该没问题"
- ❌ 不先斩后奏

---

*最后更新：2026-03-10*

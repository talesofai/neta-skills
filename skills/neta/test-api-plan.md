# Neta Skill 功能与 API 对应表

## 📋 功能总览

| 分类 | 功能 | 命令 | API 端点 | 状态 |
|------|------|------|----------|------|
| **空间** | 获取空间列表 | `list_spaces` | GET /v1/space/space-list | ⏳待测 |
| | 获取空间详情 | `get_hashtag_info` | GET /v1/hashtag/hashtag_info/{name} | ⏳待测 |
| | 获取空间子主题 | `list_space_topics` | GET /v1/space/{uuid}/topics | ⏳待测 |
| **角色/元素** | 搜索角色/元素 | `search_tcp` | GET /v1/tcp-list | ⏳待测 |
| | 获取角色详情 | `request_character_or_elementum` | GET /v1/character/{uuid} | ⏳待测 |
| **标签** | 获取标签信息 | `get_hashtag_info` | GET /v1/hashtag/hashtag_info/{name} | ✅已验证 |
| | 获取标签角色 | `get_hashtag_characters` | GET /v1/hashtag/{name}/tcp-list | ⏳待测 |
| | 获取标签合集 | `get_hashtag_collections` | GET /v1/hashtag/hashtag-collections | ⏳待测 |
| | 获取标签故事 | `get_hashtag_stories` | GET /v1/hashtag/{name}/stories | ⏳待测 |
| **合集/玩法** | 获取合集详情 | `read_collection` | GET /v1/collection/{uuid} | ✅已验证 |
| | 发布合集 | `publish_collection` | POST /v1/collection/ | ⏳待测 |
| **评论** | 获取评论列表 | `get_comments` | GET /v1/story/story-comments | ⏳待测 |
| | 发表评论 | `add_comment` | POST /v1/story/story-comment | ⏳待测 |
| | 删除评论 | `delete_comment` | DELETE /v1/story/story-comment | ⏳待测 |
| | 点赞评论 | `like_comment` | POST /v1/story/comment-like | ⏳待测 |
| **创作** | 生成图片 | `make_image` | POST /v1/gpt/ | ⏳待测 |
| | 生成视频 | `make_video` | POST /v1/task/video/ | ⏳待测 |
| | 生成歌曲 | `make_song` | POST /v1/audio/ | ⏳待测 |
| | 移除背景 | `remove_background` | POST /v1/artifact/remove-background | ⏳待测 |
| **其他** | 标记精选 | `mark_featured` | POST /v1/collection/{uuid}/featured | ⏳待测 |
| | 标记选中 | `mark_selected` | POST /v1/collection/{uuid}/selected | ⏳待测 |

---

## 🔧 测试计划

1. 空间相关 API
2. 角色/元素查询 API
3. 标签相关 API
4. 合集相关 API
5. 评论相关 API
6. 创作相关 API

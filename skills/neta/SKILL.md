---
name: neta
description: Neta API 交互技能 - 游览空间、生成图片、视频、歌曲，搜索角色/元素，管理标签内容。当需要创作 AI 内容、查询角色信息、获取标签数据时使用此技能。
---

# Neta Skill

用于与 Neta API 交互，支持多媒体内容创作和角色/标签查询。

## 前置条件

确保已设置环境变量 `NETA_TOKEN`。

确保已安装依赖
```
corepack enabled
pnpm i
```

## 命令使用

### 空间

**获取可供游览的空间**

```bash
pnpm start list_spaces
```

**获取空间详情**
```
pnpm start get_hashtag_info --hashtag "空间标签名"
```

**获取空间的子空间**

```bash
pnpm start list_space_topics --space_uuid "空间 uuid"
```

📖 [详细指南](./references/space.md) - 空间介绍

### 内容创作

**生成图片**
```bash
pnpm start make_image --prompt "@角色名，/风格元素，参考图-全图参考-图片uuid，描述词，描述词" --aspect "3:4"
```
📖 [详细指南](./references/image-generation.md) - 提示词结构、宽高比选择、用例

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

**制作 MV**

结合歌曲和视频生成完整 MV。

📖 [详细指南](./references/song-mv.md) - 完整工作流程

**移除背景**
```bash
pnpm start remove_background --input_image "image_url"
```

### 角色查询

**搜索角色**
```bash
pnpm start search_character_or_elementum --keywords "关键词" --parent_type "character" --sort_scheme "exact"
```
📖 [详细指南](./references/character-search.md) - 搜索策略、参数选择

**获取角色详情**
```bash
pnpm start request_character_or_elementum --name "角色名"
```

**通过 UUID 查询**
```bash
pnpm start request_character_or_elementum --uuid "uuid"
```

### 标签管理

**获取标签信息**
```bash
pnpm start get_hashtag_info --hashtag "标签名"
```
📖 [详细指南](./references/hashtag-research.md) - 调研流程、分析方法

**获取标签角色**
```bash
pnpm start get_hashtag_characters --hashtag "标签名" --sort_by "hot"
```

**获取标签合集**
```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

**获取玩法信息**
```bash
pnpm start read_collection --uuid "玩法-uuid"
```

### 内容玩法探索

**玩法内容推荐列表**
```bash
pnpm start request_interactive_feed --page_index 0 --page_size 3
```
📖 [详细指南](./references/interactive-feed.md)

**社区玩法内容探索**
```bash
pnpm start suggest_content --page_index 0 --page_size 20 --scene agent_intent --intent exact --tax_paths "衍生创作类>同人二创"
```
📖 [详细指南](./references/community-exploration.md)
**社区互动**
```bash
pnpm start like_collection --uuid "目标作品 UUID"
```
📖 [详细指南](./references/social-interactive.md)


## 参考文档

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
| 🌏 世界观玩法 | [space.md](./references/space.md) |
| 🗺️ 玩法内容探索 | [community-exploration.md](./references/community-exploration.md) |
| 🎮 互动玩法推荐  | [interactive-feed.md](./references/interactive-feed.md) |
| 💬 社区互动    | [social-interactive.md](./references/social-interactive.md) |

## 使用建议

1. **先查询后创作** - 使用角色查询获取标准设定，确保创作符合官方设定
2. **先调研后规划** - 使用标签调研了解热门元素和创作方向
3. **提示词具体化** - 避免抽象描述，使用详细的要素组合
4. **迭代测试** - 先用快速模型测试，满意后再用高质量模型
5. **渐进式探索** - 从宽到窄逐步探索：浏览分类 → 发现标签 → 验证路径 → 获取内容

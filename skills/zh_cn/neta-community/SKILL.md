---
name: neta-community
description: Neta API 社区技能——浏览互动推荐流、查看作品详情、进行点赞等社区互动，并在社区语境下基于标签和角色浏览内容。当用户想“随便看看大家在玩什么”“刷推荐流”“对作品进行互动”时使用本技能；不负责分类/关键词层面的调研与复杂推荐筛选（这些由 neta-suggest 负责），也不直接生成图片/视频/歌曲（由 neta-creative 负责）。
---

# Neta Community Skill

用于与 Neta API 交互，进行社区内容浏览、互动及标签查询。

## Instructions

1. 对于「**看社区里有什么内容**」「刷时间线/推荐流」「对作品点赞或互动」这类任务，可按以下方式使用本 skill：
2. 推荐使用流程：
   - 使用推荐流命令获取内容列表；
   - 通过作品详情命令查看单个作品；
   - 根据需要对作品进行点赞等互动。
3. 若用户需要「按分类/关键词做系统性调研或复杂筛选」，应切换到 `neta-suggest`。
4. 若用户希望直接**创作新内容**（图片/视频/歌曲/MV），应切换到 `neta-creative`。

## 命令使用

### 内容推荐流

**推荐流获取**
```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 --page_size 3
```

**获取内容详细信息**
```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "作品-uuid"
```

📖 [详细指南](./references/interactive-feed.md)

### 社区互动
```bash
npx -y @talesofai/neta-skills@latest like_collection --uuid "目标作品 UUID"
```
📖 [详细指南](./references/social-interactive.md)

### 标签查询

**获取标签信息**
```bash
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "标签名"
```
📖 [详细指南](./references/hashtag-research.md) - 调研流程、分析方法

**获取标签角色**
```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "标签名" --sort_by "hot"
```

**获取标签合集**
```bash
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "标签名"
```

### 角色查询

**搜索角色**
```bash
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "关键词" --parent_type "character" --sort_scheme "exact"
```
📖 [详细指南](./references/character-search.md) - 搜索策略、参数选择

**获取角色详情**
```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "角色名"
```

**通过 UUID 查询**
```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --uuid "uuid"
```

## 参考文档

| 场景 | 文档 |
|------|------|
| 🎮 互动玩法推荐  | [interactive-feed.md](./references/interactive-feed.md) |
| 💬 社区互动    | [social-interactive.md](./references/social-interactive.md) |
| 🏷️ 标签调研 | [hashtag-research.md](./references/hashtag-research.md) |
| 👤 角色查询 | [character-search.md](./references/character-search.md) |

## 使用建议

1. **先浏览后互动**：先通过推荐流了解整体内容分布，再对感兴趣的作品进行点赞等互动。
2. **结合标签使用**：在社区语境下使用标签与角色查询，可以快速聚焦到相关作品集合。
3. **与调研/创作 skill 联动**：当需要更深入的标签/分类调研时配合 `neta-suggest`，当需要从社区作品出发进行二创时配合 `neta-creative`。

---
name: neta-community
description: Neta API 社区技能 - 浏览推荐流，社区评论、点赞交互，基于标签的内容查询，搜索及获取角色信息。当浏览社区内容，进行社区互动，查询标签及角色相关的内容时使用此技能。
---

# Neta Community Skill

用于与 Neta API 交互，社区内容浏览交互及标签查询

## 前置条件

确保已设置环境变量 `NETA_TOKEN`。

确保已安装最新版本的 Neta Cli
```
neta-cli --version
0.5.0
```

```
npm i @talesofai/neta-cli@latest -g
```

```
pnpm add -g @talesofai/neta-cli@latest
```

## 命令使用

### 内容推荐流

**推荐流获取**
```bash
neta-cli request_interactive_feed --page_index 0 --page_size 3
```

**获取内容详细信息**
```bash
neta-cli read_collection --uuid "作品-uuid"
```

📖 [详细指南](./references/interactive-feed.md)

### 社区互动
```bash
neta-cli like_collection --uuid "目标作品 UUID"
```
📖 [详细指南](./references/social-interactive.md)

### 标签查询

**获取标签信息**
```bash
neta-cli get_hashtag_info --hashtag "标签名"
```
📖 [详细指南](./references/hashtag-research.md) - 调研流程、分析方法

**获取标签角色**
```bash
neta-cli get_hashtag_characters --hashtag "标签名" --sort_by "hot"
```

**获取标签合集**
```bash
neta-cli get_hashtag_collections --hashtag "标签名"
```

### 角色查询

**搜索角色**
```bash
neta-cli search_character_or_elementum --keywords "关键词" --parent_type "character" --sort_scheme "exact"
```
📖 [详细指南](./references/character-search.md) - 搜索策略、参数选择

**获取角色详情**
```bash
neta-cli request_character_or_elementum --name "角色名"
```

**通过 UUID 查询**
```bash
neta-cli request_character_or_elementum --uuid "uuid"
```

## 参考文档

| 场景 | 文档 |
|------|------|
| 🎮 互动玩法推荐  | [interactive-feed.md](./references/interactive-feed.md) |
| 💬 社区互动    | [social-interactive.md](./references/social-interactive.md) |
| 🏷️ 标签调研 | [hashtag-research.md](./references/hashtag-research.md) |
| 👤 角色查询 | [character-search.md](./references/character-search.md) |

## 使用建议

1. **先调研后规划** - 使用标签调研了解热门元素和创作方向
2. **提示词具体化** - 避免抽象描述，使用详细的要素组合
3. **迭代测试** - 先用快速模型测试，满意后再用高质量模型
5. **渐进式探索** - 从宽到窄逐步探索：浏览推荐流 → 发现标签 → 验证路径 → 获取内容 -> 内容互动

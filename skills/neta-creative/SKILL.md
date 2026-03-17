---
name: neta-creative
description: Neta API 创作技能——生成图片、视频、歌曲、MV，并从现有作品中拆解创作思路。当用户需要生成或修改图片/视频/歌曲/MV，或基于角色设定与现有作品进行创作时使用本技能；不处理推荐流与标签/分类调研（这些由 neta-community 与 neta-suggest 负责）。
---

# Neta Creative Skill

用于与 Neta API 交互，支持多媒体内容创作和创作相关的角色查询。

## Instructions

1. 处理「**创作或修改具体作品**」（图片/视频/歌曲/MV/去背）相关任务时，可按以下顺序组织流程：
   - 在创作前，通过**角色查询**获取标准设定，再进行图片/视频/歌曲生成；
   - 需要从已有作品中反向分析创作思路时，使用 `read_collection` 并结合参考文档中的拆解方法。
2. 如果在创作过程中发现需求实际上更偏向「刷推荐/随便看看/做题材调研」，可以结合 `neta-community` 或 `neta-suggest` 的能力配合使用。

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

### 内容创作

**生成图片**
```bash
neta-cli make_image --prompt "@角色名，/风格元素，参考图-全图参考-图片uuid，描述词，描述词" --aspect "3:4"
```
📖 [详细指南](./references/image-generation.md) - 提示词结构、宽高比选择、用例

**生成视频**
```bash
neta-cli make_video --image_source "图片 URL" --prompt "动作描述" --model "model_s"
```
📖 [详细指南](./references/video-generation.md) - 动作描述原则、模型选择

**生成歌曲**
```bash
neta-cli make_song --prompt "风格描述" --lyrics "歌词内容"
```
📖 [详细指南](./references/song-creation.md) - 风格提示词、歌词格式

**制作 MV**

结合歌曲和视频生成完整 MV。

📖 [详细指南](./references/song-mv.md) - 完整工作流程

**移除背景**
```bash
neta-cli remove_background --input_image "image_url"
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

### 创作思路

**通过作品获取创作思路**

```bash
neta-cli read_collection --uuid "作品-uuid"
```

📖 [详细指南](./references/collection-remix.md)

## 参考文档

| 场景 | 文档 |
|------|------|
| 🎨 图片生成 | [image-generation.md](./references/image-generation.md) |
| 🎬 视频生成 | [video-generation.md](./references/video-generation.md) |
| 🎵 歌曲创作 | [song-creation.md](./references/song-creation.md) |
| 🎞️ MV 制作 | [song-mv.md](./references/song-mv.md) |
| 👤 角色查询 | [character-search.md](./references/character-search.md) |
| 🖊️ 内容创作思路 | [collection-remix.md](./references/collection-remix.md) |

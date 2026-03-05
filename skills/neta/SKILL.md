---
name: neta
description: Neta API 交互技能 - 生成图片、视频、歌曲，搜索角色/元素，管理标签内容。当需要创作 AI 内容、查询角色信息、获取标签数据时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# Neta Skill

用于与 Neta API 交互，支持多媒体内容创作和角色/标签查询。

## 前置条件

确保已设置环境变量 `NETA_TOKEN`。

## 命令使用

### 内容创作

**生成图片**
```bash
npm start make-image -p "提示词" -a "3:4"
```
📖 [详细指南](./references/image-generation.md) - 提示词结构、宽高比选择、用例

**生成视频**
```bash
npm start make-video -i "图片 URL" -p "动作描述" -m "model_s"
```
📖 [详细指南](./references/video-generation.md) - 动作描述原则、模型选择

**生成歌曲**
```bash
npm start make-song -p "风格描述" -l "歌词内容"
```
📖 [详细指南](./references/song-creation.md) - 风格提示词、歌词格式

**制作 MV**

结合歌曲和视频生成完整 MV。

📖 [详细指南](./references/song-mv.md) - 完整工作流程

**移除背景**
```bash
npm start remove-background -i "artifact-uuid"
```

**合并视频**
```bash
npm start merge-video -i "合并指令"
```

### 角色查询

**搜索角色**
```bash
npm start search-tcp -k "关键词" -t "character" -s "exact"
```
📖 [详细指南](./references/character-search.md) - 搜索策略、参数选择

**获取角色详情**
```bash
npm start request-character -n "角色名"
```

**通过 UUID 查询**
```bash
npm start request-character-or-style -u "uuid"
```

**获取背景音乐**
```bash
npm start request-bgm
```

### 标签管理

**获取标签信息**
```bash
npm start get-hashtag-info -t "标签名"
```
📖 [详细指南](./references/hashtag-research.md) - 调研流程、分析方法

**获取标签角色**
```bash
npm start get-hashtag-characters -t "标签名" --sort-by "hot"
```

**获取标签合集**
```bash
npm start get-hashtag-collections -t "标签名"
```

### 内容玩法探索

**获取玩法搜索关键词的自动补全建议 (Search Keyword Autocomplete)**
```bash
npm start -- suggest-keywords -p "游戏"
```

**基于完整关键词获取相关标签建议 (Tag Matching Suggestions)**
```bash
npm start -- suggest-tags -k "游戏"
```

**获取玩法分类层级的导航建议 (Category Navigation Suggestions)**
```bash
# 获取一级玩法分类
npm start -- suggest-categories -l 1
# 获取多级玩法分类 情景剧情类>Q 版小剧场
npm start -- suggest-categories -l 2 -P "情景剧情类"
npm start -- suggest-categories -l 3 -P "像素游戏世界"
```

**探索各种社区玩法 (智能内容流引擎)**
```bash
# 推荐模式
npm start -- suggest-content -m recommend --secondaries "热门 IP" -l 10
npm start -- suggest-content -m recommend -l 10
npm start -- suggest-content -m recommend --primaries "情景剧情类" -l 10

# 搜索模式
npm start -- suggest-content -m search -k "主题换装" -l 10
# 筛选模式
npm start -- suggest-content -m exact -t "衍生创作类>热门 IP>初音未来" -l 10
npm start -- suggest-content -m exact -t "衍生创作类>原创 IP>伪人大本营" -l 10


```



## 参考文档

| 场景 | 文档 |
|------|------|
| 🎨 图片生成 | [image-generation.md](./references/image-generation.md) |
| 🎬 视频生成 | [video-generation.md](./references/video-generation.md) |
| 🎵 歌曲创作 | [song-creation.md](./references/song-creation.md) |
| 🎞️ MV 制作 | [song-mv.md](./references/song-mv.md) |
| 👤 角色查询 | [character-search.md](./references/character-search.md) |
| 🏷️ 标签调研 | [hashtag-research.md](./references/hashtag-research.md) |

## 使用建议

1. **先查询后创作** - 使用角色查询获取标准设定，确保创作符合官方设定
2. **先调研后规划** - 使用标签调研了解热门元素和创作方向
3. **提示词具体化** - 避免抽象描述，使用详细的要素组合
4. **迭代测试** - 先用快速模型测试，满意后再用高质量模型

---
name: neta
description: Neta 能力索引与路由 skill——帮助选择合适的 Neta 相关 skill（neta-space / neta-creative / neta-adventure / neta-community / neta-suggest）。当需要了解 Neta 整体能力、决定当前任务该用哪个 skill 或从旧文档迁移时使用本 skill。
---

# Neta Skill

用于**总览和路由** Neta 相关技能，而不再直接执行具体命令。

> 本 skill 以前是一个「大而全」的 Neta 交互 skill，现已拆分为多个专职 skill。优先使用下方列出的子 skill；仅在需要了解能力地图或从旧文档迁移时使用本 skill。

## 安装子 Skills

在支持 `skills add` 的环境中，可以按需安装：

```bash
# 空间与世界观
npx skills add talesofai/neta-skills/skills/zh_cn/neta-space

# 内容创作（图片/视频/歌曲/MV）
npx skills add talesofai/neta-skills/skills/zh_cn/neta-creative

# 社区浏览与互动
npx skills add talesofai/neta-skills/skills/zh_cn/neta-community

# 内容调研与推荐
npx skills add talesofai/neta-skills/skills/zh_cn/neta-suggest

# 角色创建与管理
npx skills add talesofai/neta-skills/skills/zh_cn/neta-character

# 元素（视觉风格/概念）创建与管理
npx skills add talesofai/neta-skills/skills/zh_cn/neta-elementum

# 交互式故事冒险（奇遇剧本 / Adventure Campaigns）
npx skills add talesofai/neta-skills/skills/zh_cn/neta-adventure
```

## Instructions

1. **判断当前任务类型**：先根据用户需求判断是「空间游览」「内容创作」「交互式故事冒险（奇遇剧本）」「社区互动」「内容调研/推荐」「角色创建/管理」中的哪一类。
2. **选择对应子 skill**：
   - 空间/世界观/玩法结构 → 使用 `neta-space`
   - 生成图片/视频/歌曲/MV、拆解创作思路 → 使用 `neta-creative`
   - 创作或游玩 AI 驱动的故事剧本（奇遇剧本 / Adventure Campaigns）→ 使用 `neta-adventure`
   - 浏览推荐流、查看作品详情、点赞互动、社区视角浏览 → 使用 `neta-community`
   - 关键词/标签/分类/推荐流调研、从宽到窄找题材 → 使用 `neta-suggest`
   - 创建或管理动漫/文化IP/原创角色（VToken/TCP/OC）→ 使用 `neta-character`
   - 创建或管理视觉风格元素（场景、道具、服装、姿势、氛围、梗）→ 使用 `neta-elementum`
3. **仅在边界不清或需要解释时使用本 skill**，帮用户说明应该选择哪一个子 skill。

## 能力地图与子 Skill 说明

### 1. 空间与世界观：`neta-space`

负责：
- 列出可供游览的空间
- 获取空间/标签的世界观设定（lore）
- 获取空间的子空间、空间内角色与玩法 collections

适用场景：
- 用户提到「世界观/宇宙/空间/场景设定」
- 想按空间/活动来浏览玩法和内容

详见 `skills/zh_cn/neta-space/SKILL.md`。

### 2. 内容创作：`neta-creative`

负责：
- 生成图片、视频、歌曲、MV
- 上传本地图片/视频为平台素材（`upload`，供参考图、图生视频、抠图等使用）
- 移除图片背景
- 角色搜索与详情（创作语境下使用）
- 通过 `read_collection` 从作品反向拆解创作思路

适用场景：
- 用户要「生成/修改 图片/视频/歌曲/MV」
- 想根据角色/设定进行创作
- 想分析某个作品的创作思路

详见 `skills/zh_cn/neta-creative/SKILL.md`。

### 3. 交互式故事冒险（奇遇剧本）：`neta-adventure`

负责：
- 创建与更新奇遇剧本（`create_adventure_campaign`、`update_adventure_campaign`）
- 列出当前用户创建的剧本（`list_my_adventure_campaigns`）
- 加载完整剧本详情供游玩模式使用（`request_adventure_campaign`）

适用场景：
- 用户要「写故事 / 设计剧本 / 改剧情规则」等交互式叙事向需求
- 用户持有剧本 UUID，要以 DM + 角色扮演方式推进或继续一局故事

详见 `skills/zh_cn/neta-adventure/SKILL.md`。

### 4. 社区浏览与互动：`neta-community`

负责：
- 获取互动推荐流
- 查看作品详情（社区语境下）
- 点赞等社区互动
- 基于标签/角色的社区内容浏览

适用场景：
- 用户想「随便看看大家在玩什么」「刷推荐流」
- 想对作品进行点赞等互动

详见 `skills/zh_cn/neta-community/SKILL.md`。

### 5. 内容调研与推荐引擎：`neta-suggest`

负责：
- 关键词建议（`suggest_keywords`）
- 标签建议（`suggest_tags`）
- 分类体系导航与路径验证（`suggest_categories` / `validate_tax_path`）
- 多模式内容推荐流（`suggest_content`）

适用场景：
- 用户没有明确目标，只是「找个方向」「找题材」
- 想了解热门标签/分类结构/高热内容分布
- 内容创作前的系统性调研

详见 `skills/zh_cn/neta-suggest/SKILL.md`。

### 6. 角色创建与管理：`neta-character`

负责：
- 创建新角色为 VToken（虚拟Token，TCP/OC）
- 更新已有角色资料（视觉外观、背景故事、性格设定）
- 查询和搜索角色
- 创建前生成角色预览图

适用场景：
- 用户想要「创建新角色」「做个 OC」「设计角色」
- 用户想要「修改角色设定」「更新角色背景故事」「换角色外观」
- 用户想要「列出我的角色」或「搜索角色」

详见 `skills/zh_cn/neta-character/SKILL.md`。

### 7. 元素（视觉风格/概念）创建与管理：`neta-elementum`

负责：
- 创建新元素（视觉概念）为 VToken（TCP/Elementum）
- 更新已有元素设置（代表图、prompt、描述）
- 查询和搜索元素
- 创建前生成视觉预览图

适用场景：
- 用户想要「创建视觉元素」「做个 Elementum」「封装一个风格」
- 用户想创建可复用的视觉概念（场景、道具、服装、姿势、氛围、梗）
- 用户想要「列出我的元素」或「搜索元素」

详见 `skills/zh_cn/neta-elementum/SKILL.md`。

## 迁移说明（从旧 neta skill）

如果遇到旧文档或指令中引用了 `neta` skill 下的命令，请按下表迁移到新的专职 skill：

| 旧能力                     | 新 skill            |
|----------------------------|--------------------|
| 空间/标签世界观、空间游览 | `neta-space`       |
| 图片/视频/歌曲/MV 创作     | `neta-creative`    |
| 交互式故事 / 奇遇剧本     | `neta-adventure`   |
| 作品详情、推荐流、点赞互动 | `neta-community`   |
| 关键词/标签/分类/推荐调研 | `neta-suggest`     |
| 角色创建与管理             | `neta-character`   |
| 元素（视觉风格/概念）创建  | `neta-elementum`   |

今后的实现中，请优先调用这些子 skill，不再在本 skill 中添加新的命令示例。


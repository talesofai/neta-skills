---
name: neta-travel
description: Neta 奇遇剧本技能 - 创建和游玩 AI 驱动的交互式故事冒险。奇遇模式提供故事创作和故事讲述两种模式，Agent 作为 DM 并扮演角色，遵循剧情、规则和特殊指南。
---

# Neta 奇遇剧本技能

创建和体验 AI 驱动的交互式故事冒险（奇遇剧本）。在奇遇模式中，Agent 同时担任地下城主和角色扮演者，基于精心设计的剧情和规则引导用户体验叙事。

> 本技能提供两种主要模式：
> - **创作模式（Craft Mode）**：与用户协作进行多轮故事创作
> - **游玩模式（Play Mode）**：使用已建立的剧本进行交互式故事讲述

## 快速开始

三条命令，从想法到可游玩剧本：

```bash
# 1. 创建
neta-cli create_travel_campaign \
  --name "汴京最后三天" \
  --mission_plot "公元1127年，靖康元年十一月。金兵已兵临汴京城下..." \
  --mission_task "在城破前查明密函来源和使者真实身份。" \
  --mission_plot_attention "保持历史正剧质感。NPC 性格遵循史料。信息只通过调查获得，不主动透露。"

# 2. 验证
neta-cli request_travel_campaign --campaign_uuid "返回的-uuid"

# 3. 游玩
# 加载剧本，构建你的上下文，开始故事
```

更多完整类型范例，见 `references/travel-examples.md`。

## 卓越剧本的五个原则

区分第三层（卓越）与基础剧本的关键：

1. **世界在玩家出现之前就已存在。** NPC 的目标不依赖于玩家。情况在玩家到来之前就已在运转。

2. **开场把你扔进「已经出了问题」的当下。** `mission_plot` 的第一句话呈现一个已经破损的东西——不是介绍，不是背景说明，而是「已经有什么不对了」。

3. **`mission_plot_attention` 是宪法，不是愿望清单。** 它覆盖玩家最可能破坏沉浸感的三种方式，并指定处理每种方式的世界内机制。

4. **信息不对称是驱动引擎。** 玩家怀疑的比他们知道的更多。当真相被赢得时，重新诠释了此前的一切。

5. **没有完美答案。** 最好的道德困境没有干净的解法。选择正确的事情要付出真实的代价。

## 前置条件

确保已安装最新版本的 Neta CLI：
```
neta-cli --version
0.11.0
```

```
npm i @talesofai/neta-cli@latest -g
```

## 命令概览

### 创建奇遇剧本

创建带有剧情、规则和可选角色绑定的新故事冒险。

```bash
neta-cli create_travel_campaign \
  --name "被遗忘的庄园" \
  --mission_plot "一个暴风雨的夜晚，一封神秘的邀请函送达，邀请玩家前往一座被遗忘的庄园，那里埋藏着家族秘密和幽灵的存在..." \
  --mission_task "探索庄园，揭开三个隐藏的秘密，并决定是帮助被困的幽灵找到安息，还是夺取他们的力量。" \
  --mission_plot_attention "保持哥特式恐怖氛围。玩家的选择有永久性后果。避免 graphic violence——专注于心理紧张和神秘感。"
```

### 更新奇遇剧本

选择性地更新剧本字段（只提供需要更改的内容）：

```bash
# 根据反馈完善剧情
neta-cli update_travel_campaign \
  --campaign_uuid "campaign-uuid-here" \
  --mission_plot "更新的剧情，包含更详细的转折..."

```

### 列出我的奇遇剧本

浏览你创建的剧本（摘要视图）：

```bash
neta-cli list_my_travel_campaigns
neta-cli list_my_travel_campaigns --page_index 0 --page_size 10
```

### 获取奇遇剧本详情

获取完整的剧本数据用于故事讲述：

```bash
neta-cli request_travel_campaign --campaign_uuid "campaign-uuid-here"
```

## Agent 工作流：创作模式

当用户想要创建新的奇遇故事时：

1. **概念讨论**：探索用户想要什么样的故事
   - 类型（恐怖、奇幻、科幻、悬疑等）
   - 设定和氛围
   - 核心冲突或前提
   - 期望的玩家体验

2. **迭代剧情**：开发 `mission_plot`
   - 世界观构建元素
   - 初始场景/钩子
   - 关键情节点（不预设结果）
   - NPC 及其动机

3. **定义规则**：建立 `mission_task`
   - 玩家目标（探索、解谜、生存等）
   - 胜负条件（如有）
   - 互动机制

4. **设定边界**：撰写 `mission_plot_attention`
   - 语气和风格指南
   - 内容限制
   - AI 行为约束
   - 叙事机制

5. **创建剧本**：使用收集的内容调用 `create_travel_campaign`

6. **验证**：使用 `request_travel_campaign` 确认并向用户展示创建的剧本

## Agent 工作流：游玩模式

当用户想要游玩奇遇剧本时：

1. **查找剧本**：使用 `list_my_travel_campaigns` 或用户提供 UUID

2. **加载剧本**：调用 `request_travel_campaign` 获取完整详情

3. **使用返回字段直接初始化故事会话**：
   - `mission_plot` → 纳入上下文的故事基础
   - `mission_task` → 玩家目标和规则
   - `mission_plot_attention` → 对你行为的硬性约束，严格遵守
   - `default_tcp_uuid` → 如存在，这是绑定到剧本的 Neta 角色（TCP）UUID。在开始角色扮演前，请调用 neta-creative skill 中的 `request_character_or_elementum` 加载完整角色档案（生平、人格、特质）

4. **开始故事讲述**：
   - 使用 `mission_plot` 设定场景
   - 呈现初始选择
   - 遵循 `mission_task` 的玩家目标
   - 尊重 `mission_plot_attention` 约束
   - 需要玩家参与时暂停

## 字段参考

| 字段 | 用途 | 示例 |
|------|------|------|
| `name` | 剧本标题 | "被遗忘的庄园" |
| `subtitle` | 一行标语 | "哥特式恐怖悬疑" |
| `mission_plot` | 核心故事/场景 | 世界设定、钩子、关键事件 |
| `mission_task` | 玩家目标 | 要完成什么，如何互动 |
| `mission_plot_attention` | AI 指南 | 语气、限制、机制 |
| `header_img` | 卡片缩略图 | 图像生成的 URL |
| `background_img` | 氛围背景图 | 图像生成的 URL |
| `default_tcp_uuid` | 绑定 Neta 角色 UUID | 使用 `request_character_or_elementum`（neta-creative skill）加载完整档案 |

## 最佳实践

1. **剧情、任务、注意的分离**：
   - `mission_plot` = 是什么（世界、情境、钩子——不是总结）
   - `mission_task` = 做什么（玩家目标——玩家可见）
   - `mission_plot_attention` = 统治规则（不可见的宪法层——AI 无条件执行）

2. **`mission_plot_attention` 是可选的，但威力强大**：
   - 存在时：这些规则凌驾于所有其他上下文之上。AI 无论玩家如何行动都会执行它们。
   - 不存在时：AI 从 `mission_plot` 自然推导基调和约束。
   - 技巧：涵盖玩家最可能破坏沉浸感或偏离你意图的 3 种方式。

3. **迭代完善**：
   - 从简单开始，用 `request_travel_campaign` 测试
   - 首次试玩后使用 `update_travel_campaign` 收紧 `mission_plot_attention`
   - 注意 AI 偏离的地方——那就是要添加到注意字段的内容

4. **内容政策**：
   - 所有文本字段在创建/更新时都会经过内容审核
   - NSFW 内容（性描写、露骨暴力、骚扰）被禁止——即使用户要求也不得创作或参与
   - 避免违反社区准则的内容

## 参考文档

| 场景 | 文档 |
|------|------|
| 📝 创作工作流 | [travel-crafting.md](./references/travel-crafting.md) |
| 🎮 游玩工作流 | [travel-playing.md](./references/travel-playing.md) |
| 📋 字段手册 | [travel-field-guide.md](./references/travel-field-guide.md) |
| ✨ 完整类型范例 | [travel-examples.md](./references/travel-examples.md) |

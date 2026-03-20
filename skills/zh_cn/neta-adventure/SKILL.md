---
name: neta-adventure
description: Neta 奇遇剧本技能 - 创建和游玩 AI 驱动的交互式故事冒险。奇遇模式提供故事创作和故事讲述两种模式，Agent 作为 DM 并扮演角色，遵循剧情、规则和特殊指南。
---

# Neta 奇遇剧本技能

创建和体验 AI 驱动的交互式故事冒险（奇遇剧本）。Agent 同时担任地下城主和角色扮演者，基于精心设计的剧情、目标和统治规则引导叙事体验。

## 模式判断

行动前先确定模式。不要连续追问。

| 信号 | 模式 | 加载 |
|------|------|------|
| 用户想要创建 / 设计 / 构建故事 | 创作 | `references/adventure-crafting.md` |
| 用户提供 UUID 或提及已有剧本 | 游玩 | `references/adventure-playing.md` |
| 创作或游玩中出现字段相关问题 | — | `references/adventure-field-guide.md` |
| 意图模糊（提到类型但没有更多信息） | — | 只问一个问题：*「新建故事，还是游玩已有剧本？」* |

模式确定后不再重复询问。

## 命令使用

**创建剧本**

```bash
npx -y @talesofai/neta-skills@latest create_adventure_campaign \
  --name "汴京最后三天" \
  --mission_plot "公元1127年，靖康元年十一月。金兵已兵临汴京城下..." \
  --mission_task "在城破前查明密函来源和使者真实身份。" \
  --mission_plot_attention "保持历史正剧质感。信息只通过调查获得，不主动透露。"
```

📖 [创作工作流](./references/adventure-crafting.md) — 先出草稿的循环、字段体系、质量自检。

**更新剧本**（只有提供的字段会被修改）

```bash
npx -y @talesofai/neta-skills@latest update_adventure_campaign \
  --campaign_uuid "campaign-uuid-here" \
  --mission_plot_attention "更新后的统治规则..."
```

**列出你的剧本**

```bash
npx -y @talesofai/neta-skills@latest list_my_adventure_campaigns
npx -y @talesofai/neta-skills@latest list_my_adventure_campaigns --page_index 0 --page_size 10
```

**获取剧本详情**

```bash
npx -y @talesofai/neta-skills@latest request_adventure_campaign --campaign_uuid "campaign-uuid-here"
```

📖 [游玩工作流](./references/adventure-playing.md) — 会话初始化、主动推进、方向操控机制。

## neta-creative 集成

如果剧本存在 `default_tcp_uuid`，在尝试加载角色档案前，先检查当前技能集中是否有 `request_character_or_elementum` 可用。不要建议安装 neta-creative；先检查，然后根据结果继续。

## 参考文档

| 场景 | 文档 |
|------|------|
| 📝 创作工作流 | [adventure-crafting.md](./references/adventure-crafting.md) |
| 🎮 游玩工作流 | [adventure-playing.md](./references/adventure-playing.md) |
| 📋 字段语义 | [adventure-field-guide.md](./references/adventure-field-guide.md) |
| ✨ 跨类型完整范例 | [adventure-examples.md](./references/adventure-examples.md) |

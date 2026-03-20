---
name: neta-character
description: Neta 角色锻造技能 - 引导用户创建或更新动漫/文化IP/原创角色（OC）VToken（虚拟Token，TCP）。包含视觉预览、角色文档、背景故事确认等完整创作流程。当用户想要创建新角色、修改已有角色、或开始角色设计时使用此技能。
---

# Neta Character Skill

引导用户从灵感到铸造，完成专属角色 VToken（虚拟Token，TCP/OC）的创建与管理。角色创建后可在 `make_image` 中通过 `@角色名` 引用。

> 本技能需要配合 **neta-creative** 技能使用 `make_image` 进行视觉预览。

## 命令使用

### 创建角色

**完整创建流程（推荐）**

遵循「视觉预览 → 角色立档 → 确认创建」三段式流程。

📖 [创建引导](./references/character-creation.md) - 完整创作工作流程与最佳实践

```bash
npx -y @talesofai/neta-skills@latest create_character \
  --name "Ada Wong" \
  --avatar_artifact_uuid "make_image返回的artifacts[0].uuid" \
  --prompt "long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure" \
  --trigger "1girl, Ada Wong, black hair, red dress, spy, elegant, resident evil series" \
  --gender "女" \
  --age "28" \
  --occupation "间谍" \
  --persona "神秘冷静，目的不明，游走于各方势力之间" \
  --interests "情报收集，格斗，精密机械" \
  --description "艾达·王，黑发红裙的神秘间谍，真实目的无人知晓。外貌冷峻优雅，实为天才特工，多次与生化危机事件交织，却始终保持独立立场。" \
  --accessibility "PUBLIC"
```

### 更新角色

**有针对性地修改（只传需要改的字段）**

📖 [更新引导](./references/character-update.md) - 更新场景与流程

```bash
# 重新生图后更换视觉外观
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --avatar_artifact_uuid "新make_image返回的artifacts[0].uuid" \
  --prompt "新的视觉特征描述"

# 只更新背景故事
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --description "更新后的角色背景故事"

# 更新多个字段
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --persona "新的性格描述" \
  --interests "新的兴趣" \
  --occupation "新的职业"
```

### 查询已有角色

```bash
# 列出我的角色（当前用户创建的角色）
npx -y @talesofai/neta-skills@latest list_my_characters
npx -y @talesofai/neta-skills@latest list_my_characters --keyword "艾达" --page_size 10

# 搜索角色（全站关键词匹配）
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "角色名" --parent_type "character"

# 获取角色完整详情（含 tcp_uuid）
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "角色名"
```

## 参考文档

| 场景 | 文档 |
|------|------|
| ✨ 角色创建引导 | [character-creation.md](./references/character-creation.md) |
| 🔧 角色更新引导 | [character-update.md](./references/character-update.md) |
| 📋 字段说明手册 | [character-field-guide.md](./references/character-field-guide.md) |

## 使用建议

1. **先预览再创建** - 用 `make_image` 生成角色预览图，确认视觉满意后再调用 `create_character`；`avatar_artifact_uuid` 即为预览图的 `artifacts[0].uuid`
2. **预览只用纯文本** - `make_image` 预览阶段使用纯自然语言描述外貌，不加 `@角色名`（因为角色还未创建）
3. **trigger 必须是英文** - `trigger` 是图像模型和语言模型的识别锚点，中文 trigger 会显著降低识别率；应包含性别词、角色姓名、突出外貌特征、所属 IP 系列
4. **prompt 只写视觉** - `prompt` 只描述生理特征、服装、特殊标志；不写性格、故事、背景
5. **description 给人和 Agent 读** - `description` 应包含外貌摘要 + 角色背景故事，供 Agent 在后续创作中理解角色语境

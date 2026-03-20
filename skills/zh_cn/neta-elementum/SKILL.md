---
name: neta-elementum
description: Neta 元素(Elementum)炼金技能 - 引导用户创建或更新风格元素（Elementum）VToken（虚拟Token，TCP）。Elementum 是对一个可视化概念（场景、道具、服装、武器、姿势、氛围、梗图等）的封装，创建后可在 make_image 中通过 /元素名 引用。当用户想要创建新元素(Elementum)、封装某个视觉风格或概念、修改已有元素时使用此技能。
---

# Neta Elementum Skill

通过「元素(Elementum)炼金」工作流，将任意可视化概念铸造为可复用的 VToken（虚拟Token，TCP/Elementum）。创建后可在 `make_image` 中通过 `/元素名` 引用。

> 本技能需要配合 **neta-creative** 技能使用 `make_image` 进行视觉预览。

## 命令使用

### 创建元素

**完整炼金流程（推荐）**

遵循「概念确认 → 视觉预览 → 提炼封装 → 确认铸造」四段式流程。

📖 [炼金引导](./references/elementum-alchemy.md) - 完整炼金工作流程与最佳实践

```bash
npx -y @talesofai/neta-skills@latest create_elementum \
  --name "RE4村庄" \
  --artifact_uuid "make_image返回的artifacts[0].uuid" \
  --prompt "生化危机4风格欧洲中世纪村庄，破旧石屋，燃烧篝火，浓雾弥漫，枯木，恐怖压抑氛围，写实风格" \
  --description "此元素表示生化危机4标志性的废弃欧洲村庄场景。使用时搭配夜晚、角色人物、恐怖氛围等描述词，可与角色引用同用。参考图为原版游戏村庄截图风格的复现。" \
  --accessibility "PUBLIC"
```

### 更新元素

**有针对性地修改（只传需要改的字段）**

📖 [更新引导](./references/elementum-update.md) - 更新场景与流程

```bash
# 重新生图后更换代表图
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --artifact_uuid "新make_image返回的artifacts[0].uuid" \
  --prompt "更新后的生图指令"

# 只更新 Agent 使用说明
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --description "更新后的使用说明"
```

### 查询已有元素

```bash
# 列出我的元素（当前用户创建的元素）
npx -y @talesofai/neta-skills@latest list_my_elementum
npx -y @talesofai/neta-skills@latest list_my_elementum --keyword "村庄" --page_size 10

# 搜索元素（全站关键词匹配）
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "元素名" --parent_type "elementum"

# 获取元素完整详情（含 tcp_uuid）
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "元素名"
```

## 参考文档

| 场景 | 文档 |
|------|------|
| ⚗️ 元素炼金引导 | [elementum-alchemy.md](./references/elementum-alchemy.md) |
| 🔧 元素更新引导 | [elementum-update.md](./references/elementum-update.md) |
| 📋 字段说明手册 | [elementum-field-guide.md](./references/elementum-field-guide.md) |

## Elementum 能表示什么

Elementum 是对一个**可视化概念**的封装，适用范围很广：

| 类别 | 示例 |
|------|------|
| 场景/环境 | 废弃村庄、赛博朋克街道、星空沙漠 |
| 道具/物品 | 古老魔法书、未来武器、神圣圣杯 |
| 服装/风格 | 汉服、赛博朋克战甲、洛丽塔裙 |
| 姿势/动作 | 战斗站姿、回眸、飞跃动作 |
| 氛围/光影 | 午后阳光、赛博霓虹、神秘暗影 |
| 艺术风格 | 水墨风、像素风、漫画线稿 |
| 梗图/表情包 | "这就是命运" 梗、星战女孩 |

## 使用建议

1. **先预览再铸造** - 用 `make_image` 生成元素代表图，确认视觉满意后再调用 `create_elementum`；`artifact_uuid` 即为代表图的 `artifacts[0].uuid`
2. **prompt 给图像模型读** - `prompt` 是直接传给 `make_image` 的生图指令，语言要清晰、可组合、简洁精准；写完后应该能直接粘贴到 `make_image --prompt` 中使用
3. **description 给 Agent 读** - `description` 告诉 Agent 这个元素是什么、适合怎么用、有什么注意事项；格式建议："此元素表示[概念]，使用时[方法]，参考图展示[说明]"
4. **ref_image 用于风格锚定** - 如果有特定参考图（如游戏截图、参考画面），传入 `ref_image_uuid` 让图像模型锚定视觉风格

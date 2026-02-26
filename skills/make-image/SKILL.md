---
name: make-image
description: 基于文本提示词生成图片。当需要创建图片、生成视觉内容时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 生成图片

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
pnpm neta make-image --prompt "一个可爱的猫咪" --aspect "3:4"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --prompt, -p | 是 | - | 图片描述提示词 |
| --aspect, -a | 否 | 3:4 | 宽高比 (1:1, 3:4, 4:3, 9:16, 16:9) |

## 输出

返回 JSON 格式结果，包含 task_uuid、task_status 和 artifacts 数组。

## 相关技能

- [make-video](../make-video/SKILL.md) - 生成视频
- [search-tcp](../search-tcp/SKILL.md) - 搜索角色和元素

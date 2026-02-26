---
name: make-video
description: 基于图片和提示词生成视频。当需要将图片转换为视频、创建动态内容时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 生成视频

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
pnpm neta make-video --image-source "https://example.com/image.jpg" --prompt "让图片动起来" --model "model_s"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --image-source, -i | 是 | - | 源图片 URL |
| --prompt, -p | 是 | - | 视频描述提示词 |
| --model, -m | 否 | model_s | 模型选择 (model_s: 快速，model_w: 高质量) |

## 输出

返回 JSON 格式结果，包含 task_uuid、task_status 和 artifacts 数组。

## 相关技能

- [make-image](../make-image/SKILL.md) - 生成图片
- [merge-video](../merge-video/SKILL.md) - 合并视频

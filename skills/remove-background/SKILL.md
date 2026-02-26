---
name: remove-background
description: 移除图片背景。当需要抠图、去除图片背景时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 移除背景

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- remove-background --input-image "artifact-uuid"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| --input-image, -i | 是 | 输入图片的 artifact UUID |

## 输出

返回 JSON 格式结果，包含 task_uuid、task_status 和 artifacts 数组。

## 相关技能

- [make-image](../make-image/SKILL.md) - 生成图片

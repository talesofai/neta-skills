---
name: merge-video
description: 合并视频 - 将多个素材合并为视频。当需要组合多个素材创建视频时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 合并视频

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
pnpm neta merge-video --input "合并指令"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| --input, -i | 是 | 合并指令/提示词 |

## 输出

返回 JSON 格式结果，包含 task_uuid、task_status 和 artifacts 数组。

## 相关技能

- [make-video](../make-video/SKILL.md) - 生成视频

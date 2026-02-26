---
name: make-song
description: 基于提示词和歌词生成歌曲。当需要创建音乐、生成歌曲时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 生成歌曲

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
pnpm neta make-song --prompt "欢快的流行音乐" --lyrics "这里是歌词内容..."
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| --prompt, -p | 是 | 歌曲描述提示词 (10-2000 字符) |
| --lyrics, -l | 是 | 歌词内容 (10-3500 字符) |

## 输出

返回 JSON 格式结果，包含 task_uuid、task_status 和 artifacts 数组。

## 相关技能

- [request-bgm](../request-bgm/SKILL.md) - 获取背景音乐

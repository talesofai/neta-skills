---
name: request-bgm
description: 获取背景音乐。当需要获取推荐背景音乐时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取背景音乐

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- request-bgm
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --placeholder | 否 | - | 占位符参数 |

## 输出

返回背景音乐信息。

## 相关技能

- [make-song](../make-song/SKILL.md) - 生成歌曲

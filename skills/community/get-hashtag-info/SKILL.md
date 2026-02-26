---
name: get-hashtag-info
description: 获取标签信息 - 获取 hashtag 的详细信息，包括 lore、活动等。当需要了解标签详情时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取标签信息

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- get-hashtag-info --hashtag "标签名"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| --hashtag, -t | 是 | 标签名称 |

## 输出

返回标签详细信息，包含 name、lore、activity_detail、hashtag_heat、subscribe_count 等字段。

## 相关技能

- [get-hashtag-characters](../get-hashtag-characters/SKILL.md) - 获取标签角色
- [get-hashtag-collections](../get-hashtag-collections/SKILL.md) - 获取标签合集

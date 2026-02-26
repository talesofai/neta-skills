---
name: get-hashtag-collections
description: 获取标签合集 - 获取 hashtag 下的精选合集列表。当需要查看标签下的精选作品时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取标签合集

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- get-hashtag-collections --hashtag "标签名"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --hashtag, -t | 是 | - | 标签名称 |
| --page-index | 否 | 0 | 页码 |
| --page-size | 否 | 20 | 每页数量 |
| --sort-by | 否 | highlight_mark_time | 排序方式 |

## 输出

返回合集列表，包含 uuid、name、coverUrl、creator_name、likeCount 等字段。

## 相关技能

- [get-hashtag-info](../get-hashtag-info/SKILL.md) - 获取标签信息
- [get-hashtag-characters](../get-hashtag-characters/SKILL.md) - 获取标签角色

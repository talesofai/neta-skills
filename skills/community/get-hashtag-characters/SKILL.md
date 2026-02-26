---
name: get-hashtag-characters
description: 获取标签角色 - 获取 hashtag 下的角色列表。当需要查看标签下的角色时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取标签角色

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
pnpm neta get-hashtag-characters --hashtag "标签名"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --hashtag, -t | 是 | - | 标签名称 |
| --page-index | 否 | 0 | 页码 |
| --page-size | 否 | 20 | 每页数量 |
| --sort-by | 否 | hot | 排序方式 (hot/newest) |
| --parent-type | 否 | - | 类型 (oc/elementum) |

## 输出

返回角色列表，包含 uuid、name、short_name、avatar_img、creator_name 等字段。

## 相关技能

- [get-hashtag-info](../get-hashtag-info/SKILL.md) - 获取标签信息
- [get-hashtag-collections](../get-hashtag-collections/SKILL.md) - 获取标签合集

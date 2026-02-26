---
name: search-tcp
description: 搜索角色和元素。当需要查找角色、风格元素时使用此技能进行模糊搜索。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 搜索角色和元素

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- search-tcp --keywords "角色名" --parent-type "both"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --keywords, -k | 是 | - | 搜索关键词 |
| --parent-type, -t | 否 | both | 类型 (character/elementum/both) |
| --sort-scheme, -s | 否 | best | 排序方式 (exact/best) |
| --page-index | 否 | 0 | 页码 |
| --page-size | 否 | 10 | 每页数量 |

## 输出

返回搜索结果列表，包含 uuid、type、name、avatar_img 等信息。

## 相关技能

- [request-character](../request-character/SKILL.md) - 获取角色详情
- [request-character-or-style](../request-character-or-style/SKILL.md) - 获取角色/元素详情

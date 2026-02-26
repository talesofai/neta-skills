---
name: request-character-or-style
description: 获取角色或元素详情 - 通过名称或 UUID 获取角色/风格元素详细信息。支持精确查找。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取角色或元素详情

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
# 通过名称查询
pnpm neta request-character-or-style --name "角色名"

# 通过 UUID 查询
pnpm neta request-character-or-style --uuid "uuid-xxx"
```

## 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| --name, -n | 否* | - | 角色/元素名称 |
| --uuid, -u | 否* | - | 角色/元素 UUID |
| --parent-type, -t | 否 | both | 类型 (character/elementum/both) |

*name 和 uuid 至少提供一个

## 输出

返回角色或元素的详细信息。

## 相关技能

- [search-tcp](../search-tcp/SKILL.md) - 搜索角色和元素
- [request-character](../request-character/SKILL.md) - 获取角色详情

---
name: request-character
description: 获取角色详情 - 通过名称精确获取角色详细信息。当需要获取特定角色的完整信息时使用此技能。
compatibility: 需要设置 NETA_TOKEN 环境变量
---

# 获取角色详情

## 前置条件

设置环境变量 `NETA_TOKEN`。

## 使用方法

```bash
npm run neta -- request-character --name "角色名"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| --name, -n | 是 | 角色名称 |

## 输出

返回角色详细信息，包含 uuid、name、age、persona、description 等字段。

## 相关技能

- [search-tcp](../search-tcp/SKILL.md) - 搜索角色和元素
- [request-character-or-style](../request-character-or-style/SKILL.md) - 获取角色/元素详情

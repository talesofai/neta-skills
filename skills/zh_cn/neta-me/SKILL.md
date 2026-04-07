---
name: neta-me
description: Neta API 用户技能 — 管理自己的身份、积分和个人资产（资料、AP、故事、作品）。当用户询问「我的账号」「我的故事」「我的图片」「我的 AP」或与自身 Neta 身份及创作相关的问题时使用此技能。
---

# Neta 用户技能

当前 Neta 用户的自助服务仪表盘。提供身份、积分余额/历史以及个人内容资产（故事和作品）的访问能力。

## 何时使用

- 用户询问 **自己的** 资料、账号或身份
- 用户询问 **AP 余额**、积分消耗或每日上限
- 用户想要 **列出自己的故事/合集** 或 **作品**
- 用户想要 **更新个人资料**（昵称、简介、头像）
- 需要通过 OAuth 设备流建立或清除 **CLI 登录会话**

## 授权登录

当用户需要 **已登录的 Neta 身份** 来执行 CLI 流程，且没有有效会话时（或你原本会依赖 `NETA_TOKEN` 时），使用以下流程。

1. **启动流程**：运行 **`neta login`**（默认动作是 `request-code`）。
```bash
npx -y @talesofai/neta-skills@latest login --action request-code
```
这会启动由 CLI 存储的 OAuth **设备授权** 流程。

2. **浏览器步骤**：当命令返回设备授权字段后，向用户展示 **`verification_uri_complete`**（可直接打开的链接），告诉他们用浏览器完成登录/授权，然后**在聊天中明确说明浏览器步骤已完成**，这样你才能继续。

3. **完成登录**：用户在聊天中确认后，运行 **`neta login --action verify-code`** 用设备码换取令牌。成功后展示返回的 **账号基本信息**：**`uuid`**（长用户 ID）、**`nick_name`** 和 **`avatar_url`**。
```bash
npx -y @talesofai/neta-skills@latest login --action verify-code
```

4. **登出**：运行 `neta logout` 清除已存储的令牌。
```bash
npx -y @talesofai/neta-skills@latest logout
```

## 命令

### 资料与积分

**获取个人资料**

```bash
npx -y @talesofai/neta-skills@latest get_profile
```

返回 `uuid`、`nick_name`、`avatar_url`、AP 概览和资产统计。

**获取 AP 余额**

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

**获取 AP 历史 / 消耗记录**

```bash
npx -y @talesofai/neta-skills@latest get_ap_history --page_size 10
```

**更新资料**

```bash
npx -y @talesofai/neta-skills@latest update_profile --nick_name "新昵称"
```

📖 [详细指南](./references/profile-and-credits.md)

### 个人资产

**列出你的故事**

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --page_size 10
```

**列出你的作品**

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 10 --modality PICTURE
```

📖 [详细指南](./references/assets.md)

## 跨技能指引

| 任务 | 应使用的技能 |
|------|--------------|
| 点赞、收藏或评论故事 | `neta-community`（`like_collection`、`favor_collection`、`create_comment`） |
| 发布新故事 / 合集 | `neta-creative`（`publish_collection`） |
| 浏览社区 feed | `neta-community`（`fetch_feed`） |
| 管理角色或元素 | `neta-character` / `neta-elementum`（或 `list_my_characters` / `list_my_elementum`） |

## 参考文档

| 场景 | 文档 |
|------|------|
| 👤 资料、AP、登录/登出 | [profile-and-credits.md](./references/profile-and-credits.md) |
| 🖼️ 故事与作品 | [assets.md](./references/assets.md) |

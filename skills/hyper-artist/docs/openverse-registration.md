# Openverse API 注册指南

## 注册应用

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "<app-name>", "description": "<description>", "email": "<email>"}' \
  "https://api.openverse.org/v1/auth_tokens/register/"
```

返回 `client_id` + `client_secret`。之后点击邮件中的验证链接。

## 验证邮箱

```
GET https://api.openverse.org/v1/auth_tokens/verify/<code>/
```

## 换取 Access Token

```bash
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=<client_id>&client_secret=<client_secret>&grant_type=client_credentials" \
  "https://api.openverse.org/v1/auth_tokens/token/"
```

返回 `access_token`（12h 过期），速率限制 **100/min burst, 10,000/day sustained**。

## 设置环境变量

将 `OPENVERSE_API_KEY` 设为 access_token，持久化到 Cohub Space 环境变量中。

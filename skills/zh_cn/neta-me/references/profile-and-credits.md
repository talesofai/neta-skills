# 资料与积分

通过 `neta-me` 技能管理身份、AP 余额和登录会话的指南。

## get_profile

获取当前用户的基本身份和资产统计。

```bash
npx -y @talesofai/neta-skills@latest get_profile
```

### 响应字段（请记住）

- **`uuid`** — 长用户标识符
- **`nick_name`** — 显示昵称
- **`avatar_url`** — 头像图片 URL
- **`ap`** / **`ap_limit`** — 当前可用 AP 与每日上限
- **`total_collections`** — 拥有的故事/合集总数
- **`total_pictures`** — 生成的图片总数
- **`total_travel_characters`** — 旅行角色总数
- **`privileges`** — 已激活的功能特权列表及有效期

## get_ap_info

获取 AP（Action Points）积分的详细 breakdown。

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

- **`ap`** — 当前可用 AP
- **`ap_limit`** — 每日 AP 上限
- **`temp_ap`** — 剩余免费/每日配额 AP
- **`paid_ap`** — 剩余付费 AP
- **`unlimited_until`** — 如果处于无限计划，返回 ISO 时间戳，否则为 `null`

## get_ap_history

分页查看 AP 消耗与充值历史。

```bash
npx -y @talesofai/neta-skills@latest get_ap_history
npx -y @talesofai/neta-skills@latest get_ap_history --cursor_id 0 --page_size 10
```

每条记录包含：

- **`type`** — AP 花费用途（例如 `PICTURE,VERSE`）
- **`ap_delta`** — 变动量（消费为负）
- **`ctime`** / **`mtime`** — 时间戳
- **`extra_data.display_name`** — 可读原因（例如「图片生成」）
- **`extra_data.ap_delta_original`** — 折扣前原始花费
- **`has_next`** / **`next_cursor`** — 分页控制字段

## login / logout

用于 CLI 会话管理的 OAuth 设备流。

### 请求设备码
```bash
npx -y @talesofai/neta-skills@latest login --action request-code
```

### 浏览器授权后验证
```bash
npx -y @talesofai/neta-skills@latest login --action verify-code
```

### 清除会话
```bash
npx -y @talesofai/neta-skills@latest logout
```

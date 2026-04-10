# AP 积分

查看 AP（Action Points，行动电量）余额和消耗历史的指南。

## get_ap_info

获取当前 AP 余额的详细明细。

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

### 响应字段

- **`ap`** — 当前可用 AP
- **`ap_limit`** — 每日 AP 上限
- **`temp_ap`** — 免费/每日额度 AP 剩余
- **`paid_ap`** — 购买的 AP 剩余
- **`unlimited_until`** — 无限套餐到期时间戳，否则为 `null`

## get_ap_history

分页获取 AP 消耗和充值历史。

```bash
npx -y @talesofai/neta-skills@latest get_ap_history
npx -y @talesofai/neta-skills@latest get_ap_history --cursor_id 0 --page_size 10
```

### 参数

- **`cursor_id`**（可选）— 下一页游标；使用上一次响应的 `next_cursor`
- **`page_size`**（可选，默认 `10`，最大 `50`）

### 响应字段

每条记录包含：

- **`type`** — AP 消耗来源（如 `PICTURE,VERSE`）
- **`ap_delta`** — 变化量（消耗为负，充值为正）
- **`ctime`** — 时间戳
- **`extra_data.display_name`** — 可读原因（如"图片生成"）
- **`extra_data.ap_delta_original`** — 折扣前原始消耗量
- **`has_next`** / **`next_cursor`** — 翻页控制；`has_next` 为 `true` 时继续翻页

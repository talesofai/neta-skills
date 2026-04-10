# AP Credits

Guide for checking AP (Action Points) balance and consumption history.

## get_ap_info

Get a detailed breakdown of your current AP balance.

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

### Response fields

- **`ap`** — currently available AP
- **`ap_limit`** — daily AP ceiling
- **`temp_ap`** — free/daily quota AP remaining
- **`paid_ap`** — purchased AP remaining
- **`unlimited_until`** — ISO timestamp if on an unlimited plan, otherwise `null`

## get_ap_history

Paginated AP consumption and recharge history.

```bash
npx -y @talesofai/neta-skills@latest get_ap_history
npx -y @talesofai/neta-skills@latest get_ap_history --cursor_id 0 --page_size 10
```

### Parameters

- **`cursor_id`** (optional) — cursor for next page; use `next_cursor` from the previous response
- **`page_size`** (optional, default `10`, max `50`)

### Response fields

Each record includes:

- **`type`** — what the AP was spent on (e.g. `PICTURE,VERSE`)
- **`ap_delta`** — change amount (negative for consumption, positive for recharge)
- **`ctime`** — timestamp
- **`extra_data.display_name`** — human-readable reason (e.g. "图片生成")
- **`extra_data.ap_delta_original`** — original cost before discounts
- **`has_next`** / **`next_cursor`** — pagination controls; keep paginating while `has_next` is `true`

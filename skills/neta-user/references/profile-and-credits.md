# Profile and Credits

Guide for managing identity, AP balance, and login sessions via the `neta-user` skill.

## get_profile

Retrieve the current user's basic identity and asset totals.

```bash
npx -y @talesofai/neta-skills@latest get_profile
```

### Response fields (memorize)

- **`uuid`** — long user identifier. **You must memorize this.** Many asset commands (e.g. `list_my_stories`) require it explicitly.
- **`nick_name`** — display name
- **`avatar_url`** — profile picture URL
- **`ap`** / **`ap_limit`** — current available AP vs daily limit
- **`total_collections`** — total stories/collections owned
- **`total_pictures`** — total generated pictures
- **`total_travel_characters`** — total travel characters
- **`privileges`** — list of active feature privileges with validity dates

## get_ap_info

Get a detailed breakdown of AP (Action Points) credits.

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

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

Each record includes:

- **`type`** — what the AP was spent on (e.g. `PICTURE,VERSE`)
- **`ap_delta`** — change amount (negative for consumption)
- **`ctime`** / **`mtime`** — timestamps
- **`extra_data.display_name`** — human-readable reason (e.g. "图片生成")
- **`extra_data.ap_delta_original`** — original cost before discounts
- **`has_next`** / **`next_cursor`** — pagination controls

## update_profile

Update the current user's profile. At least one field is required.

```bash
npx -y @talesofai/neta-skills@latest update_profile --nick_name "New Name"
npx -y @talesofai/neta-skills@latest update_profile --bio "A short bio"
npx -y @talesofai/neta-skills@latest update_profile --avatar_url "https://..."
```

Returns the updated `uuid`, `nick_name`, and `avatar_url`.

## login / logout

OAuth device flow for CLI session management.

### Request device code
```bash
npx -y @talesofai/neta-skills@latest login --action request-code
```

### Verify after browser consent
```bash
npx -y @talesofai/neta-skills@latest login --action verify-code
```

### Clear session
```bash
npx -y @talesofai/neta-skills@latest logout
```

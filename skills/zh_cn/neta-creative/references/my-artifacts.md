# 我的作品

列出当前用户生成媒体作品的指南。

## list_my_artifacts

列出已登录用户生成的媒体作品（图片、视频、音频）。

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 10 --modality PICTURE
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 5 --is_starred true
```

### 参数

- **`page_index`**（可选，默认 `0`）
- **`page_size`**（可选，默认 `20`，最大 `100`）
- **`modality`**（可选）— 按 `PICTURE`、`VIDEO`、`AUDIO` 过滤；多值用逗号分隔
- **`is_starred`**（可选布尔值）— 仅显示收藏项

### 翻页

持续递增 `page_index` 直到 `has_more` 为 `false`，或 `list` 为空时停止。

### 响应

- **`has_more`** — `true` 表示还有更多页
- **`list`** — 作品记录数组：
  - `uuid` — 作品 ID；可用于 `make_video --image_source`、`remove_background` 或合集命令
  - `status` — 例如 `SUCCESS`、`PENDING`、`FAILED`
  - `url` — 媒体 URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — 收藏标记
  - `ctime` / `mtime` — 创建和修改时间
  - `audio_name` — 音频作品的名称

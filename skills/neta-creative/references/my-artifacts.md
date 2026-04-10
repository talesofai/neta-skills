# My Artifacts

Guide for listing generated media artifacts owned by the current user.

## list_my_artifacts

List generated media artifacts (images, videos, audio) owned by the authenticated user.

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 10 --modality PICTURE
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 5 --is_starred true
```

### Parameters

- **`page_index`** (optional, default `0`)
- **`page_size`** (optional, default `20`, max `100`)
- **`modality`** (optional) — filter by `PICTURE`, `VIDEO`, `AUDIO`; comma-separated for multiple
- **`is_starred`** (optional boolean) — filter starred items only

### Pagination

Keep incrementing `page_index` while `has_more` is `true`. Stop when `has_more` is `false` or `list` is empty.

### Response

- **`has_more`** — `true` if more pages exist
- **`list`** — array of artifact records:
  - `uuid` — artifact id; use this in `make_video --image_source`, `remove_background`, or collection commands
  - `status` — e.g. `SUCCESS`, `PENDING`, `FAILED`
  - `url` — media URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — starred flag
  - `ctime` / `mtime` — creation and modification times
  - `audio_name` — name if audio artifact

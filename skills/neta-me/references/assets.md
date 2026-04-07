# Personal Assets

Guide for listing the current user's stories (collections) and generated artifacts.

## list_my_stories

List stories/collections created by the authenticated user.

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --page_size 10
```

### Parameters

- **`page_index`** (optional, default `0`)
- **`page_size`** (optional, default `20`, max `100`)

### Pagination

Keep incrementing `page_index` while `has_more` is `true`. Stop when `has_more` is `false`, or when `list` is empty.

### Response

- **`has_more`** — `true` if more pages exist; `false` when all results have been returned
- **`list`** — array of story records with fields such as:
  - `storyId` — collection identifier
  - `name` — title
  - `coverUrl` — cover image
  - `status` — `INIT` | `DRAFT` | `PUBLISHED` | `DELETED` | `PRIVATE`
  - `ctime` — creation time
  - `likeCount`, `commentCount` — engagement counts
  - `is_pinned` — whether pinned
  - `has_video` — whether includes video

### Tips

- Use `neta-creative` (`publish_collection`) to publish or update a story.
- Use `neta-community` (`like_collection`, `favor_collection`, `create_comment`) to interact with stories.

## list_my_artifacts

List generated media artifacts (images, videos, audio) owned by the user.

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 10 --modality PICTURE
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 5 --is_starred true
```

### Parameters

- **`page_index`** (optional, default `0`)
- **`page_size`** (optional, default `20`, max `100`)
- **`modality`** (optional) — filter by `PICTURE`, `VIDEO`, `AUDIO`; comma-separated for multiple
- **`is_starred`** (optional boolean) — filter starred items

### Pagination

Keep incrementing `page_index` while `has_more` is `true`. Stop when `has_more` is `false`, or when `list` is empty.

### Response

- **`has_more`** — `true` if more pages exist; `false` when all results have been returned
- **`list`** — array of artifact records:
  - `uuid` — artifact id
  - `status` — e.g. `SUCCESS`, `PENDING`, `FAILED`
  - `url` — media URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — starred flag
  - `ctime` / `mtime` — creation and modification times
  - `audio_name` — name if audio artifact

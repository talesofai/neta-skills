# Personal Assets

Guide for listing the current user's stories (collections) and generated artifacts.

## list_my_stories

List stories/collections created by the user. **Requires `uuid`** — get it from `get_profile` first.

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --uuid "03a363af-b33b-4c11-95a3-084bdb400f85" --page_size 10
```

### Parameters

- **`uuid`** (required) — the user's own UUID
- **`page_index`** (optional, default `0`)
- **`page_size`** (optional, default `20`, max `20`)

### Response

- **`total`** — total count (backend may return `999999` as a performance placeholder; trust `get_profile.total_collections` for the real count)
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
- **`page_size`** (optional, default `20`)
- **`modality`** (optional) — filter by `PICTURE`, `VIDEO`, `AUDIO`; comma-separated for multiple
- **`is_starred`** (optional boolean) — filter starred items

### Response

- **`total`** — total count (may be placeholder `999999`; trust `get_profile.total_pictures` for real image count)
- **`list`** — array of artifact records:
  - `uuid` — artifact id
  - `status` — e.g. `SUCCESS`, `PENDING`, `FAILED`
  - `url` — media URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — starred flag
  - `ctime` / `mtime` — creation and modification times
  - `audio_name` — name if audio artifact

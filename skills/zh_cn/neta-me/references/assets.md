# 个人资产

通过 `neta-me` 技能列出当前用户的故事（合集）和生成作品的指南。

## list_my_stories

列出用户创建的故事/合集。已登录状态下调用时，`uuid` 默认为当前用户，无需显式传入。

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --page_size 10
npx -y @talesofai/neta-skills@latest list_my_stories --uuid "03a363af-b33b-4c11-95a3-084bdb400f85" --page_size 10
```

### 参数

- **`uuid`**（可选）— 目标用户 UUID；默认为当前登录用户
- **`page_index`**（可选，默认 `0`）
- **`page_size`**（可选，默认 `20`，最大 `100`）

### 翻页

持续递增 `page_index` 直到 `has_more` 为 `false`，或 `list` 为空时停止。

### 响应

- **`has_more`** — `true` 表示还有更多页；`false` 表示已全部返回
- **`list`** — 故事记录数组，包含：
  - `storyId` — 合集标识符
  - `name` — 标题
  - `coverUrl` — 封面图
  - `status` — `INIT` | `DRAFT` | `PUBLISHED` | `DELETED` | `PRIVATE`
  - `ctime` — 创建时间
  - `likeCount`、`commentCount` — 互动数
  - `is_pinned` — 是否置顶
  - `has_video` — 是否包含视频

### 提示

- 发布或更新故事请使用 `neta-creative`（`publish_collection`）。
- 给故事点赞、收藏、评论请使用 `neta-community`（`like_collection`、`favor_collection`、`create_comment`）。

## list_my_artifacts

列出用户生成的媒体作品（图片、视频、音频）。

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

- **`has_more`** — `true` 表示还有更多页；`false` 表示已全部返回
- **`list`** — 作品记录数组：
  - `uuid` — 作品 ID
  - `status` — 例如 `SUCCESS`、`PENDING`、`FAILED`
  - `url` — 媒体 URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — 收藏标记
  - `ctime` / `mtime` — 创建和修改时间
  - `audio_name` — 音频作品的名称

# 个人资产

通过 `neta-me` 技能列出当前用户的故事（合集）和生成作品的指南。

## list_my_stories

列出用户创建的故事/合集。**需要提供 `uuid`** — 先通过 `get_profile` 获取。

```bash
npx -y @talesofai/neta-skills@latest list_my_stories --uuid "03a363af-b33b-4c11-95a3-084bdb400f85" --page_size 10
```

### 参数

- **`uuid`**（必填）— 用户自己的 UUID
- **`page_index`**（可选，默认 `0`）
- **`page_size`**（可选，默认 `20`，最大 `20`）

### 响应

- **`total`** — 总数（后端可能返回 `999999` 作为性能占位符；真实数量以 `get_profile.total_collections` 为准）
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
- **`page_size`**（可选，默认 `20`）
- **`modality`**（可选）— 按 `PICTURE`、`VIDEO`、`AUDIO` 过滤；多值用逗号分隔
- **`is_starred`**（可选布尔值）— 仅显示收藏项

### 响应

- **`total`** — 总数（可能为占位符 `999999`；真实图片数量以 `get_profile.total_pictures` 为准）
- **`list`** — 作品记录数组：
  - `uuid` — 作品 ID
  - `status` — 例如 `SUCCESS`、`PENDING`、`FAILED`
  - `url` — 媒体 URL
  - `modality` — `PICTURE` / `VIDEO` / `AUDIO`
  - `is_starred` — 收藏标记
  - `ctime` / `mtime` — 创建和修改时间
  - `audio_name` — 音频作品的名称

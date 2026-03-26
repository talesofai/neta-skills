# Uploading user media (local files)

Use the `upload` command when the user has **image or video files on disk** that must become Neta **artifacts** before other creative commands can reference them. The CLI reads the file, uploads it via STS to object storage, registers it as a picture or video artifact, and polls until processing leaves `PENDING` / `MODERATION`.

**Command**

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "/absolute/or/relative/path/to/file.png"
```

**Requirements**

- **`NETA_TOKEN`** must be set (same as other authenticated commands). Unauthenticated runs fail with an explicit error.
- **`file_path`**: either
  - a **local path** — absolute, or relative to the **current working directory** when the command runs; or
  - a **direct media URL** — `http://` or `https://` to a resource the CLI can `fetch` (same supported types and size limits apply after download).

---

## Supported formats and limits

Detection uses file **magic bytes** (not only the extension). Unsupported or unrecognised types raise `file_type_not_supported`.

| Kind   | Extensions (examples) | Default max size |
|--------|------------------------|------------------|
| Image  | `png`, `jpeg`, `webp`, `gif` | 10 MiB |
| Video  | `avi`, `mov`, `flv`, `mkv`, `webm`, `mp4`, `mpeg`, `wmv`, `rm`, `vob`, `ts` | 100 MiB |

Oversized files raise `file_size_too_large`.

**Region / bucket**: the implementation picks CN vs US OSS settings from the API base URL (`.cn` vs default). You normally do not configure this in the skill.

---

## Command output

On success, the command returns an **artifact detail** object (same shape as other artifact APIs), including at least:

- **`uuid`**: stable artifact id — use this anywhere a command expects an artifact UUID (see below).
- **`url`**: public URL for the asset when available — use for parameters that expect an **image URL** (e.g. `make_video --image_source`).
- **`modality`**, **`status`**, and optional `image_detail` / `video_detail`.

Wait until the command finishes; it already waits through upload and moderation polling (timeout can still occur on very slow jobs — treat as a hard error and retry or narrow the file).

---

## Where uploaded artifacts are used in the creative skill

These are the **neta-creative** flows that consume **user-origin** content once it exists as an artifact (via `upload`, or via prior generation / `read_collection`).

| Goal | Command | What to pass from `upload` result |
|------|---------|-----------------------------------|
| Image edit / multi-reference generation (`8_image_edit`) | `make_image` | Put **`ref_img-<uuid>`** in the prompt (up to 14). See [Image generation](./image-generation.md). |
| Image → video | `make_video` | **`--image_source`** = the artifact’s **`url`** (string URL), not the bare UUID. See [Video generation](./video-generation.md). |
| Transparent background | `remove_background`, `remove_background_nocrop` | **`--input_image`** = artifact **`uuid`**. See [Image generation](./image-generation.md) (background removal). |
| Remix / reference from a work | `read_collection` | Collection payloads may include reference images; local files are not injected directly — **upload first**, then use `ref_img-<uuid>` in `make_image` if you need them in-prompt. See [Creative remix](./collection-remix.md). |
| Publish or update a collection with specific assets | `publish_collection`, `edit_collection` | **`artifacts`**: comma-separated picture **UUIDs** (1–12). Upload images first, then pass their UUIDs. |

**`make_song`** does not take image or video uploads; for MVs you still combine song + `make_image` / `make_video` as in [Song MV](./song-mv.md). Use **`upload`** when the cover or plate still lives only as a local file.

---

## Suggested workflows

### Local photo → video

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./still.png"
# From JSON output, copy "url" for image_source and/or "uuid" for other steps.

npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<URL_FROM_UPLOAD_OUTPUT>" \
  --prompt "Gentle breathing, slight hair movement, soft light." \
  --model "model_s"
```

### Local image → edit with `8_image_edit`

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./reference.jpg"

npx -y @talesofai/neta-skills@latest make_image \
  --prompt "ref_img-<UUID_FROM_UPLOAD_OUTPUT>, change outfit to winter coat, keep pose and background" \
  --aspect "3:4" \
  --model_series "8_image_edit"
```

### Local image → cutout

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./character.png"

npx -y @talesofai/neta-skills@latest remove_background --input_image "<UUID_FROM_UPLOAD_OUTPUT>"
```

### Remote file by URL

When the asset is already hosted, pass a direct `https://` (or `http://`) link as `file_path`. The CLI downloads it, then runs the same type/size checks and OSS upload as for a local file.

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "https://example.com/reference.jpg"
```

---

## Related docs

- [Image generation](./image-generation.md) — `ref_img-` prompt syntax, models, background removal.
- [Video generation](./video-generation.md) — `image_source` and motion prompts.
- [Song MV](./song-mv.md) — combining audio and visuals.
- [Creative remix](./collection-remix.md) — using `read_collection` with generation commands.

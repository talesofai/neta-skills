# Best Practices for Creative Remix

Use existing information, toolsets, and reference materials to precisely execute instructions and help users generate high‑quality fantasy content.

## Constraints

- **Continue calling tools until the task is complete** or you must confirm critical information. Minimize unnecessary back‑and‑forth with the user.
- Tool calls do not share implicit context: always pass full, explicit parameters for every call.
- **Do not** use any tools that are not provided.
- **Retry policy**: if a tool call fails, you may retry at most once, and you **must** retry with the **exact same parameters**. Do not silently change logic or arguments.

## Reference context

Use the `read_collection` command to fetch reference information for remixing, reproducing, or adapting existing works to meet user needs:

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "collection-uuid"
```

**Response contents (key fields)**

- Gameplay information
- Assets contained in the collection
- Creator information
- Remix section:
  - `preset_description`: summary of the reference
  - `reference_planning`: reference execution plan
  - `launch_prompt`:
    - `core_input`: detailed description for the adaptation
    - `brief_input`: concise description for the adaptation
    - `ref_image`: reference images

## Starting creation

You will typically use the following commands for remix workflows:

- `make_image`
- `make_video`
- `make_song`

If the user supplies **local images or videos** that are not in the collection payload, run **`upload`** first, then reference picture artifacts with **`ref_img-<uuid>`** in `make_image` or the artifact **`url`** in `make_video`. See [Media upload](./media-upload.md).

📖 See also:

- [Generate Images](./image-generation.md)
- [Generate Videos](./video-generation.md)
- [Generate Songs](./song-creation.md)
- [Media upload](./media-upload.md)


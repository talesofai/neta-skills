# Best Practices for Image Generation

Applies to the `make_image` and `remove_background` commands.

---

## Prompt structure

- **Character**: reference characters with `@character_name`; this pulls in the full character definition.
- **Visual elements**: reference style elements with `/elementum_name`, for example `/MangaStyle`.
- **Reference images**: reference existing images with the pattern `ref_img-artifact_uuid`, for example `"ref_img-1234567890"`. Up to 14 images are supported.
- **Natural language phrases**: describe the concrete scene and details. If you don’t reference a character, you must describe the character’s appearance here.

**Recommended format:**

```text
[Character] + [Visual element] + [Reference image] + [Main subject] + [Appearance details] + [Outfit/accessories] + [Pose/action] + [Background/environment] + [Lighting/atmosphere] + [Art style]
```

**Example:**

```text
@character_name, /MangaStyle, ref_img-1234567890, ref_img-1234567891, keyword1, keyword2…
```

**Notes:**

- Provide as much context and intent as possible. Detailed narrative descriptions almost always produce better, more coherent images than a flat list of disconnected keywords.
- Character references **must** use the form `@character_name` (for example, `@Neta`).
- Element references **must** use the form `/elementum_name` (for example, `/MangaStyle`).
- You can use `search_character_or_elementum` to discover available characters and elementums, and `request_character_or_elementum` to validate them before using.
- Reference images must follow the pattern `ref_img-artifact_uuid` and should come from `read_collection` artifacts or previously generated images.
- When referencing characters or elements, separate them with spaces or commas, for example: `"@character_name, /MangaStyle, walking on campus"`.
- For image editing or image‑to‑image tasks, always include the appropriate reference images.
- When specific characters exist, prefer `@character_name` instead of re‑describing their appearance from scratch.

---

## Aspect ratio choices

| Ratio  | Resolution | Typical use cases                      |
|--------|------------|----------------------------------------|
| `1:1`  | 512×512    | Avatars, icons, square covers         |
| `3:4`  | 576×768    | **Default**; social media verticals, posters |
| `4:3`  | 768×576    | Landscape illustrations, slides       |
| `9:16` | 576×1024   | Phone wallpapers, short‑video covers, Stories |
| `16:9` | 1024×576   | Video covers, banners, desktop walls  |

---

## Common use cases

### Character standing illustration

```bash
neta-cli make_image \
  --prompt "A Japanese high school girl in uniform, long black hair, red ribbon, standing at the classroom door, sunlight streaming in, fresh and natural" \
  --aspect "3:4"
```

### Three‑view character sheet

```bash
# Front view
neta-cli make_image --prompt "@character_name, front view, white background, full body" --aspect "3:4"

# Side view
neta-cli make_image --prompt "@character_name, side view, white background, full body" --aspect "3:4"

# Back view
neta-cli make_image --prompt "@character_name, back view, white background, full body" --aspect "3:4"
```

### Expression set

```bash
neta-cli make_image --prompt "@character_name, happy expression, close‑up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, angry expression, close‑up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, surprised expression, close‑up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, shy expression, close‑up, white background" --aspect "1:1"
```

### Background removal (cut‑out)

```bash
neta-cli remove_background --input_image "image_uuid"
```

---

## FAQ

### Q: What if the generated image doesn’t match expectations?

**A:**

1. Add more concrete details to the prompt.
2. Specify a clear art style.
3. Simplify overly complex scenes.
4. Try different aspect ratios.

### Q: What if character faces look broken?

**A:**

1. Avoid overly complex expression descriptions.
2. Don’t describe too many actions at once.
3. Add prompts like “delicate facial features”.
4. Use close‑up compositions (explicitly mention “face close‑up”).

### Q: How to maintain character consistency?

**A:**

1. Use consistent feature descriptions for the character.
2. Save successful prompt templates.
3. First query character details to get canonical descriptions:

   ```bash
   neta-cli request_character_or_elementum --name "character_name"
   ```

4. Build prompts based on that description.

---

## Related docs

- [Character search](./character-search.md) — getting canonical character info.
- [Video generation](./video-generation.md) — converting images into animated video.


# Image Generation Best Practices

Understand user needs, refine prompts, and enhance image details and atmosphere while meeting user requirements.

Applicable to `make_image` and `remove_background` commands.

---

## Prompt Structure

- **Characters**: Use characters in the format "@character_name", e.g., "@character_name". The character name must be an exact string match—no modifications, no spaces, no simplified/traditional Chinese conversion. This reference contains the character's complete visual information.
- **Image Elements**: Use built-in image elements in the format "/element_name", e.g., "/comic_style".
- **Reference Images**: When using the 8_image_edit model, you can reference existing images as references using the format "reference-image-artifact_uuid", e.g., "reference-image-1234567890". A maximum of 14 images is supported.
- **Chinese Natural Language Phrases**: Descriptive text composed of short phrases depicting the scene. If no character is referenced, describe the character's appearance within the natural language phrases.

**Recommended Format:**
```
[Character] + [Image Elements] + [Reference Images] + [Subject Description] + [Appearance Details] + [Clothing/Accessories] + [Pose/Action] + [Background/Environment] + [Lighting/Atmosphere] + [Art Style]
```

**Notes:**
- For the noobxl model, @character_name must be placed at the beginning
- Image elements must appear in the format "/name", e.g., "/comic_style"
- For the 8_image_edit model, provide more context and intent. Describe the scene rather than just listing keywords. This model's core strength lies in its deep language understanding. Narrative descriptive paragraphs almost always generate better, more coherent images compared to strings of unrelated words
- You can search for available characters or elements using search_character_or_elementum, and verify their availability using request_character_or_elementum before use
- Reference images must appear in the format "reference-image-artifact_uuid", and can only use images obtained via `read_collection` or generated images as references
- When referencing characters or elements, add spaces or commas before and after, e.g., "@Neta#996, /comic_style, walking in school"
- For image modifications and other generations related to referencing the original image, be sure to use reference images with the 8_image_edit model
- Example (referencing characters and elements): @Neta#996, /comic_style, reference-image-artifact_uuid, reference-image-artifact_uuid, phrase1, phrase2…
- **When a specific character exists, use the character via @character_name rather than re-describing the character's appearance**
---

## Model Selection

- **3_noobxl**: Style-oriented single-character image generation, using danbooru tag format for prompts. Excellent at various art styles and style combinations, not skilled at complex scenes, multiple characters, or images with text. Prefer this model when users specify specific characters and style elements for stylized character images.

- **8_image_edit (default)**: Versatile high-end image generation model, using natural language descriptions for prompts, supporting multiple image inputs. Excellent at following complex instructions and presenting high-fidelity text, multi-character rendering, and images with text. Not skilled at refined art styles. Can be used for sequential art (comic panels/storyboards), adding and removing elements, inpainting (semantic mask), style transfer, combining multiple images to bring things to life, etc. Prefer this model when multiple characters are involved, reference images contain complex visual structures and text content, or when modifying/adjusting specified images

## Aspect Ratio Selection

| Ratio | Resolution | Use Cases |
|-------|------------|-----------|
| `1:1` | 1024*1024 | Avatars, icons, square displays |
| `3:4` | 896*1152 | **Default recommended**, social media portrait, posters |
| `4:3` | 1152*896 | Landscape illustrations, presentations |
| `9:16` | 768*1344 | Phone wallpapers, short video covers, Stories |
| `16:9` | 1344*768 | Video covers, banners, desktop wallpapers |

**When using the above five ratios, prefer using the --aspect parameter**

Generate a 3:4 character standing illustration

```bash
neta-cli make_image \
  --prompt "@Neta#996, character standing illustration" \
  --aspect "3:4"
```

**When needing special image ratios, directly use --width and --height parameters**

Generate a 2:1 wide poster

```bash
neta-cli make_image \
  --prompt "@Neta#996, wide poster" \
  --width "1536" \
  --height "768"
```

**Note: When using custom resolutions, excessively high or low values will cause image degradation. Try to keep values within the range [768-1536]**

---

## Common Use Cases

### Character Standing Illustration

```bash
neta-cli make_image \
  --prompt "@Neta#996, sailor uniform, standing at the classroom door, sunlight streaming through the window, fresh and natural" \
  --aspect "3:4"
```

### Three-View Character Sheet

```bash
# Front view
neta-cli make_image --prompt "@character_name, front view, white background, full body" --aspect "3:4"

# Side view
neta-cli make_image --prompt "@character_name, side view, white background, full body" --aspect "3:4"

# Back view
neta-cli make_image --prompt "@character_name, back view, white background, full body" --aspect "3:4"
```

### Expression Sheet

```bash
neta-cli make_image --prompt "@character_name, happy expression, close-up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, angry expression, close-up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, surprised expression, close-up, white background" --aspect "1:1"
neta-cli make_image --prompt "@character_name, shy expression, close-up, white background" --aspect "1:1"
```

### Background Removal

```bash
neta-cli remove_background --input_image "image_uuid"
```
---

## FAQ

### Q: What if the generated result doesn't match expectations?

**A:** Adjust prompts gradually:
1. Add more specific details
2. Specify art style clearly
3. Simplify overly complex scenes
4. Try different aspect ratios

### Q: What if the character's face is distorted?

**A:**
1. Avoid overly complex expression descriptions
2. Don't describe multiple actions at once
3. Try adding descriptions like "exquisite facial features"
4. Use close-up composition (emphasize "face close-up" in the prompt)

### Q: How to maintain character consistency?

**A:**
1. Use fixed character feature descriptions
2. Save successful prompt templates
3. First query character details to get standard descriptions
   ```bash
   neta-cli request_character_or_elementum --name "character_name"
   ```
4. Generate prompts based on character descriptions

---

## Related Documents

- [Character Search](./character-search.md) - Get character standard information
- [Video Generation](./video-generation.md) - Convert images to dynamic videos

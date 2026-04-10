---
name: neta-elementum
description: "Guides users through creating, updating, searching, and refining reusable style tokens (Elementum VTokens) that encapsulate visual concepts like scenes, clothing, poses, or art styles. Follows a four-stage alchemy workflow. After creation, tokens are referenced in make_image via /ElementName. Use when users want to save a style, create a visual template, or modify existing Elementa."
---

# Neta Elementum Skill

Through the "Elementum Alchemy" workflow, forge any visual concept into a reusable style token (VToken/TCP/Elementum). Save a style, create a visual template, or build a reusable style that can be referenced in `make_image` via `/ElementName` after creation.

> This skill requires the **neta-creative** skill to use `make_image` for visual previews.

## Command Usage

### Create Elementum

**Full Alchemy Flow (Recommended)**

Follow the four-stage workflow:

1. **Concept Confirmation** — Clarify what visual concept the user wants to capture (e.g. a scene, art style, pose).
2. **Visual Preview** — Generate a representative image with `make_image` so the user can see the style token before committing.
3. **Refinement** — Iterate on the prompt and preview until the result matches the intended concept.
4. **Final Confirmation** — Lock in the Elementum via `create_elementum` with the approved artifact.

📖 [Alchemy Guide](./references/elementum-alchemy.md) - Complete alchemy workflow and best practices

```bash
npx -y @talesofai/neta-skills@latest create_elementum \
  --name "RE4 Village" \
  --artifact_uuid "artifacts[0].uuid from make_image response" \
  --prompt "Resident Evil 4 style European medieval village, dilapidated stone houses, burning bonfire, thick fog, dead trees, horror atmosphere, realistic style" \
  --description "This element represents the iconic abandoned European village from Resident Evil 4. Use with night, character descriptions, horror atmosphere. Reference image recreates the original game village style." \
  --accessibility "PUBLIC"
```

### Update Elementum

**Targeted Modifications (Only pass fields you want to change)**

📖 [Update Guide](./references/elementum-update.md) - Update scenarios and workflow

```bash
# Update representative image after regenerating
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "element's tcp_uuid" \
  --artifact_uuid "new artifacts[0].uuid from make_image" \
  --prompt "updated image generation instruction"

# Only update Agent usage guide
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "element's tcp_uuid" \
  --description "updated usage guide"
```

### Query Existing Elementa

```bash
# List my elementa (created by current user)
npx -y @talesofai/neta-skills@latest list_my_elementum
npx -y @talesofai/neta-skills@latest list_my_elementum --keyword "village" --page_size 10

# Search elements (global search, keyword matching)
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "element name" --parent_type "elementum"

# Get full element details (including tcp_uuid)
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "element name"
```

## Reference Documentation

| Scenario | Document |
|----------|----------|
| ⚗️ Elementum Alchemy Guide | [elementum-alchemy.md](./references/elementum-alchemy.md) |
| 🔧 Elementum Update Guide | [elementum-update.md](./references/elementum-update.md) |
| 📋 Field Reference Manual | [elementum-field-guide.md](./references/elementum-field-guide.md) |

## What Elementum Can Represent

Elementum encapsulates a **visual concept**, with wide applicability:

| Category | Examples |
|----------|----------|
| Scene/Environment | Abandoned village, cyberpunk street, starry desert |
| Props/Items | Ancient magic book, future weapon, holy grail |
| Clothing/Style | Hanfu, cyberpunk armor, Lolita dress |
| Poses/Actions | Battle stance, looking back, leap action |
| Atmosphere/Lighting | Afternoon sunlight, cyber neon, mysterious shadow |
| Art Styles | Ink wash, pixel art, comic line art |
| Memes/Expressions | "This is destiny" meme, Star Wars girl |

## Usage Recommendations

1. **Preview before forging** - Use `make_image` to generate element representative images, confirm satisfaction before calling `create_elementum`; `artifact_uuid` is the `artifacts[0].uuid` from the representative image
2. **prompt for image models** - `prompt` is the direct image generation instruction passed to `make_image`, should be clear, composable, concise and precise; after writing, it should be pasteable directly into `make_image --prompt`
3. **description for Agents** - `description` tells Agents what this element is, how to use it, and any usage notes; recommended format: "This element represents [concept], use by [method], reference image shows [description]"
4. **ref_image for style anchoring** - If there's a specific reference image (e.g., game screenshot, reference scene), pass `ref_image_uuid` to let image models anchor the visual style

---
name: neta-creative
description: Neta API creative skill — generate images, videos, songs, and MVs, and deconstruct creative ideas from existing works. Use this skill when the user wants to create or edit images/videos/songs/MVs, or create based on character settings and existing works. Do not use it for feed browsing or tag/category research (those are handled by neta-community and neta-suggest).
---

# Neta Creative Skill

Used to interact with the Neta API for multimedia content creation and creation‑related character queries.

## Instructions

1. For tasks that **create or edit concrete assets** (images, videos, songs, MVs, background removal), follow this flow:
   - Before creation, use **character queries** to fetch canonical character settings, then generate images/videos/songs based on them.
   - To reverse‑engineer creative ideas from an existing work, call `read_collection` and combine the result with the guidance in the reference docs.
2. If, during creation, you discover that the real need is more like “browse recommendations / casually explore / research topics”, combine this skill with `neta-community` or `neta-suggest` instead of overloading this skill.

## Commands

### Content creation

**Generate image**

```bash
npx -y @talesofai/neta-skills@latest make_image --prompt "@character_name, /elementum_name, ref_img-uuid, description1, description2" --aspect "3:4"
```

📖 [Detailed guide](./references/image-generation.md) — prompt structure, aspect ratio choices, examples.

**Generate video**

```bash
npx -y @talesofai/neta-skills@latest make_video --image_source "image URL" --prompt "action description" --model "model_s"
```

📖 [Detailed guide](./references/video-generation.md) — motion description principles, model selection.

**Generate song**

```bash
npx -y @talesofai/neta-skills@latest make_song --prompt "style description" --lyrics "lyrics content"
```

📖 [Detailed guide](./references/song-creation.md) — style prompts, lyrics format.

**Create MV**

Combine an audio track and video to create a full MV.

📖 [Detailed guide](./references/song-mv.md) — end‑to‑end workflow.

**Remove background**

```bash
npx -y @talesofai/neta-skills@latest remove_background --input_image "image_url"
```

### Character queries

**Search characters**

```bash
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "keywords" --parent_type "character" --sort_scheme "exact"
```

📖 [Detailed guide](./references/character-search.md) — search strategies and parameter choices.

**Get character details**

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "character_name"
```

**Query by UUID**

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --uuid "uuid"
```

### Creative idea deconstruction

**Derive creative ideas from a work**

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "collection-uuid"
```

📖 [Detailed guide](./references/collection-remix.md)

## Reference docs

| Scenario              | Doc                                      |
|-----------------------|------------------------------------------|
| 🎨 Image generation   | [image-generation.md](./references/image-generation.md) |
| 🎬 Video generation   | [video-generation.md](./references/video-generation.md) |
| 🎵 Song generation    | [song-creation.md](./references/song-creation.md)       |
| 🎞️ MV creation       | [song-mv.md](./references/song-mv.md)                   |
| 👤 Character queries  | [character-search.md](./references/character-search.md) |
| 🖊️ Creative remixing | [collection-remix.md](./references/collection-remix.md) |


---
name: neta-creative
description: Neta API creative skill — generate images, videos, songs, and MVs, and deconstruct creative ideas from existing works. Use this skill when the user wants to create or edit images/videos/songs/MVs, or create based on character settings and existing works. Do not use it for feed browsing or tag/category research (those are handled by neta-community and neta-suggest).
---

# Neta Creative Skill

Used to interact with the Neta API for multimedia content creation, creation‑related character queries, and premium subscription flows where supported.

## Instructions

1. For tasks that **create or edit concrete assets** (images, videos, songs, MVs, background removal), follow this flow:
   - Before creation, use **character queries** to fetch canonical character settings, then generate images/videos/songs based on them.
   - To reverse‑engineer creative ideas from an existing work, call `read_collection` and combine the result with the guidance in the reference docs.
2. If, during creation, you discover that the real need is more like “browse recommendations / casually explore / research topics”, combine this skill with `neta-community` or `neta-suggest` instead of overloading this skill.
3. **Premium** (plans, orders, Stripe): use the commands below. Run **`get_current_premium_plan`** before and after checkout so the user can confirm tier (and end time if returned). Commerce needs the **global** Neta API—see the premium reference. If creation is blocked by **quota / credits (电量)** or **usage frequency (频率)**, say why in one beat; if an upgrade fits their goal, offer the path once (list plans → create order → pay)—**do not** repeat upgrade nudges in the same conversation unless the user asks.

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
npx -y @talesofai/neta-skills@latest remove_background --input_image "image_artifact_uuid"
```

**Upload local image or video**

Registers a file from disk **or from an `http://` / `https://` URL** as a Neta artifact (after upload and moderation). Use the returned **`uuid`** or **`url`** in `make_image` (`ref_img-…`), `make_video` (`--image_source` URL), `remove_background`, or collection commands.

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "/path/to/file.png"
# or: --file_path "https://example.com/asset.png"
```

📖 [Media upload](./references/media-upload.md) — supported types, size limits, and how outputs map to each downstream command.

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

### Premium subscription

**Current plan (verify before / after upgrade)**

```bash
npx -y @talesofai/neta-skills@latest get_current_premium_plan
```

Returns the signed-in user’s **current tier** (e.g. Basic, Starter, Pro, Master) and **subscription end** when applicable. Use it **before** starting checkout to record the baseline, and **again after** payment or renewal completes so the user can confirm the plan changed as expected.

**List plans and SPU UUIDs**

```bash
npx -y @talesofai/neta-skills@latest list_premium_plans
```

**Create an order**

```bash
npx -y @talesofai/neta-skills@latest create_premium_order --spu_uuid "spu-uuid"
```

**Get one order**

```bash
npx -y @talesofai/neta-skills@latest get_premium_order --order_uuid "order-uuid"
```

**List orders (paginated)**

```bash
npx -y @talesofai/neta-skills@latest list_premium_orders --page_index 0 --page_size 20
```

**Pay an unpaid order (Stripe Checkout)**

```bash
npx -y @talesofai/neta-skills@latest pay_premium_order --order_uuid "order-uuid" --channel "stripe-checkout"
```

📖 [Premium workflow and limits](./references/premium.md)

### Credits & your artifacts

AP (Action Points) is consumed by every generation command. Use these to monitor your balance and review generated output.

**AP balance**

```bash
npx -y @talesofai/neta-skills@latest get_ap_info
```

**AP consumption history**

```bash
npx -y @talesofai/neta-skills@latest get_ap_history --page_size 10
```

**List your generated artifacts**

```bash
npx -y @talesofai/neta-skills@latest list_my_artifacts --page_size 20
npx -y @talesofai/neta-skills@latest list_my_artifacts --modality PICTURE
npx -y @talesofai/neta-skills@latest list_my_artifacts --is_starred true
```

📖 [AP credits guide](./references/ap-credits.md) · [Artifacts guide](./references/my-artifacts.md)

## Reference docs

| Scenario              | Doc                                      |
|-----------------------|------------------------------------------|
| 🎨 Image generation   | [image-generation.md](./references/image-generation.md) |
| 🎬 Video generation   | [video-generation.md](./references/video-generation.md) |
| 🎵 Song generation    | [song-creation.md](./references/song-creation.md)       |
| 🎞️ MV creation       | [song-mv.md](./references/song-mv.md)                   |
| 📤 Local media upload | [media-upload.md](./references/media-upload.md)        |
| 👤 Character queries  | [character-search.md](./references/character-search.md) |
| 🖊️ Creative remixing | [collection-remix.md](./references/collection-remix.md) |
| ⭐ Premium / subscribe | [premium.md](./references/premium.md)                   |
| 💡 AP credits         | [ap-credits.md](./references/ap-credits.md)             |
| 🖼️ My artifacts      | [my-artifacts.md](./references/my-artifacts.md)         |


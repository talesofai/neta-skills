# Elementum Alchemy Guide

Complete workflow for forging any visual concept into a reusable Elementum Token.

---

## Alchemy Workflow Overview

```
Stage 1: Concept Confirmation
  └─ Clarify element category (scene/prop/style/pose/etc.)
  └─ Understand core visual features and usage scenarios

Stage 2: Visual Preview
  └─ Draft prompt based on concept
  └─ Generate representative image with make_image
  └─ Iterate until visual accurately expresses concept

Stage 3: Refinement & Encapsulation
  └─ Refine prompt (direct image generation instruction for make_image)
  └─ Write description (usage guide for Agents)
  └─ Confirm name

Stage 4: Confirmation & Forging
  └─ Show complete configuration to user, confirm correctness
  └─ Call create_elementum
```

---

## Stage 1: Concept Confirmation

Before generating images, confirm with user:

- **What concept does this element represent?** — Scene, item, style, or pose?
- **What are the core visual features?** — Color, material, atmosphere, composition?
- **What is the usage scenario?** — What characters or scenes will it be paired with?
- **Any reference images?** — Game screenshots, real photos, reference scenes

**Example guiding questions:**
> "What visual concept do you want to encapsulate? What are its most prominent features — is it an environment, or a specific item/style?"

---

## Stage 2: Visual Preview

Choose appropriate generation strategy based on element category.

### Scene/Environment

```bash
# Panorama view
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Resident Evil 4 style European medieval village, dilapidated stone houses, burning bonfire, thick fog, dead trees, horror atmosphere, realistic style, no people" \
  --aspect "16:9"

# Atmosphere close-up
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Dilapidated stone house wall, moss, torch, thick fog, close-up, realistic style" \
  --aspect "3:4"
```

### Items/Props

```bash
# Item showcase (white background, clear detail)
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Ancient leather magic book, golden seal runes, slightly worn, white background, game item icon style" \
  --aspect "1:1"
```

### Style/Artistic

```bash
# Style test (verify style with generic scene)
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Ink wash painting style, mountains and water, bamboo forest, negative space, traditional Chinese painting aesthetics, minimalist" \
  --aspect "3:4"
```

### Poses/Actions

```bash
# Pose showcase (with character)
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Female character, battle stance, two-handed sword, side profile, dynamic composition, white background, full body" \
  --aspect "3:4"
```

### Memes/Expressions

```bash
# Meme recreation
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Anime style female, slight frown, pointing to right, 'this is destiny' expression, lighthearted and humorous" \
  --aspect "1:1"
```

### Iteration Suggestions

- If concept is abstract, generate a few to see direction first
- Adjust keyword order (earlier words have higher weight)
- Add art style terms to stabilize output style

### After Image Generation

After `make_image` returns, **display the generated image to the user** using `artifacts[0].url` and ask if it matches their vision before proceeding.

---

## Stage 3: Refinement & Encapsulation

### Prompt Guidelines

> **This is the final image generation instruction stored in the element, passed directly to `make_image` models.**

**Principles:**
- Clear, composable — Can be combined with other description words
- Don't include specific character descriptions — Elements should be character-independent (unless it's a pose element)
- Precisely describe core visual features, avoid vague words

**Comparison examples:**

| Too vague ❌ | Precise ✅ |
|-------------|-----------|
| `abandoned village` | `Resident Evil 4 style European medieval abandoned village, dilapidated stone houses, burning bonfire, thick fog, horror atmosphere` |
| `ancient weapon` | `Japanese katana, slender blade, purple scabbard, golden handguard, steel edge, metallic reflection, white background` |
| `interesting pose` | `Female character, looking back stance, flowing long hair, 45-degree side profile, white background, full body` |

### Description Guidelines

> **This is the usage guide for Agents**, telling Agents what this element is, how to use it, and any注意事项.

**Recommended format:**
```
This element represents [concept description]. Use by [method and pairing suggestions]. Reference image shows [description]. [Notes (if any)].
```

**Example (scene):**
```
This element represents the iconic abandoned European medieval village from Resident Evil 4, filled with horror atmosphere.
Use with character references (@CharacterName) and night, dark, horror description words, suitable for horror or game-style image generation.
Reference image is a recreation of the original RE4 game village scene.
Note: This element is environment-focused; if characters are needed in generation, separately describe character actions and positions in prompt.
```

**Example (style):**
```
This element represents Japanese ink wash painting style, emphasizing negative space aesthetics and artistic conception.
Can be used with any scene or character; adding "ink wash style" to prompt will activate this element's visual features.
Reference image is traditional ink wash landscape style test image. Suitable for poetic, classical, Eastern aesthetics.
```

**Example (prop):**
```
This element represents a mysterious ancient magic book with golden runes on the cover.
Use as a prop reference in scenes, pairing with magician characters or fantasy scenes.
Reference image shows the book's overall appearance and material details. Can be paired with "holding magic book", "magic book floating" action descriptions.
```

---

## Stage 4: Confirmation & Forging

Show complete configuration to user:

```
Element Name: RE4 Village
Prompt: Resident Evil 4 style European medieval village, dilapidated stone houses, burning bonfire, thick fog, dead trees, horror atmosphere, realistic style
Description: This element represents the iconic abandoned European village from RE4...
Representative Image: artifacts[0].uuid = xxxxxxxx
```

After confirmation, execute:

```bash
npx -y @talesofai/neta-skills@latest create_elementum \
  --name "RE4 Village" \
  --artifact_uuid "representative image's artifacts[0].uuid" \
  --prompt "Resident Evil 4 style European medieval village, dilapidated stone houses, burning bonfire, thick fog, dead trees, horror atmosphere, realistic style" \
  --description "This element represents the iconic abandoned European village from Resident Evil 4, filled with horror atmosphere. Use with character references and night, dark description words, suitable for horror image generation. Reference image is a recreation of the original RE4 game village scene." \
  --accessibility "PUBLIC"
```

### After Successful Creation

After successful creation, API returns `tcp_uuid`. Inform user:
- Element UUID (tcp_uuid), for future updates
- How to reference in make_image: `/RE4 Village`
- Example usage: `npx -y @talesofai/neta-skills@latest make_image --prompt "@Ada Wong, /RE4 Village, night, battle stance" --aspect "3:4"`

---

## Related Documentation

- [Elementum Update Guide](./elementum-update.md) - Post-creation modification workflow
- [Field Reference Manual](./elementum-field-guide.md) - Detailed description of all fields

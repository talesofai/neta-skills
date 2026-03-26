# Best Practices for Video Generation

Applies to the `make_video` command.

**User-uploaded stills:** `make_video --image_source` expects an **image URL** string. After **`upload`**, use the artifact’s **`url`** field from the command output (not the bare UUID). See [Media upload](./media-upload.md).

---

## Prompt principles

### 1. Concrete actions

Describe **specific actions**, not abstract concepts.

❌ **Too abstract:**

```text
Make her move
```

✅ **Concrete:**

```text
The character gently waves her hand and her hair moves softly in the wind.
```

### 2. Moderate complexity

Avoid long chains of complex actions.

❌ **Too complex:**

```text
She waves, turns around, jumps, then smiles, hair flying and clothes fluttering.
```

✅ **Single focus:**

```text
She gently waves, hair lightly swaying, with a warm smile on her face.
```

### 3. Implicit timing

You can hint at speed and pacing through wording.

✅ **With speed hints:**

```text
Her hair moves slowly in the breeze.
Her eyes slowly turn to the side.
She blinks gently.
```

---

## Model selection

| Model    | Typical time | Use case                         |
|----------|--------------|----------------------------------|
| `model_s`| 5–10 minutes | Quick iteration, simple actions  |
| `model_w`| 10–20 minutes| Final renders, complex motions   |

**Recommendation:** Use `model_s` to iterate quickly, and switch to `model_w` for the final, high‑quality version once you’re satisfied.

---

## Common action prompts

### Head movement

- “Gently nods”
- “Turns head to the side”
- “Tilts head slightly”
- “Looks up at the sky”
- “Looks down in thought”

### Facial expressions

- “Warm smile”
- “Blinks slowly”
- “Surprised expression”
- “Blushes shyly”
- “Determined gaze”

### Hand/arm actions

- “Waves goodbye”
- “Hands clasped together”
- “Points into the distance”
- “Brushes hair back”
- “Clenches fist”

### Body actions

- “Turns around”
- “Takes a step forward”
- “Jumps lightly”
- “Stretches both arms”

### Hair/clothing

- “Hair flowing in the wind”
- “Skirt swaying”
- “Cape fluttering”
- “Strands of hair moving softly”

### Magic/effects

- “Light glows in her hands”
- “Magic particles orbit around her”
- “Starlight flickers”
- “Energy pulses”

---

## Common use cases

### Animated character illustration

```bash
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "https://example.com/character.jpg" \
  --prompt "The character breathes softly, hair moving in the wind, warm smile, eyes blinking gently." \
  --model "model_s"
```

### Animated wallpaper

```bash
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "https://example.com/scenery.jpg" \
  --prompt "The starry sky slowly rotates, shooting stars pass by, dreamy glowing particles, calm and peaceful." \
  --model "model_w"
```

### Cover animation

```bash
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "https://example.com/cover.jpg" \
  --prompt "Title text glows softly, background particles drift, cinematic feel." \
  --model "model_s"
```

### Full image‑to‑video workflow

```bash
# 1. Generate an image (16:9 works well for video)
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Dreamy starry sky background, shooting stars, deep blue tone." \
  --aspect "16:9"

# 2. Retrieve the image URL from the output

# 3. Generate video
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<IMAGE_URL>" \
  --prompt "The starry sky slowly rotates, shooting stars pass by." \
  --model "model_w"
```

---

## Prompt comparisons

### ❌ Too many actions

```text
She waves, turns, jumps, then smiles, hair flying and clothes fluttering.
```

### ✅ Focused single action

```text
She gently waves, hair lightly swaying, with a smile on her face.
```

### ❌ Abstract description

```text
Make her more lively.
```

### ✅ Concrete description

```text
She slowly blinks, the corners of her mouth lifting slightly, strands of hair swaying in the breeze.
```

---

## Image preparation tips

### Good candidate images

- Clear subject silhouette.
- Character or key object occupies the main area of the frame.
- Relatively simple background.
- High resolution (at least 512px on the shortest side).

### Poor candidates

- Very busy multi‑character scenes.
- Subject is too small.
- Overly complex backgrounds.
- Low‑resolution or blurry images.

---

## FAQ

### Q: The motion looks unnatural. What can I do?

**A:**

1. Simplify the action description; only describe 1–2 actions at a time.
2. Use words like “gently”, “slowly”, “softly”.
3. Avoid very rapid or violent motion.
4. Try `model_w` for better temporal quality.

### Q: The video differs too much from the source image.

**A:**

1. Avoid describing content that conflicts with the original image.
2. Don’t ask for large positional changes.
3. Focus on subtle motion (breathing, blinking, slight movement).

### Q: Generation takes too long.

**A:**

1. Use `model_s` during experimentation.
2. Avoid submitting many long jobs during peak times.
3. Wait for one job to finish before starting the next, if possible.

---

## Related docs

- [Image generation](./image-generation.md) — generating still images for video conversion.
- [Media upload](./media-upload.md) — using local stills as `image_source`.
- [Song MV](./song-mv.md) — combining songs and videos to build full music videos.


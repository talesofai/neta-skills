# Best Practices for Song MVs

Combine song generation and video generation to create full music videos.

---

## Workflow

```text
1. Generate song → 2. Design MV visuals → 3. Generate cover/key frames → 4. Generate video clips → 5. Assemble
```

---

## Step‑by‑step

### 1. Generate the song

```bash
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Upbeat J‑Pop, energetic and youthful, mid‑fast tempo, electronic synths" \
  --lyrics "[lyrics content...]"
```

### 2. Design MV visual concept

Decide the visual direction based on song style:

| Song style | Visual style        | Color palette            |
|------------|---------------------|--------------------------|
| J‑Pop      | Youthful, energetic | Bright, pastel/pink      |
| Folk       | Fresh, natural      | Warm, earth tones        |
| EDM        | Futuristic          | Cool tones, neon         |
| Ballad     | Romantic, gentle    | Soft, desaturated tones  |
| Rock       | Dynamic, intense    | High contrast            |

### 3. Generate MV cover

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Design a cover image based on the song theme, 16:9 landscape, suitable as video thumbnail" \
  --aspect "16:9"
```

### 4. Generate video clips

```bash
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<COVER_IMAGE_URL>" \
  --prompt "Dynamic effects matching the song mood, such as drifting particles and light changes" \
  --model "model_w"
```

---

## Full examples

### Youthful theme song MV

```bash
# 1. Generate song
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Youthful J‑Pop, bright and energetic, electronic synths, about friendship and dreams" \
  --lyrics "[Verse 1]
  Morning sunlight on the window
  Breeze on a familiar street
  ..."

# 2. Generate main MV visual
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "A teenage girl on a rooftop under blue sky and white clouds, school uniform skirt swaying, sunlight and hope, anime style" \
  --aspect "16:9"

# 3. Generate dynamic effect
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<IMAGE_URL_FROM_PREVIOUS_STEP>" \
  --prompt "Clouds drift slowly, skirt sways gently, hair moving in the wind, sunlight sparkling" \
  --model "model_w"
```

### Ballad MV

```bash
# 1. Generate song
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Gentle ballad, piano accompaniment, slow tempo, light sadness" \
  --lyrics "[lyrics content...]"

# 2. Generate atmosphere image
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Rainy night street, raindrops under streetlights, a lone figure, deep blue tones, cinematic feel" \
  --aspect "16:9"

# 3. Generate dynamic effect
npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<IMAGE_URL>" \
  --prompt "Raindrops falling slowly, streetlight flickering slightly, misty air" \
  --model "model_w"
```

---

## Multi‑scene MVs

For full MVs, you can generate multiple scenes:

```bash
# Scene 1: Verse
npx -y @talesofai/neta-skills@latest make_image --prompt "Scene 1 description" --aspect "16:9"
npx -y @talesofai/neta-skills@latest make_video --image_source "<URL1>" --prompt "Scene 1 motion"

# Scene 2: Chorus
npx -y @talesofai/neta-skills@latest make_image --prompt "Scene 2 description, more intense atmosphere" --aspect "16:9"
npx -y @talesofai/neta-skills@latest make_video --image_source "<URL2>" --prompt "Scene 2 motion with stronger effects"

# Scene 3: Bridge
npx -y @talesofai/neta-skills@latest make_image --prompt "Scene 3 description, emotional shift" --aspect "16:9"
npx -y @talesofai/neta-skills@latest make_video --image_source "<URL3>" --prompt "Scene 3 motion"
```

---

## Matching visuals to music

| Song section       | Visual suggestion                       |
|--------------------|-----------------------------------------|
| Verse              | Calm scenes, subtle motion              |
| Pre‑Chorus         | Rising tension, increasing motion       |
| Chorus             | Emotional peak, richest visual effects  |
| Bridge             | Emotional twist, visual changes         |
| Outro              | Fade‑out, soft ending                   |

---

## Prompt pairing

### Upbeat tracks

- **Images:** “Bright colors, sunlight, smiles, open spaces.”
- **Video:** “Light, playful motion, sparkling particles, energetic dynamics.”

### Ballads

- **Images:** “Soft tones, quiet scenes, introspective expressions.”
- **Video:** “Slow movement, subtle lighting shifts.”

### Epic tracks

- **Images:** “Strong contrast, dynamic poses, dramatic lighting.”
- **Video:** “Powerful motion, particle effects, sense of energy.”

---

## Technical tips

### Resolution

- Use `16:9` aspect ratio for images.
- Works well for mainstream video platforms.

### Local cover or key art

If the user already has a cover image file, **`upload`** it and pass the returned **`url`** into `make_video --image_source` (or use `ref_img-<uuid>` in `make_image` when compositing). Details: [Media upload](./media-upload.md).

### Model selection

- Prototyping: `model_s` (faster).
- Final shots: `model_w` (higher quality).

### Duration planning

- Individual clips: typically 5–15 seconds.
- Full MV: combine multiple clips in editing.

---

## FAQ

### Q: How to match video rhythm to the music?

**A:**

1. Plan scene transitions according to BPM.
2. Use richer dynamics during the chorus.
3. Stronger motion for fast sections.
4. Softer, slower motion for slow sections.

### Q: How to connect multiple scenes?

**A:**

**A:**

1. Keep visual style consistent.
2. Use similar color palettes.
3. Design transition shots.
4. Use fades (fade‑in, fade‑out) between scenes in editing.

### Q: How to save generation time?

**A:**

1. Use `model_s` while exploring.
2. Reserve `model_w` for only the most important scenes.
3. Generate multiple static images in parallel.
4. Generate videos sequentially to avoid long queues.

---

## Related docs

- [Song generation](./song-creation.md) — generating songs and lyrics.
- [Video generation](./video-generation.md) — image‑to‑video techniques.


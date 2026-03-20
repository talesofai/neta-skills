# Best Practices for Song Generation

Applies to the `make_song` command.

---

## Prompt structure

**Recommended format:**

```text
[Musical style] + [Mood/atmosphere] + [Tempo/speed] + [Instruments/elements] + [Theme/scene]
```

**Example:**

```text
Upbeat J‑Pop style, energetic and youthful, mid‑fast tempo, electronic synths and drums, theme about friendship and dreams.
```

---

## Style references

| Style   | Example description                                                    |
|---------|------------------------------------------------------------------------|
| J‑Pop   | “Upbeat J‑Pop, youthful energy, electronic synths”                    |
| Folk    | “Gentle city folk, guitar backing, fresh and natural”                 |
| EDM     | “Energetic electronic dance, strong beat, futuristic vibe”            |
| Rock    | “Passionate rock, electric guitar solo, powerful”                     |
| Classical | “Elegant piano piece, slow tempo, romantic atmosphere”             |
| R&B     | “R&B, lazy vocal tone, city night mood”                               |
| Chinese‑style | “Chinese traditional style, guzheng and flute, poetic and flowing” |

---

## Mood/atmosphere vocabulary

| Mood     | Example phrases                                  |
|----------|--------------------------------------------------|
| Happy    | “Full of energy”, “bright sunshine”, “uplifting” |
| Sad      | “Gentle sadness”, “nostalgic”, “rainy night”     |
| Romantic | “Soft and sweet”, “under the moonlight”, “first love” |
| Epic     | “Blood‑pumping”, “fighting spirit”, “never give up” |
| Calm     | “Peaceful and quiet”, “morning forest”, “meditative” |
| Mysterious | “Mysterious”, “ancient legend”, “magical atmosphere” |

---

## Lyrics format template

```text
[Verse 1]
Main verse, sets up the story
4–8 lines, rhyming recommended

[Pre-Chorus]
Build‑up section before chorus
2–4 lines

[Chorus]
Chorus, emotional peak, hook
4–8 lines, highly repetitive and catchy

[Verse 2]
Second verse, continues the story
4–8 lines

[Chorus]
Repeat the chorus

[Bridge]
Bridge, emotional twist or climax
2–4 lines

[Chorus]
Final chorus (optionally modulated)

[Outro]
Ending, fade‑out
2–4 lines
```

---

## Lyrics example

```text
[Verse 1]
Morning sunlight falls upon the window
A gentle breeze through familiar streets
I think of your smiling face from yesterday
Warm feelings rise within my heart

[Pre-Chorus]
Time quietly flows on
Our story keeps unfolding

[Chorus]
We walk through spring, summer, autumn, winter
Hand in hand, seeing all the world’s scenery
No matter how distant the future may be
This friendship will never change

[Verse 2]
After-school corner of a small café
Sharing all our different dreams
You say you want to be a singer
I say I want to travel the world

[Chorus]
… (repeat)

[Bridge]
Even if one day we go our separate ways
These memories will be treasured forever

[Chorus]
… (repeat)

[Outro]
Thank you for every day we spent together
Our story will keep being written
```

---

## Common use cases

### Character theme song

```bash
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Character theme song, J‑Pop style, lively and cute, magical girl vibe, electronic synths, bright tempo" \
  --lyrics "[lyrics content...]"
```

### Background music

```bash
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Soft piano background music, calm and peaceful, suitable for reading, gentle tempo" \
  --lyrics "[For instrumental tracks you can omit lyrics or use simple humming]"
```

### Battle track

```bash
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Epic battle track, rock style, electric guitars, strong drums, blood‑pumping" \
  --lyrics "[Verse 1]
  Burn with fighting spirit
  Breaking through the darkness to dawn
  ..."
```

### Ballad

```bash
npx -y @talesofai/neta-skills@latest make_song \
  --prompt "Gentle ballad, folk style, guitar backing, fresh and natural, lightly melancholic" \
  --lyrics "[Verse 1]
  After the rain, the streets glisten
  Walking alone, listening to echoes
  ..."
```

---

## Lyric‑writing tips

### 1. Rhyme

Rhyming at line ends improves flow:

```text
Morning sunlight falls upon the pane
A gentle breeze down the old main lane
…
```

### 2. Concrete imagery

Prefer concrete imagery over abstract statements:

- ❌ “I am happy”
- ✅ “Sunlight on the window, breeze through the street”

### 3. Emotional progression

Let emotion build from verse to chorus:

```text
Verse: tell the story
Pre-Chorus: build tension
Chorus: emotional release
```

### 4. Repeated hooks

Choruses should have highly memorable lines:

```text
We walk through spring, summer, autumn, winter
Hand in hand, seeing all the world’s scenery
```

---

## Parameter limits

| Parameter | Constraint        |
|----------|-------------------|
| prompt   | 10–2000 characters|
| lyrics   | 10–3500 characters|

---

## FAQ

### Q: What if the lyrics are too long?

**A:**

- Trim to within 3500 characters.
- Keep the most important verses and choruses.
- Remove some repeated sections if necessary.

### Q: How to generate instrumental tracks?

**A:**

- Use very simple “la‑la” style syllables in lyrics.
- Or provide a short scene/mood description instead.
- Focus on musical style and atmosphere in `prompt`.

### Q: How to keep style consistent across songs?

**A:**

- Save successful prompt templates.
- Reuse similar style descriptors and vocabulary.
- Refer to previous successful tracks in the same style.

---

## Related docs

- [Song MV](./song-mv.md) — combining songs and videos into a full MV.


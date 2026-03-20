# Best Practices for Hashtag Research

Applies to the `get_hashtag_info`, `get_hashtag_characters`, and `get_hashtag_collections` commands.

---

## Workflow

```text
1. Get hashtag info → 2. Inspect popular characters → 3. Analyze featured collections → 4. Decide creative direction
```

---

## Hashtag information

### Basic info

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name"
```

**Response includes:**

- Tag lore (worldbuilding and setting).
- Activity details.
- Popularity metrics.
- Subscription count.

### Using lore

The `lore` section contains worldbuilding and setting information and is a critical reference for creation:

```json
{
  "lore": [
    {
      "name": "Setting name",
      "category": "Setting category",
      "description": "Detailed description..."
    }
  ]
}
```

**Applications:**

- Create content that fits the tag’s world and lore.
- Reuse keywords and terminology from lore in prompts.
- Keep fan works consistent with official setting.

---

## Character research

### Fetch popular characters

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters \
  --hashtag "tag_name" \
  --sort_by "hot" \
  --page_size 20
```

### Fetch newest characters

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters \
  --hashtag "tag_name" \
  --sort_by "newest" \
  --page_size 20
```

### Filter by type

```bash
# OC characters only
npx -y @talesofai/neta-skills@latest get_hashtag_characters \
  --hashtag "tag_name" \
  --parent_type "oc"

# Elementums only
npx -y @talesofai/neta-skills@latest get_hashtag_characters \
  --hashtag "tag_name" \
  --parent_type "elementum"
```

### Analyzing character traits

```bash
# 1. Fetch character list
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "tag_name" > characters.json

# 2. Analyze traits of top characters:
#   - Hair styles/colors
#   - Clothing styles
#   - Common visual elements

# 3. Get details of top characters
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Popular Character Name"
```

---

## Featured collections analysis

### Fetch featured works

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name"
```

**Response includes:**

- Featured works list.
- Cover images.
- Creator info.
- Like counts, etc.

### Analyze popular works

```bash
# 1. Fetch collections
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name" > collections.json

# 2. Analyze high‑like works:
#   - Characters used
#   - Visual styles
#   - Composition patterns
#   - Color palettes

# 3. Summarize common success factors
```

### Learn creative techniques

From featured collections you can learn:

- Popular composition patterns.
- Common color schemes.
- Popular character combos.
- Frequently used scene settings.

---

## End‑to‑end research example

### Example: researching a new hashtag before creating

```bash
# 1. Understand overall tag info
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "Magical Girl"

# 2. View top 20 characters
npx -y @talesofai/neta-skills@latest get_hashtag_characters \
  --hashtag "Magical Girl" \
  --sort_by "hot" \
  --page_size 20

# 3. View featured works
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "Magical Girl"

# 4. Get details of interesting characters
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Character Name"

# 5. Create based on research
npx -y @talesofai/neta-skills@latest make_image --prompt "Prompt consistent with the tag's tone and lore..."
```

---

## Research notes

### Note‑taking template

```markdown
# Hashtag research: <Tag Name>

## Basic info
- Subscriptions: xxx
- Popularity: xxx
- Core settings: ...

## Top 5 characters
1. Character name — traits...
2. Character name — traits...
3. ...

## Popular elements
- Hair: ...
- Clothing: ...
- Props: ...
- Backgrounds: ...

## Creative directions
Based on research, plan to create...
```

### Saving research data

```bash
mkdir -p research/tag_name
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name" > research/tag_name/info.json
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "tag_name" > research/tag_name/characters.json
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name" > research/tag_name/collections.json
```

---

## Common use cases

### New character design research

```bash
# 1. Research existing characters to avoid duplication
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "character traits" \
  --parent_type "character"

# 2. Explore popular characters under related tags
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "RelatedTag"

# 3. Use findings to design a unique new character
```

### Planning a themed event

```bash
# 1. Research lore and settings of a tag
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name"

# 2. Analyze themes of featured works
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name"

# 3. Plan a series of event content aligned with the tag
```

### Competitive analysis

```bash
# 1. Collect multiple popular tags
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "Tag1"
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "Tag2"

# 2. Compare popular characters across tags
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "Tag1" --sort_by "hot"
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "Tag2" --sort_by "hot"

# 3. Analyze differences and opportunity areas
```

---

## Research tips

### Discover emerging tags

- Watch for `newest` characters under tags.
- Track tags with rapidly increasing activity.
- Notice collaboration or crossover tags.

### Identify trends

- Repeat research for the same tag over time.
- Observe changes in popular characters.
- Track how featured works’ styles evolve.

### Efficient research

- Go broad first, then dive deep.
- Use pagination to fetch full datasets.
- Cache results for tags you research often.

---

## FAQ

### Q: How to pick suitable tags to create for?

**A:**

1. Browse lists of popular tags.
2. Compare subscription counts.
3. Choose tags whose tone and style match your strengths.
4. Consider competition (very hot tags can be crowded).

### Q: Tag lore is long — how to quickly extract key points?

**A:**

1. Focus on core settings (world background, constraints).
2. Extract keywords and key terms.
3. Note重要 relationships between factions/characters.
4. Pay attention to taboos/limits.

### Q: How to judge a tag’s popularity trend?

**A:**

1. Compare data from different points in time.
2. Watch how often new characters appear.
3. Note how frequently featured collections are updated.
4. Track changes in subscription counts.

---

## Related docs

- [Character search](./character-search.md) — get detailed character info.
- [Image generation](./image-generation.md) — create content informed by your research.


# Best Practices for Character Search

Applies to the `search_character_or_elementum` and `request_character_or_elementum` commands.

---

## Workflow

```text
1. Fuzzy search → 2. Confirm character → 3. Fetch details → 4. Use canonical info
```

---

## Search strategies

### Exact search

When you know the exact character name:

```bash
# Use exact sorting
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "Full Character Name" \
  --sort_scheme "exact" \
  --parent_type "character"
```

### Fuzzy search

When you only remember part of the name or some keywords:

```bash
# Use relevance‑based sorting
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "keywords" \
  --sort_scheme "best" \
  --parent_type "both"
```

### Pagination

```bash
# Page 1
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "magical girl" \
  --page_index 0 \
  --page_size 10

# Page 2
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "magical girl" \
  --page_index 1 \
  --page_size 10
```

---

## Parameter choices

### parent_type

| Value       | Meaning                    | Use case                       |
|------------|----------------------------|--------------------------------|
| `character`| Characters only            | You know it’s an OC/character |
| `elementum`| Elementums only            | You know it’s a style/element |
| `both`     | Search both types          | When you’re unsure (default)  |

### sort_scheme

| Value   | Meaning          | Use case                 |
|---------|------------------|--------------------------|
| `exact` | Exact matching   | Known full name          |
| `best`  | Relevance ranking| Fuzzy search (default)   |

---

## Fetching character details

### By name

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "character_name"
```

### By UUID

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --uuid "character-uuid"
```

### Example response

```json
{
  "detail": {
    "type": "character",
    "uuid": "xxx-xxx-xxx",
    "name": "Character Name",
    "age": "18",
    "interests": "Singing, dancing",
    "persona": "Cheerful and lively",
    "description": "Detailed description...",
    "occupation": "Student",
    "avatar_img": "https://...",
    "header_img": "https://..."
  }
}
```

---

## Common use cases

### Generate images based on a character

```bash
# 1. Get canonical character info
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Hatsune Miku"

# 2. Generate image
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@Hatsune Miku, wearing her iconic outfit, holding a leek, on a concert stage" \
  --aspect "3:4"
```

### Tag‑based character research

```bash
# 1. Get characters under a tag
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "HotTag" --sort_by "hot"

# 2. Fetch details for interesting characters
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Character Name"

# 3. Analyze traits to decide creative direction
```

### Elementum lookup

```bash
# Search style elementums
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "cyberpunk" \
  --parent_type "elementum"

# Get elementum details
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Cyberpunk Style"
```

---

## Search tips

### Use aliases/nicknames

Some characters have multiple names:

```bash
# Try different variants
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "Full Character Name" \
  --sort_scheme "exact"

npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "Nickname" \
  --sort_scheme "exact"
```

### Combine keywords

```bash
# Traits + type
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "pink hair magical girl" \
  --parent_type "character"

# Work title + character
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "SeriesName CharacterName" \
  --sort_scheme "exact"
```

### Use hashtags to narrow down

```bash
# 1. Inspect hashtag
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name"

# 2. Then list characters under the hashtag
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "tag_name"
```

---

## Caching data

### Cache character details

```bash
# First query and save
npx -y @talesofai/neta-skills@latest request_character_or_elementum \
  --name "character_name" \
  > character_cache/character_name.json

# Later, reuse cached data
cat character_cache/character_name.json
```

### Cache search results

```bash
# Save search results
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "keyword" \
  > search_cache/keyword.json
```

---

## FAQ

### Q: What if I can’t find a character?

**A:**

1. Try different name variants (full name, nickname, localized name, etc.).
2. Use fuzzy search (`sort_scheme="best"`).
3. Double‑check spelling.
4. Confirm the character actually exists in the database.

### Q: How to distinguish characters with the same name?

**A:**

1. Look at detailed descriptions.
2. Compare avatars.
3. Check associated tags/works.
4. Use more specific search keywords (work title + character name).

### Q: What if character info is incomplete?

**A:**

1. Some characters may have sparse data.
2. Combine multiple sources when possible.
3. Use the `avatar_img` as strong visual reference.
4. Build on top of existing fields in your own way.

---

## Best‑practice summary

1. **Search before creating** — use canonical data where possible.
2. **Cache frequently used characters** — avoid repeated API calls.
3. **Prefer exact match** — when you know the full name, use `sort_scheme="exact"`.
4. **Save UUIDs** — they’re the most reliable way to fetch details later.
5. **Combine with tags** — use the hashtag system to discover related characters.

---

## Related docs

- [Image generation](./image-generation.md) — generate character images from canonical info.


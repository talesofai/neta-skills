# Best Practices for Character Search (Community)

Applies to the `search_character_or_elementum` and `request_character_or_elementum` commands when used from community scenarios.

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

When you only remember part of the name or descriptive keywords:

```bash
# Use relevance‑based sorting
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "keywords" \
  --sort_scheme "best" \
  --parent_type "both"
```

### Pagination

```bash
# Page 0
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "magical girl" \
  --page_index 0 \
  --page_size 10

# Page 1
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
| `character`| Characters only            | Searching OC characters        |
| `elementum`| Style elementums only      | Searching styles/elements      |
| `both`     | Search both                | When type is unknown (default) |

### sort_scheme

| Value   | Meaning          | Use case                 |
|---------|------------------|--------------------------|
| `exact` | Exact matching   | Known full name          |
| `best`  | Relevance ranking| Fuzzy search (default)   |

---

## Fetching details

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

## Common community use cases

### Generate community images by character

```bash
# 1. Get canonical character information
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Hatsune Miku"

# 2. Create illustration to post
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@Hatsune Miku, wearing her iconic outfit, holding a leek, stage background" \
  --aspect "3:4"
```

### Tag‑based character research

```bash
# 1. Get characters under a tag
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "PopularTag" --sort_by "hot"

# 2. Fetch details for interesting characters
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Character Name"

# 3. Decide which characters to use in new community posts
```

### Style element lookup for community content

```bash
# Search style elementums
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "cyberpunk" \
  --parent_type "elementum"

# Get element details
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Cyberpunk Style"
```

---

## Search tips

### Aliases and nicknames

Some characters may be known under multiple names:

```bash
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "Full Character Name" \
  --sort_scheme "exact"

npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "Nickname" \
  --sort_scheme "exact"
```

### Combining keywords

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

### Filter via hashtags

```bash
# 1. Inspect hashtag
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name"

# 2. List characters under that hashtag
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "tag_name"
```

---

## Caching in community tools

### Cache character info

```bash
# Save once
npx -y @talesofai/neta-skills@latest request_character_or_elementum \
  --name "character_name" \
  > character_cache/character_name.json

# Reuse locally
cat character_cache/character_name.json
```

### Cache search results

```bash
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
  --keywords "keyword" \
  > search_cache/keyword.json
```

---

## FAQ

### Q: Why can’t I find a character?

**A:**

1. Try different name variants (including localized names).
2. Use fuzzy search (`sort_scheme="best"`).
3. Check for typos.
4. Confirm the character is actually in the database.

### Q: How do I distinguish characters with the same name?

**A:**

1. Read the detailed description.
2. Compare avatar images.
3. Check associated tags/works.
4. Use more specific search keywords (series name + character).

### Q: What if information is incomplete?

**A:**

1. Some entries may have sparse metadata.
2. Combine with other sources when needed.
3. Use `avatar_img` as a reliable visual reference.
4. Build your own description based on existing fields.

---

## Best practices summary

1. **Search before posting** — use canonical character data in community content.
2. **Cache frequently used characters** to reduce repeated API calls.
3. **Use exact sorting** where you know the full name.
4. **Save UUIDs** for stable future lookups.
5. **Leverage tags** to discover related characters.

---

## Related docs

- [Image generation](./image-generation.md) — generating character images for posts.


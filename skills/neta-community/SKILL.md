---
name: neta-community
description: Neta API community skill — browse interactive feeds, view collection details, like and interact with content, and browse content by tags and characters in a community context. Use this skill when the user wants to “see what people are making”, “scroll the feed”, or “interact with works”. Do not use it for taxonomy/keyword‑level research (handled by neta-suggest) or for generating images/videos/songs (handled by neta-creative).
---

# Neta Community Skill

Used to interact with the Neta API for community feed browsing, interactions, and tag‑based queries.

## Instructions

1. For tasks like **“see what’s in the community”**, **“scroll the feed”**, or **“like or interact with works”**, use this skill as follows:
2. Recommended flow:
   - Use the feed command to fetch a list of recommended content.
   - Use the collection‑detail command to inspect a specific work.
   - Perform likes and other interactions on works as needed.
3. If the user needs **systematic research or complex filtering by categories/keywords**, switch to `neta-suggest`.
4. If the user wants to **create new content** (images/videos/songs/MVs), switch to `neta-creative`.

## Commands

### Collection

**Get collection details**

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "collection-uuid"
```

📖 [Detailed guide](./references/interactive-feed.md)

### Community interactions

```bash
npx -y @talesofai/neta-skills@latest like_collection --uuid "target collection UUID"
```

📖 [Detailed guide](./references/social-interactive.md)

### Tag queries

**Get tag info**

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "tag_name"
```

📖 [Detailed guide](./references/hashtag-research.md) — research flow and analysis methods.

**Get characters under a tag**

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "tag_name" --sort_by "hot"
```

**Get collections under a tag**

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name"
```

### Character queries

**Search characters**

```bash
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "keywords" --parent_type "character" --sort_scheme "exact"
``]

📖 [Detailed guide](./references/character-search.md) — search strategies and parameter choices.

**Get character details**

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "character_name"
```

**Query by UUID**

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --uuid "uuid"
```

## Reference docs

| Scenario                 | Doc                                               |
|--------------------------|---------------------------------------------------|
| 💬 Community interactions| [social-interactive.md](./references/social-interactive.md) |
| 🏷️ Tag research         | [hashtag-research.md](./references/hashtag-research.md)   |
| 👤 Character queries     | [character-search.md](./references/character-search.md)   |

## Usage tips

1. **Browse before interacting**: use the feed first to understand the overall content landscape, then interact (like, etc.) with the works that matter.
2. **Leverage tags**: combining tag queries with character searches quickly focuses on the most relevant set of works.
3. **Combine with research/creation skills**: use `neta-suggest` for deeper tag/category research, and `neta-creative` when you want to create derivative works based on community content.


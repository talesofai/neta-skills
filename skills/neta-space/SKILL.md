---
name: neta-space
description: "Neta API space and world-view skill — list available spaces, search by hashtag, view space hierarchy and lore, and retrieve characters or collections within a space. Use this skill when the user talks about worlds/spaces/universes/scenes, or wants to explore characters and gameplay based on space and activity structure. Do not use it for concrete media creation (handled by neta-creative)."
---

# Neta Space Skill

Used to interact with the Neta API to browse space‑level content.

## Instructions

Follow a progressive-disclosure approach — start broad and drill down only as the user requests more detail:

1. **Start with a high-level overview**: For tasks like “what spaces exist?”, list all spaces first (`list_spaces`). Present a concise summary before offering to drill deeper.
2. **Drill into a specific space on request**: When the user selects or asks about a space, fetch its details (lore, activities, metrics) via `get_hashtag_info`.
3. **Explore sub-spaces and collections only when needed**: Fetch sub-spaces (`list_space_topics`) and their official/user collections only if the user wants to go deeper into the hierarchy.
4. **Fetch characters and playable content last**: Retrieve characters and gameplay content (`get_hashtag_characters`, `get_hashtag_collections`) only when explicitly requested or contextually relevant.
5. **Hand off creation tasks**: If the user says “now generate an image/video/song for this space”, first collect the relevant space/collection info here, then switch to `neta-creative` for creation.

## Space concepts

> A space is a themed collection of gameplay experiences — a scene where content is produced and consumed.

## Terminology

- **Hashtag**: tag/space. Used to build worlds and organize communities.
- **Collection**: browseable/remixable/editable content; can also refer to events, scenes, or gameplay within a space.
- **Activity**: a special hashtag driven by official events.

## Space structure

- Space
  - Lore/worldbuilding (lore)
  - Characters
  - Collections
  - Sub‑spaces
    - official_collections
    - collections

## Workflow

1. **List all spaces**: `list_spaces`
   - Validate that the response contains at least one space before proceeding.
2. **Get space details**: `get_hashtag_info`
   - Confirm the hashtag exists in the space list. If not found, suggest similar hashtags or re-list spaces.
3. **Get sub-spaces**: `list_space_topics`
   - Requires a valid `space_uuid` from step 1 or 2. If the space has no sub-spaces (`topic_count` is 0), skip this step and proceed directly to content retrieval.
4. **Get content in a space or sub-space**: `get_hashtag_collections`, `get_hashtag_characters`
   - If a collection or character query returns empty results, inform the user and suggest trying a different space or hashtag.

## List available spaces

```bash
npx -y @talesofai/neta-skills@latest list_spaces
```

**Response fields**

- `space_uuid`: UUID of the space
- `name`: space name
- `main_hashtag_name`: main hashtag
- `topic_count`: number of sub‑spaces (topics)

## Get detailed space info

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "space_tag_name"
```

**Response includes:**

- Tag lore (worldbuilding)
- Activity details
- Popularity metrics
- Subscription count

## Get sub‑spaces

```bash
npx -y @talesofai/neta-skills@latest list_space_topics --space_uuid "space UUID"
```

**Response includes:**

- `primary_topic`: main topic
- `topics`: list of sub‑spaces
  - `official_collections`

## Get characters in a space

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "space_tag_name" --sort_by "hot"
```

## Get scenes/events/content in a space

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "tag_name"
```

## Get detailed info for a specific gameplay

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "official_collections in topic | collections in hashtag"
```

## Content creation

For content creation within a space, use the dedicated creative skill:

```bash
npx skills add talesofai/neta-skills/skills/neta-creative
```


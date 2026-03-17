---
name: neta-space
description: Neta API space and world‑view browsing skill — browse worldbuilding, sub‑spaces, and playable content by space/hashtag. Use this skill when the user talks about worlds/spaces/universes/scenes, or wants to browse characters and gameplay based on space and activity structure. Do not use it for concrete media creation (handled by neta-creative).
---

# Neta Space Skill

Used to interact with the Neta API to browse space‑level content.

## Instructions

1. For tasks like **“what spaces/activities exist?”** or **“what is the structure and lore of a given space?”**, organize queries as follows:
2. Recommended workflow:
   - List all spaces.
   - For a chosen space, fetch its details (lore, activities, metrics).
   - Fetch sub‑spaces and their official/user collections.
   - If needed, fetch characters and playable content inside the space.
3. If the user says “now generate an image/video/song for this space”, first collect the relevant space/collection info here, then switch to `neta-creative` for creation.

## Prerequisites

Make sure the `NETA_TOKEN` environment variable is set.

Install the latest version of the Neta CLI:

```bash
neta-cli --version
0.8.0
```

```bash
npm i @talesofai/neta-skills@latest -g
```

```bash
pnpm add -g @talesofai/neta-skills@latest
```

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

- List all spaces: `list_spaces`
- Get space details: `get_hashtag_info`
- Get sub‑spaces: `list_space_topics`
- Get content in a space or sub‑space: `get_hashtag_collections`, `get_hashtag_characters`

## List available spaces

```bash
neta-cli list_spaces
```

**Response fields**

- `space_uuid`: UUID of the space
- `name`: space name
- `main_hashtag_name`: main hashtag
- `topic_count`: number of sub‑spaces (topics)

## Get detailed space info

```bash
neta-cli get_hashtag_info --hashtag "space_tag_name"
```

**Response includes:**

- Tag lore (worldbuilding)
- Activity details
- Popularity metrics
- Subscription count

## Get sub‑spaces

```bash
neta-cli list_space_topics --space_uuid "space UUID"
```

**Response includes:**

- `primary_topic`: main topic
- `topics`: list of sub‑spaces
  - `official_collections`

## Get characters in a space

```bash
neta-cli get_hashtag_characters --hashtag "space_tag_name" --sort_by "hot"
```

## Get scenes/events/content in a space

```bash
neta-cli get_hashtag_collections --hashtag "tag_name"
```

## Get detailed info for a specific gameplay

```bash
neta-cli read_collection --uuid "official_collections in topic | collections in hashtag"
```

## Content creation

For content creation within a space, use the dedicated creative skill:

```bash
npx skills add talesofai/neta-skills/skills/neta-creative
```


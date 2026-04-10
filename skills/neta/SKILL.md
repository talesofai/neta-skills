---
name: neta
description: Neta capability index and routing skill - help choose the appropriate Neta-related skill (neta-space / neta-creative / neta-adventure / neta-community / neta-suggest). Use this skill when you need to understand Neta's overall capabilities, decide which skill fits the current task, or migrate from older documentation that referenced the monolithic neta skill.
---

# Neta Skill

Used for **overview and routing** of Neta-related skills, rather than executing concrete commands directly.

> This skill used to be a "kitchen-sink" Neta interaction skill. It has now been split into multiple focused skills. Prefer using the skills listed below; use this skill only to understand the capability map or when migrating from older docs.

## Installing sub-skills

In environments that support `skills add`, install sub-skills as needed:

```bash
# Spaces and worldbuilding
npx skills add talesofai/neta-skills/skills/neta-space

# Creative content (images/videos/songs/MVs)
npx skills add talesofai/neta-skills/skills/neta-creative

# Community browsing and interactions
npx skills add talesofai/neta-skills/skills/neta-community

# Research and content suggestions
npx skills add talesofai/neta-skills/skills/neta-suggest

# Character creation and management
npx skills add talesofai/neta-skills/skills/neta-character

# Elementum (visual style/concept) creation and management
npx skills add talesofai/neta-skills/skills/neta-elementum

# Interactive story adventures (Adventure Campaigns)
npx skills add talesofai/neta-skills/skills/neta-adventure
```

## Instructions

1. **Identify the task type**: classify the user's need as one of: "space exploration", "content creation", "interactive story adventures", "community interaction", "research/recommendation", or "character creation/management".
2. **Choose the corresponding sub-skill**:
   - Spaces/worldbuilding/gameplay structure → use `neta-space`
   - Image/video/song/MV creation and idea deconstruction → use `neta-creative`
   - Crafting or playing AI-driven story campaigns (Adventure Campaigns) → use `neta-adventure`
   - Browsing feeds, viewing collection details, liking/interacting, community-centric views → use `neta-community`
   - Keyword/tag/category research and recommendation, progressive exploration from broad to narrow → use `neta-suggest`
   - Creating or managing anime/cultural IP/original characters (VTokens/TCP/OC) → use `neta-character`
   - Creating or managing visual style elements (scenes, props, clothing, poses, atmospheres, memes) → use `neta-elementum`
3. Use this skill only when boundaries are unclear or when you need to explain which sub-skill to pick.

**Region / fallback**: Device login is only supported when the CLI is using the **global** API host (see `NETA_API_BASE_URL` / `talesofai.com`). If the command errors with “not supported in the current region”, tell the user to authenticate via the **`NETA_TOKEN`** environment variable instead.

## Capability map and sub-skill overview

### 1. Spaces and worldbuilding: `neta-space`

Responsibilities:

- List all available spaces.
- Fetch worldbuilding (lore) for spaces/hashtags.
- Fetch sub-spaces, characters, and gameplay collections within a space.

Use when:

- The user talks about "worlds/universes/spaces/scene settings".
- They want to browse gameplay and content organized by spaces/activities.

See `skills/neta-space/SKILL.md` for full details.

### 2. Content creation: `neta-creative`

Responsibilities:

- Generate images, videos, songs, and MVs.
- Remove image backgrounds.
- Search and inspect characters (in a creation context).
- Deconstruct creative ideas from existing collections via `read_collection`.

Use when:

- The user wants to "create/edit images/videos/songs/MVs".
- They want to create based on character settings or stories.
- They want to analyze the creative intent behind an existing work.

See `skills/neta-creative/SKILL.md` for full details.

### 3. Interactive story adventures: `neta-adventure`

Responsibilities:

- Create and update Adventure Campaigns (`create_adventure_campaign`, `update_adventure_campaign`).
- List the current user's campaigns (`list_my_adventure_campaigns`).
- Load full campaign details for play mode (`request_adventure_campaign`).

Use when:

- The user wants to design, write, or refine an interactive story / narrative campaign with plot, tasks, and governing rules.
- They want to run or continue a storytelling session as DM plus character roleplay from an existing campaign UUID.

See `skills/neta-adventure/SKILL.md` for full details.

### 4. Community browsing and interactions: `neta-community`

Responsibilities:

- Fetch interactive recommendation feeds.
- View collection details (in a community context).
- Like/unlike or otherwise interact with content.
- Browse community content grouped by tags or characters.

Use when:

- The user says "show me what people are doing", "scroll the feed".
- They want to like or interact with specific works.

See `skills/neta-community/SKILL.md` for full details.

### 5. Research and recommendation engine: `neta-suggest`

Responsibilities:

- Keyword suggestions (`suggest_keywords`).
- Tag suggestions (`suggest_tags`).
- Category navigation and path validation (`suggest_categories` / `validate_tax_path`).
- Multi‑mode content feeds (`suggest_content`).

Use when:

- The user has no clear target and wants ideas/topics.
- They want to understand popular tags/category structure/content distribution.
- They need systematic research before creating content.

See `skills/neta-suggest/SKILL.md` for full details.

### 6. Character creation and management: `neta-character`

Responsibilities:

- Create new characters as VTokens (Virtual Tokens, TCP/OC).
- Update existing character profiles (visual appearance, backstory, persona).
- Query and search for characters.
- Generate character preview images before creation.

Use when:

- The user wants to "create a new character", "make an OC", or "design a character".
- The user wants to "modify character settings", "update character backstory", or "change character appearance".
- The user wants to "list my characters" or "search for characters".

See `skills/neta-character/SKILL.md` for full details.

### 7. Elementum (visual style/concept) creation and management: `neta-elementum`

Responsibilities:

- Create new Elementa (visual concepts) as VTokens (TCP/Elementum).
- Update existing Elementum settings (representative images, prompts, descriptions).
- Query and search for Elementa.
- Generate visual previews before Elementum creation.

Use when:

- The user wants to "create a visual element", "make an Elementum", or "encapsulate a style".
- The user wants to create reusable visual concepts (scenes, props, clothing, poses, atmospheres, memes).
- The user wants to "list my Elementa" or "search for Elementa".

See `skills/neta-elementum/SKILL.md` for full details.

## Migration notes (from legacy neta skill)

If you encounter older docs or scripts that call commands directly under `neta`, migrate them according to this table:

| Legacy capability                           | New skill        |
|---------------------------------------------|------------------|
| Space/tag lore and space browsing           | `neta-space`     |
| Image/video/song/MV creation                | `neta-creative`  |
| Interactive story / Adventure Campaigns     | `neta-adventure` |
| Collection details, feeds, likes/interacts  | `neta-community` |
| Keyword/tag/category/recommendation research| `neta-suggest`   |
| Character creation and management           | `neta-character` |
| Elementum (visual style/concept) creation   | `neta-elementum` |

For new development, always prefer the focused sub-skills and avoid adding new command examples directly to this skill.


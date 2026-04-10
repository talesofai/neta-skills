---
name: neta-character
description: Neta Character Forging Skill - Guides users through creating or updating anime/cultural IP/original character (OC) VTokens (Virtual Tokens, TCP). Includes visual preview, character documentation, backstory confirmation, and complete creative workflow. Use this skill when users want to create new characters, modify existing ones, or begin character design.
---

# Neta Character Skill

Guide users from inspiration to forging, completing the creation and management of exclusive character VTokens (Virtual Tokens, TCP/OC). Characters can be referenced in `make_image` via `@CharacterName` after creation.

> This skill requires the **neta-creative** skill to use `make_image` for visual previews.

## Command Usage

### Create Character

**Full Creation Flow (Recommended)**

Follow the three-stage workflow: "Visual Preview → Character Documentation → Confirmation".

📖 [Creation Guide](./references/character-creation.md) - Complete creative workflow and best practices

```bash
npx -y @talesofai/neta-skills@latest create_character \
  --name "Ada Wong" \
  --avatar_artifact_uuid "artifacts[0].uuid from make_image response" \
  --prompt "long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure" \
  --trigger "1girl, Ada Wong, black hair, red dress, spy, elegant, resident evil series" \
  --gender "female" \
  --age "28" \
  --occupation "spy" \
  --persona "Mysterious and calm, purpose unknown, moves between factions" \
  --interests "intelligence gathering, combat, precision machinery" \
  --description "Ada Wong, a mysterious spy with black hair and red dress. Her true identity is unknown, and she has repeatedly appeared as a middleman in Resident Evil incidents, maintaining an independent stance." \
  --accessibility "PUBLIC"
```

### Update Character

**Targeted Modifications (Only pass fields you want to change)**

📖 [Update Guide](./references/character-update.md) - Update scenarios and workflow

```bash
# Update visual appearance after regenerating image
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --avatar_artifact_uuid "new artifacts[0].uuid from make_image" \
  --prompt "updated visual feature description"

# Only update backstory
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --description "updated character backstory"

# Update multiple fields
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --persona "new personality description" \
  --interests "new interests" \
  --occupation "new occupation"
```

### Query Existing Characters

```bash
# List my characters (created by current user)
npx -y @talesofai/neta-skills@latest list_my_characters
npx -y @talesofai/neta-skills@latest list_my_characters --keyword "Ada" --page_size 10

# Search characters (global search, keyword matching)
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "character name" --parent_type "character"

# Get full character details (including tcp_uuid)
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "character name"
```

## Reference Documentation

| Scenario | Document |
|----------|----------|
| ✨ Character Creation Guide | [character-creation.md](./references/character-creation.md) |
| 🔧 Character Update Guide | [character-update.md](./references/character-update.md) |
| 📋 Field Reference Manual | [character-field-guide.md](./references/character-field-guide.md) |

## Usage Recommendations

1. **Preview before creating** - Use `make_image` to generate character preview images, confirm satisfaction before calling `create_character`; `avatar_artifact_uuid` is the `artifacts[0].uuid` from the preview
2. **Use plain text for previews** - In the `make_image` preview stage, use plain natural language descriptions without `@CharacterName` (since the character doesn't exist yet)
3. **trigger must be English** - `trigger` is the recognition anchor for image and language models; Chinese triggers significantly reduce recognition accuracy; should include gender terms, character name, prominent visual features, IP series
4. **prompt is visual only** - `prompt` only describes physical features, clothing, distinctive marks; exclude personality, story, background
5. **description is for humans and Agents** - `description` should include appearance summary + backstory, for Agents to understand character context in subsequent creations

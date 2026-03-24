---
name: neta-character
description: "Guides users through creating or updating anime, cultural IP, or original characters (OCs) as Virtual Tokens (VTokens/TCP) on the Neta platform. Walks through a three-stage workflow: visual preview, character documentation, and backstory confirmation. Use when users want to design a character, make a character sheet, build an OC, create an OC maker profile, or modify an existing character."
---

# Neta Character Skill

Guide users from inspiration to a finished character token. This skill handles creating and managing character Virtual Tokens (VTokens, also known as TCP or OCs) on the Neta platform. Once created, characters can be referenced in `make_image` via `@CharacterName`.

> This skill requires the **neta-creative** skill to use `make_image` for visual previews.

## Command Usage

### Create Character

**Full Creation Flow (Recommended)**

Follow the three-stage workflow: "Visual Preview → Character Documentation → Confirmation".

1. **Visual Preview** — Use `make_image` with a plain-text description to generate a preview image. Iterate until the look is right.
2. **Character Documentation** — Fill in identity fields (name, prompt, trigger, persona, backstory) and call `create_character` with the preview's `artifacts[0].uuid` as the avatar.
3. **Confirmation** — Review the created character profile and make any final adjustments via `update_character`.

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

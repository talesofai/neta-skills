# Character Creation Guide

Complete character forging workflow from inspiration to Token deployment.

---

## Creation Workflow Overview

```
Stage 1: Visual Preview
  └─ Describe character appearance in natural language → Generate preview with make_image
  └─ Iterate until visually satisfied

Stage 2: Character Documentation
  └─ Confirm trigger (English recognition tags)
  └─ Refine prompt (pure visual feature tags)
  └─ Fill in description (appearance summary + backstory)
  └─ Supplement character info (name, gender, age, occupation, personality, interests)

Stage 3: Confirmation
  └─ Show complete settings to user, confirm correctness
  └─ Call create_character with preview image's artifact_uuid
```

---

## Stage 1: Visual Preview

**Goal:** Give users an intuitive sense of character appearance, confirm satisfaction before documentation.

### Guiding Questions

Before generating images, guide users to clarify:

- Basic appearance (hair color, hairstyle, body type, skin tone)
- Clothing style (modern, ancient, sci-fi, fantasy, etc.)
- Distinctive marks (tattoos, weapons, accessories, unique eyes, etc.)
- Reference style (reference characters or IP series)

### Image Generation Guidelines

For preview stage **only use plain text descriptions**, no `@CharacterName` or `/element` references (character doesn't exist yet).

```bash
# Full body preview (recommended for first time)
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Long black hair, red qipao dress, blue eyes, thigh gun holster, slender figure, cold expression, white background, full body, anime style" \
  --aspect "3:4"

# Portrait close-up
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "Long black hair, blue eyes, cold expression, delicate features, portrait close-up, anime style" \
  --aspect "1:1"

# Three views (after appearance confirmation)
npx -y @talesofai/neta-skills@latest make_image --prompt "Long black hair, red qipao dress, blue eyes, front view, white background, full body" --aspect "3:4"
npx -y @talesofai/neta-skills@latest make_image --prompt "Long black hair, red qipao dress, blue eyes, side view, white background, full body" --aspect "3:4"
```

### Iteration Suggestions

- If generation results are unsatisfactory, gradually adjust description details
- Fix overall style first, then refine local features
- If there's a reference IP (e.g., "Resident Evil"), add style terms to the description

### After Image Generation

After `make_image` returns, **display the generated image to the user** using `artifacts[0].url` and ask if they're satisfied before proceeding.

---

## Stage 2: Character Documentation

After visual satisfaction, proceed with complete character documentation.

### Trigger Guidelines

> **Must be in English** - This is the recognition anchor for image and language models.

**Recommended format:**
```
[gender tag], [character name], [hair color + style], [clothing features], [personality/occupation tags], [IP series (if any)]
```

**Example:**
```
1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series
```

**Notes:**
- Gender tag first (`1girl` / `1boy` / `1person`)
- Character's English name (if any) should be kept to improve cross-model recognition
- Select the most prominent, most distinctive clothing and appearance features
- Avoid overly abstract words (e.g., "mysterious"), prioritize visually describable words

### Prompt Guidelines

> **Pure visual description for image models**, detailed version of trigger.

**Filling principles:**
- Only write: physical features, clothing, accessories, distinctive marks
- Don't write: personality, story, occupation, background
- Language style: English tags preferred, comma-separated, concise and precise

**Example:**
```
long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure, pale skin, small earrings
```

### Description Guidelines

> **For Agents and users to read**, the character's "profile".

**Recommended structure:**
```
[Character name], [one-sentence appearance summary]. [Background/identity/source]. [Personality/characteristics]. [Relationship to worldview/special abilities].
```

**Example:**
```
Ada Wong, a mysterious spy with black hair and red dress, often appearing in a sexy and elegant image. Her true identity is unknown, and she has repeatedly appeared as a middleman in Resident Evil incidents, acting independently with unpredictable purposes. Skilled in combat and infiltration, possessing advanced intelligence processing capabilities.
```

**Note:** Description directly affects how Agents understand the character in subsequent creations (dialogue, scene design), please write clearly.

---

## Stage 3: Confirmation

### Pre-Creation Confirmation

Show complete settings to user:

```
Character Name: Ada Wong
Gender: Female
Age: 28
Occupation: Spy
Personality: Mysterious and calm, purpose unknown, moves between factions
Interests: Intelligence gathering, combat, precision machinery
Trigger: 1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, resident evil series
Prompt: long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure
Description: Ada Wong, a mysterious spy with black hair and red dress...
Avatar: artifacts[0].uuid = xxxxxxxx
```

After user confirmation, execute creation:

```bash
npx -y @talesofai/neta-skills@latest create_character \
  --name "Ada Wong" \
  --avatar_artifact_uuid "preview image's artifacts[0].uuid" \
  --prompt "long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure" \
  --trigger "1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, resident evil series" \
  --gender "female" \
  --age "28" \
  --occupation "spy" \
  --persona "Mysterious and calm, purpose unknown, moves between factions" \
  --interests "intelligence gathering, combat, precision machinery" \
  --description "Ada Wong, a mysterious spy with black hair and red dress. Her true identity is unknown, and she has repeatedly appeared as a middleman in Resident Evil incidents." \
  --accessibility "PUBLIC"
```

### After Successful Creation

After successful creation, API returns `tcp_uuid`. Inform user:
- Character UUID (tcp_uuid), for future updates
- How to reference in make_image: `@Ada Wong`

---

## Common Scenarios

### Anime/Cultural IP Characters

For recreating existing IP characters (e.g., game, anime characters):

1. First search if character Token already exists: `npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "character name" --parent_type "character"`
2. If exists, can use directly or create derivative based on existing Token
3. If not, follow above workflow, note IP series in trigger

### Original Characters (OC)

For original characters designed from scratch:

1. Discuss character positioning with user (race, occupation, worldview)
2. Iterate more during visual preview stage to ensure uniqueness
3. Supplement worldview background in description to enhance subsequent creation usability

---

## Related Documentation

- [Character Update Guide](./character-update.md) - Post-creation modification workflow
- [Field Reference Manual](./character-field-guide.md) - Detailed description of all fields

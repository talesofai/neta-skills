# Character Field Reference Manual

Detailed description and filling specifications for all fields in `create_character` and `update_character`.

---

## Required Fields

### `name`

Character name, max 128 characters.

- Chinese or English acceptable
- Recommend using character's real name for easy `@CharacterName` referencing
- Example: `Ada Wong`, `Neta`, `Roshi OC`

---

### `avatar_artifact_uuid` (required for create)

Character avatar image artifact UUID from `make_image` response `artifacts[0].uuid`.

- Must be an image generated through `make_image`
- Recommend using full body or half body shot, clearly showing character appearance
- This image serves as the character's avatar and visual anchor for IMAGE_EDIT model (`ref_image`)

---

### `prompt` (required for create)

Pure visual feature description for image models.

**Visuals only, no story:**
| Write ✅ | Don't write ❌ |
|---------|---------------|
| Hair color, hairstyle | Personality |
| Clothing, accessories | Backstory |
| Body type, skin tone | Occupation (unless visually apparent) |
| Distinctive marks (tattoos, weapons) | Emotional state |

**Language style:** English tags preferred, comma-separated.

**Example:**
```
long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure, pale skin
```

---

### `trigger` (required for create)

English recognition tags for language and image models.

**Recommended format:**
```
[gender tag], [character name (English)], [hair color + style], [clothing features], [occupation/personality tags], [IP series (if any)]
```

**Rules:**
- **Must be in English**, Chinese triggers significantly reduce recognition rate
- Gender tag required (`1girl` / `1boy` / `1person` / `androgynous`)
- Character's English name (if any) should be kept to improve cross-model recognition
- Prioritize most distinctive visual features
- Avoid overly generic words (e.g., `beautiful`, `cute`)

**Example:**
```
1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series
```

---

## Optional Fields

### `gender`

Character gender. Default: `neutral`.

Options: `male`, `female`, `neutral`, `other` or custom text.

---

### `age`

Character age, string format (supports vague descriptions).

- Example: `28`, `teenager`, `unknown`, `hundreds of years old`

---

### `occupation`

Character occupation or identity.

- Example: `spy`, `magician`, `high school student`, `AI assistant`

---

### `persona`

Personality description for Agents to grasp character temperament in creation.

- Focus on personality traits and behavior patterns
- Example: `Mysterious and calm, purpose unknown, moves between factions, never easily trusts others`

---

### `interests`

Interests and hobbies, comma-separated.

- Example: `intelligence gathering, combat, precision machinery, wine tasting`

---

### `description`

Character description for Agents and users to read. This is the core field for Agents to understand character context.

**Recommended structure:**
```
[Name], [appearance summary]. [Background/identity/source]. [Personality traits]. [Special abilities/relationship to worldview].
```

**Example:**
```
Ada Wong, a mysterious spy with black hair and red dress, often appearing in a sexy and elegant image. Her true identity is unknown, and she has repeatedly appeared as a middleman in Resident Evil incidents, acting independently with unpredictable purposes. Skilled in combat and infiltration, possessing advanced intelligence processing capabilities.
```

> **Important:** Description directly affects how deeply Agents understand the character in subsequent creations, recommend being as detailed as possible.

---

### `accessibility`

Visibility setting.

| Value | Meaning |
|-------|---------|
| `PUBLIC` (default) | All users can search and use |
| `PRIVATE` | Only creator can see and use |

---

## update_character Specific Fields

### `tcp_uuid` (required)

Character's unique identifier UUID, obtained from `request_character_or_elementum` or `create_character` response.

---

## Field Relationship Summary

```
┌─────────────────────────────────────────────────────┐
│                  Character Token (TCP/OC)           │
│                                                     │
│  For image models           For Agents/Users        │
│  ─────────────────          ─────────────────       │
│  trigger (recognition)       description (profile)  │
│  prompt  (visual tags)       persona (personality)  │
│                              occupation / age       │
│                              interests              │
│                                                     │
│  anchor                                             │
│  ──────                                             │
│  avatar_artifact_uuid (avatar, also as ref_image)   │
└─────────────────────────────────────────────────────┘
```

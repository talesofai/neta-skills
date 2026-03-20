# Character Update Guide

Scenarios and workflow for modifying existing characters.

---

## Core Principles

`update_character` **only pass fields that need to be changed**, unchanged fields remain as-is. Pass empty string `""` to clear optional fields.

---

## Getting tcp_uuid

Before updating, first get the character's `tcp_uuid`:

```bash
# Search by character name
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Ada Wong"
```

The `uuid` field in the response is the `tcp_uuid`.

---

## Common Update Scenarios

### Scenario 1: Visual Dissatisfaction, Regenerate Image

User is unsatisfied with character appearance, needs to regenerate image and change avatar.

**Workflow:**
1. Use `make_image` to regenerate character preview (refer to [Character Creation Guide](./character-creation.md) preview specifications)
2. After confirmation, update avatar and prompt with new `artifacts[0].uuid`

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --avatar_artifact_uuid "new image's artifacts[0].uuid" \
  --prompt "updated visual features, e.g.: long black hair, updated outfit details"
```

### Scenario 2: Supplement or Modify Backstory

Character setting has changed, or initial backstory was incomplete.

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --description "updated complete character backstory" \
  --persona "updated personality description" \
  --occupation "new occupation" \
  --interests "new interests"
```

### Scenario 3: Fix Trigger to Improve Recognition

If character features are inaccurate when using `@CharacterName` for image generation, trigger may need optimization.

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --trigger "1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series"
```

**Optimization directions:**
- Ensure gender tag included (`1girl` / `1boy`)
- Add character's English name
- Highlight most recognizable visual features
- If belonging to an IP, add series name

### Scenario 4: Change Visibility

Change character from private to public, or vice versa:

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --accessibility "PUBLIC"
```

### Scenario 5: Clear Optional Field

Pass empty string `""` to clear fields:

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "character's tcp_uuid" \
  --interests ""
```

---

## Post-Update Verification

After update, verify with `make_image`:

```bash
# Generate test image with updated character
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@Ada Wong, white background, full body, showing updated appearance" \
  --aspect "3:4"
```

If trigger or prompt changed, may need to wait a few minutes for system sync.

---

## Related Documentation

- [Character Creation Guide](./character-creation.md) - Complete creation workflow
- [Field Reference Manual](./character-field-guide.md) - Detailed description of all fields

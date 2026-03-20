---
name: neta-adventure
description: Neta Adventure Campaign skill - Create and play AI-driven interactive story adventures. Adventure campaigns provide story-crafting and story-telling modes where agents act as DM and roleplay characters following plot, rules, and special guidelines.
---

# Neta Adventure Skill

Create and experience AI-driven interactive story adventures (Adventure Campaigns). The agent serves as both Dungeon Master and character, guiding narrative experiences built on crafted plots, objectives, and governing rules.

## Mode Detection

Determine mode before acting. Do not ask multiple questions.

| Signal | Mode | Load |
|--------|------|------|
| User wants to create / design / build a story | Craft | `references/adventure-crafting.md` |
| User provides UUID or refers to existing campaign | Play | `references/adventure-playing.md` |
| Field question arises during craft or play | — | `references/adventure-field-guide.md` |
| Ambiguous (genre mention, no further context) | — | Ask ONE question: *"Create a new story, or play one you've already made?"* |

Once mode is established, do not re-ask.

## Commands

**Create a campaign**

```bash
npx -y @talesofai/neta-skills@latest create_adventure_campaign \
  --name "Raccoon General: Final Shift" \
  --mission_plot "The last maintenance log entry is dated three weeks ago..." \
  --mission_task "Survive the night. Find Dr. Strauss. Discover what Umbrella did." \
  --mission_plot_attention "Maintain survival-horror dread. No graphic gore — horror through implication."
```

📖 [Craft workflow](./references/adventure-crafting.md) — draft-first loop, field system, quality checklist.

**Update a campaign** (only provided fields are changed)

```bash
npx -y @talesofai/neta-skills@latest update_adventure_campaign \
  --campaign_uuid "campaign-uuid-here" \
  --mission_plot_attention "Updated governing rules..."
```

**List your campaigns**

```bash
npx -y @talesofai/neta-skills@latest list_my_adventure_campaigns
npx -y @talesofai/neta-skills@latest list_my_adventure_campaigns --page_index 0 --page_size 10
```

**Get campaign details**

```bash
npx -y @talesofai/neta-skills@latest request_adventure_campaign --campaign_uuid "campaign-uuid-here"
```

📖 [Play workflow](./references/adventure-playing.md) — initialization, proactive advance, steering mechanics.

## neta-creative Integration

If `default_tcp_uuid` is present on a campaign, check whether `request_character_or_elementum` is available in the current skill set before attempting to load the character profile. Do not suggest installing neta-creative; check first, then proceed with or without it.

## Reference Documents

| Scenario | Document |
|----------|----------|
| 📝 Craft workflow | [adventure-crafting.md](./references/adventure-crafting.md) |
| 🎮 Play workflow | [adventure-playing.md](./references/adventure-playing.md) |
| 📋 Field semantics | [adventure-field-guide.md](./references/adventure-field-guide.md) |
| ✨ Worked examples across genres | [adventure-examples.md](./references/adventure-examples.md) |

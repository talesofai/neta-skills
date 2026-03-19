---
name: neta-travel
description: Neta Travel Campaign skill - Create and play AI-driven interactive story adventures. Travel campaigns provide story-crafting and story-telling modes where agents act as DM and roleplay characters following plot, rules, and special guidelines.
---

# Neta Travel Skill

Create and experience AI-driven interactive story adventures (Travel Campaigns). In travel mode, the agent serves as both Dungeon Master and character roleplayer, guiding users through narrative experiences based on crafted plots and rules.

> This skill enables two primary modes:
> - **Craft Mode**: Multi-turn collaborative story creation with the user
> - **Play Mode**: Interactive storytelling using an established campaign

## Prerequisites

Ensure environment variable `NETA_TOKEN` is set.

Ensure latest Neta CLI is installed:
```
neta-cli --version
0.10.0
```

```
npm i @talesofai/neta-cli@latest -g
```

## Command Overview

### Create Travel Campaign

Create a new story adventure with plot, rules, and optional character binding.

```bash
neta-cli create_travel_campaign \
  --name "The Forgotten Mansion" \
  --mission_plot "A mysterious letter arrives on a stormy night, inviting the player to a forgotten mansion where family secrets and ghostly presences await..." \
  --mission_task "Explore the mansion, uncover its three hidden secrets, and decide whether to help the trapped spirits find peace or seize their power." \
  --mission_plot_attention "Maintain Gothic horror atmosphere. Player choices have permanent consequences. Avoid graphic violence - focus on psychological tension and mystery."
```

### Update Travel Campaign

Selectively update campaign fields (only provide what needs to change):

```bash
# Refine the plot based on feedback
neta-cli update_travel_campaign \
  --campaign_uuid "campaign-uuid-here" \
  --mission_plot "Updated plot with more detailed twists..."

```

### List My Travel Campaigns

Browse your created campaigns (summary view):

```bash
neta-cli list_my_travel_campaigns
neta-cli list_my_travel_campaigns --page_index 0 --page_size 10
```

### Get Travel Campaign Details

Retrieve full campaign data for storytelling:

```bash
neta-cli request_travel_campaign --campaign_uuid "campaign-uuid-here"
```

## Agent Workflow: Craft Mode

When user wants to create a new travel story:

1. **Concept Discussion**: Explore what kind of story the user wants
   - Genre (horror, fantasy, sci-fi, mystery, etc.)
   - Setting and atmosphere
   - Core conflict or premise
   - Desired player experience

2. **Iterate on Plot**: Develop the `mission_plot`
   - World building elements
   - Initial scenario/hook
   - Key story beats (without scripting outcomes)
   - NPCs and their motivations

3. **Define Rules**: Establish `mission_task`
   - Player objectives (explore, solve, survive, etc.)
   - Win/lose conditions (if any)
   - Interaction mechanics

4. **Set Boundaries**: Craft `mission_plot_attention`
   - Tone and style guidelines
   - Content restrictions
   - AI behavior constraints
   - Narrative mechanics

5. **Create Campaign**: Call `create_travel_campaign` with gathered content

6. **Verify**: Use `request_travel_campaign` to confirm and show the user their created campaign

## Agent Workflow: Play Mode

When user wants to play a travel campaign:

1. **Find Campaign**: Use `list_my_travel_campaigns` or user provides UUID

2. **Load Campaign**: Call `request_travel_campaign` to get full details

3. **Initialize Story Session** using the returned fields directly:
   - `mission_plot` → the story foundation for your context
   - `mission_task` → player objectives and rules
   - `mission_plot_attention` → hard constraints on your behavior, follow strictly
   - `default_tcp` → if present, roleplay this character during the session

4. **Begin Storytelling**:
   - Set the scene using `mission_plot`
   - Present initial choices
   - Follow `mission_task` for player objectives
   - Respect `mission_plot_attention` constraints
   - Pause when player engagement is needed

## Field Reference

| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Campaign title | "The Forgotten Mansion" |
| `subtitle` | One-line tagline | "A Gothic horror mystery" |
| `mission_plot` | Core story/scenario | World setting, hook, key events |
| `mission_task` | Player objectives | What to accomplish, how to interact |
| `mission_plot_attention` | AI guidelines | Tone, restrictions, mechanics |
| `header_img` | Card thumbnail image | URL from image generation |
| `background_img` | Atmospheric background | URL from image generation |

## Best Practices

1. **Plot vs Task Separation**:
   - `mission_plot` = What IS (the world, situation)
   - `mission_task` = What to DO (player goals)

2. **Attention as Constraints**:
   - Use `mission_plot_attention` for things the AI should NOT do
   - Set boundaries early to avoid drift

3. **Iterative Refinement**:
   - Start simple, test with `request_travel_campaign`
   - Use `update_travel_campaign` to refine based on playtesting

5. **Content Moderation**:
   - All text fields are moderated on creation/update
   - Avoid content that violates community guidelines

## Reference Documents

| Scenario | Document |
|----------|----------|
| 📝 Craft Workflow | [travel-crafting.md](./references/travel-crafting.md) |
| 🎮 Play Workflow | [travel-playing.md](./references/travel-playing.md) |
| 📋 Field Guide | [travel-field-guide.md](./references/travel-field-guide.md) |

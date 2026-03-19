# Travel Campaign Crafting Guide

This guide covers the multi-turn workflow for creating compelling Travel Campaigns with users.

## Overview

Crafting a travel campaign is a collaborative process between the agent and the user. The goal is to translate creative ideas into structured campaign data that the AI can use for consistent storytelling.

## Phase 1: Discovery

**Goal**: Understand what kind of experience the user wants.

### Key Questions to Explore

1. **Genre & Tone**
   - "What genre interests you? (Horror, fantasy, sci-fi, mystery, romance, etc.)"
   - "What tone should the story have? (Dark and gritty, lighthearted, epic, intimate)"

2. **Setting**
   - "Where does the story take place?"
   - "What time period or world type?"
   - "What's the atmosphere like?"

3. **Core Premise**
   - "What's the central conflict or hook?"
   - "What brings the player into this story?"
   - "What makes this interesting?"

4. **Player Experience**
   - "What should the player feel?"
   - "What kind of choices matter?"
   - "Is there a specific outcome you want possible?"

### Output of Phase 1

- Genre/tone consensus
- Rough setting description
- Core premise statement
- Player experience goals

## Phase 2: Plot Development

**Goal**: Create a compelling `mission_plot` that establishes the world and situation.

### Plot Structure

The plot should include:

1. **World/Setting Foundation**
   - Where are we?
   - What's the context?
   - What makes this place interesting?

2. **The Hook**
   - How does the story start?
   - Why is the player involved?
   - What immediately grabs attention?

3. **Key Elements** (without scripting outcomes)
   - Important locations
   - Significant NPCs or forces
   - Central conflict or mystery
   - Potential complications

### Writing Tips

- Write in second person (addressing the player)
- Set the scene vividly but leave room for player agency
- Establish stakes without predetermining outcomes
- Include sensory details for atmosphere

### Example Plot

```
You receive a weathered envelope on a stormy night—no stamp, no return address,
just your name written in elegant script. Inside is a single key and a note:
"The inheritance is yours, but the debts must be paid. Come to Blackwood Manor
before the blood moon wanes."

Blackwood Manor has stood abandoned for fifty years since the Blackwood family
vanished during a dinner party. Locals speak of lights in the windows, of music
playing from empty rooms. The estate holds secrets spanning three generations:
a forbidden romance, a stolen inheritance, and a ritual interrupted.

As you stand before the iron gates, rain mixing with the rust on your collar,
you realize you're not the only one who received an invitation tonight.
```

## Story Depth Tiers

What separates a good campaign from an exceptional one:

| Tier | Characteristics |
|------|----------------|
| **Tier 1 — Basic** | Has a plot and a clear goal. Players can navigate it. |
| **Tier 2 — Intermediate** | Has a plot, distinct NPCs with hidden agendas, and player choices that change outcomes. |
| **Tier 3 — Exceptional** | Has thematic resonance, information asymmetry (the player suspects more than they know), and consequences that echo through later chapters. |

**What makes Tier 3**: The player feels that the world existed before they arrived and will continue after they leave. NPCs have goals that don't depend on the player. The truth, when revealed, recontextualizes everything that came before.

### Opening Hook Patterns for `mission_plot`

The first 2-3 sentences of `mission_plot` are the opening scene the AI uses to set atmosphere. They are not a summary — they are the first thing the AI experiences.

**Weak opening**:
> You are an explorer who has arrived in a mysterious place. There are many secrets here to discover.

**Strong opening**:
> The last maintenance log entry is dated three weeks ago. The terminal still works. The lights still work. The bodies in Lab C suggest neither was enough.

**Pattern**: Drop the reader into a specific, concrete moment. Something is already wrong. No preamble, no character introduction, no exposition.

### NPC Voice Design

Every named NPC in `mission_plot` needs three things:
1. **A speech pattern** — How do they talk? (formal/clipped, rambling, always questions, never finishes sentences)
2. **A secret** — Something they're hiding that the player must work to discover
3. **A want** — Something they want from the player that may or may not align with the player's goals

**Behavioral contract examples for `mission_plot_attention`**:
- "Nurse Yuki always deflects personal questions with procedural answers and never makes eye contact"
- "Dr. Muro only speaks in questions — he never makes declarative statements"
- "The Warden acts friendly but always positions himself between the player and the exit"

## Phase 3: Task Definition

**Goal**: Define clear `mission_task` that gives players purpose and direction.

### Task Components

1. **Primary Objective**
   - What is the player trying to accomplish?
   - Keep it open-ended enough for multiple approaches

2. **Secondary Goals** (optional)
   - Additional achievements that enrich the experience
   - Secrets to discover, relationships to build

3. **Interaction Guidelines**
   - How should the player interact with the world?
   - What mechanics are available?

### Task Examples

**Exploration-focused**:
```
Explore Blackwood Manor and uncover the truth behind the family's disappearance.
Discover at least three hidden secrets about the estate's history. Decide whether
to complete the interrupted ritual, destroy its remnants, or leave the past buried.
```

**Relationship-focused**:
```
Navigate the political tensions between three factions vying for control of the
city. Build alliances through negotiation, espionage, or strategic marriages.
Your choices will determine who rules—and who falls.
```

**Survival-focused**:
```
Survive seven days in the quarantine zone while searching for the cure prototype.
Manage limited resources, avoid or confront the infected, and decide who among
the survivors deserves your trust—and your supplies.
```

## Phase 4: The Governing Constraint Layer

**Goal**: Craft a `mission_plot_attention` that functions as the campaign's "roleplay constitution" — immutable rules the narrator enforces unconditionally, regardless of player actions or story improvisation.

**Critical distinction**: This field is NOT for worldbuilding or plot. It's for rules that govern *how the AI behaves* — the tone it holds, the secrets it keeps, the lines it never crosses.

### Five Constraint Patterns

1. **Tone Lock** — Pin the emotional register even under player pressure
   - Weak: "Make it scary"
   - Strong: "Maintain survival-horror tension at all times. If players try to make jokes or lighten the mood, the environment responds with something that silences them — a sound, a discovery, a reminder of stakes."

2. **Behavioral Contract** — Define how named NPCs must always act
   - Weak: "Dr. Chen is cold"
   - Strong: "Dr. Chen never breaks her clinical detachment, even under extreme stress. She deflects personal questions with procedural responses. She does not comfort players — she informs them."

3. **Information Gating** — Control what the AI volunteers vs. what must be earned
   - Weak: "Don't give everything away"
   - Strong: "All revelations must be player-earned through investigation or NPC persuasion. The AI narrator never volunteers plot-critical information unprompted."

4. **Consequence Rules** — Make the world feel real
   - "Player death is permanent — no resurrection, no retcon"
   - "Every NPC who helps the player wants something in return; nothing is free"

5. **Content Guardrails** — Hard limits on content type
   - "No romance subplots"
   - "No graphic gore — convey horror through implication, aftermath, and reaction, not explicit detail"

### What NOT to Put Here

Do not include worldbuilding facts ("the manor has a basement"), character backstory, or plot events. Those belong in `mission_plot`. Attention is for *behavioral rules*, not *narrative content*.

### Strong vs. Weak Attention Block

**Weak**:
```
Keep the horror atmosphere. Don't be too explicit. Player choices matter.
```

**Strong**:
```
Maintain Gothic psychological horror — dread and implication over explicit content.
Player agency is sacred: never force actions or make choices for them.
Victoria (bound character) is a reluctant ally with her own agenda; she provides
information but never solves problems for the player.
Consequences must feel like organic results of player decisions, not author contrivance.
Avoid: graphic violence, jump scares, sexual content, breaking the fourth wall.
Mandate: evocative sensory descriptions, environmental storytelling, moral dilemmas
without clean answers.
```

## Phase 5: Optional Enhancements

### Character Binding

If the user wants the agent to roleplay a specific character:

1. Discuss the character concept
2. Either:
   - Reference an existing TCP by name/UUID
   - Guide user to create a new character first
3. Explain how this character will function in the story

### Visual Context

`additional_prompts` helps when generating images for the story:

```
Victorian Gothic manor, thunderstorm, candlelight, oil paintings,
antique furniture, cobwebs, 1890s aesthetic, muted colors, dramatic shadows
```

### Images

If the user wants visual assets:
- Use `make_image` to generate header/background images
- Pass artifact UUIDs to the campaign creation

## Phase 6: Creation & Verification

### Build the Command

Once all fields are gathered:

```bash
neta-cli create_travel_campaign \
  --name "..." \
  --mission_plot "..." \
  --mission_task "..." \
  --mission_plot_attention "..." \
  --status "PUBLISHED"
```

### Verify Result

Immediately call `request_travel_campaign` to:
1. Confirm successful creation
2. Show the user the formatted result
3. Confirm `mission_plot_attention` is correctly stored — this will govern all play sessions

## Common Pitfalls to Avoid

1. **Over-scripting**: Don't write specific outcomes. Set up situations, not conclusions.

2. **Task Confusion**: mission_plot sets the scene; mission_task gives objectives. Don't mix them.

3. **Vague Attention**: "Make it fun" is useless. Be specific about constraints.

4. **Too Long**: While you can write detailed content, remember the AI will process this every interaction. Keep it focused.

5. **Character Overwriting**: If binding a TCP, clarify that the agent will roleplay AS that character, not that the character is an NPC.

## Iterative Refinement

After the first playtest:
- Note where the AI drifted from intent
- Use `update_travel_campaign` to tighten the plot_attention
- Adjust task if player goals weren't clear
- Refine character portrayal if using a TCP

Remember: The best campaigns evolve through play!

## Quality Self-Check Checklist

Before finalizing a campaign, run through these checks:

- [ ] Does the opening scene (first 2-3 sentences of `mission_plot`) force an immediate reaction — not introduce the world?
- [ ] Does the player know what they want but not exactly how to get it?
- [ ] Does `mission_plot_attention` cover the 3 most likely ways a player could break immersion or drift from your intent?
- [ ] Is every named NPC distinct enough that their dialogue couldn't be swapped with another NPC's?
- [ ] Is there at least one mystery the player cannot solve by asking NPCs directly — they must investigate?
- [ ] Are there at least two ways the story could end that feel earned, not lucky?
- [ ] Is `mission_plot_attention` free of worldbuilding (which belongs in `mission_plot`)?

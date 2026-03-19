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

## Phase 4: Attention & Boundaries

**Goal**: Establish `mission_plot_attention` to keep the AI aligned with user expectations.

### What to Include

1. **Tone Guidelines**
   - "Maintain atmospheric horror without jump scares"
   - "Keep the tone whimsical and slightly absurd"
   - "Avoid graphic descriptions of violence"

2. **Content Boundaries**
   - "No sexual content or romantic advances from NPCs"
   - "Stay within PG-13 equivalent for descriptions"
   - "Avoid body horror and graphic medical details"

3. **Mechanical Constraints**
   - "Player choices should have visible consequences within 3 interactions"
   - "Never force the player into combat—they can always negotiate"
   - "Magic should feel mysterious, not like a game mechanic"

4. **Style Preferences**
   - "Use present tense, second person perspective"
   - "End each response with a meaningful choice"
   - "Include sensory details appropriate to the setting"

### Attention Example

```
Maintain Gothic horror atmosphere with emphasis on psychological tension over
graphic content. Player agency is paramount—never force actions or make choices
for them. Consequences should feel organic to their decisions. Include the bound
character (Victoria) as a reluctant ally with her own agenda. She can provide
information but shouldn't solve problems for the player. Avoid: graphic violence,
jump scares, sexual content, breaking the fourth wall. Use: evocative descriptions,
environmental storytelling, meaningful moral dilemmas.
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
  --additional_prompts "..." \
  --tcp_uuid "..." \
  --status "PUBLISHED"
```

### Verify Result

Immediately call `request_travel_campaign` to:
1. Confirm successful creation
2. Show the user the formatted result
3. Highlight the `custom_prompt` that will be used in play mode

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

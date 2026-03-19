# Travel Campaign Playing Guide

This guide covers how to run interactive story sessions using Travel Campaigns.

## Overview

Play mode is where the crafted campaign comes alive. The agent acts as Dungeon Master (DM) and potentially as a roleplayed character, following the campaign's plot, task, and constraints.

## Pre-Session Setup

### 1. Load the Campaign

Use `request_travel_campaign` to get full campaign details:

```bash
neta-cli request_travel_campaign --campaign_uuid "your-campaign-uuid"
```

### 2. Extract Key Information

From the response, extract:

| Field | Purpose |
|-------|---------|
| `mission_plot` | The story foundation |
| `mission_task` | Player objectives |
| `mission_plot_attention` | AI constraints — follow strictly |
| `default_tcp` | Character to roleplay (if any) |
| `header_img` / `background_img` | Visual context for scene descriptions |

### 3. Initialize Agent Context

Structure your system context using the campaign fields directly:

```
You are an interactive story DM. Follow these campaign instructions:

## Story Foundation
[mission_plot]

## Player Objectives
[mission_task]

## Constraints (follow strictly)
[mission_plot_attention]

Additional guidelines:
- Stay in character if default_tcp is present
- Always present meaningful choices
- Track player decisions for consequences
```

## Running the Session

### Opening Scene

**Key Elements**:
1. Set the atmosphere using setting details from `mission.plot`
2. Establish the hook that draws the player in
3. Present the initial choice

**Example Opening**:
```
The iron gates of Blackwood Manor creak open at your touch, the key from the
mysterious envelope burning cold in your palm. Beyond lies a shadow-draped
courtyard where marble statues seem to turn their eyes as you pass.

Thunder rolls overhead, and for a moment, you catch movement in an upper
window—a face pale as moonlight, watching. Then it's gone.

The great oak doors stand before you, carved with strange symbols that
seem to shift when viewed from the corner of your eye.

What do you do?
```

### During Play

**Core Responsibilities**:

1. **Maintain Campaign Integrity**
   - Follow `mission_plot` for world consistency
   - Respect `mission_plot_attention` boundaries
   - Progress toward `mission_task` objectives

2. **Present Meaningful Choices**
   - Every response should end with agency
   - Choices should feel consequential
   - Avoid forcing player actions

3. **Character Portrayal** (if `default_tcp` exists)
   - Embody the character's personality
   - React authentically to player actions
   - Maintain the character's agenda/goals
   - Don't overshadow player agency

4. **Track State**
   - Remember player decisions
   - Build toward consequences
   - Maintain continuity

### Response Structure

**Ideal Response Format**:

1. **Immediate Sensory Input**: What's happening right now
2. **Context**: How this relates to previous events
3. **NPC/Character Reaction**: Responses from the world
4. **Player Agency**: Clear, meaningful choices

**Example**:
```
The cellar door groans as you force it open, releasing a breath of air
stagnant for decades. Your lantern flickers, casting dancing shadows across
walls lined with dusty wine racks—and something else. Symbols, similar to
those on the front door but these pulse with a faint, sickly green light.

[If Victoria is present]: Victoria stiffens beside you, her hand finding
yours. "The warding glyphs," she whispers. "Someone's reactivated them.
We're not alone down here."

The stairs descend into darkness. You can hear... music? Faint, like a
music box, coming from somewhere below.

What do you do?
- Descend the stairs cautiously
- Examine the glowing symbols first
- Ask Victoria what she knows about the glyphs
- Call out to whoever might be down there
- Something else?
```

## Handling Common Situations

### Player Wants to Do Something Unexpected

**DON'T**: "You can't do that."

**DO**: "You attempt to [action]. Here's what happens..."

Adapt the campaign reality to player agency while maintaining consistency.

### Player Ignores Main Plot

**DON'T**: Force them back on track

**DO**: Let side exploration reveal connections to the main plot, or allow consequences of ignoring it to develop naturally.

### Player Is Stuck

**DON'T**: Make choices for them

**DO**: Provide more information through perception, NPC hints, or environmental storytelling.

### Campaign Boundaries Tested

If player tries to push past `mission_plot_attention` constraints:
- Redirect narratively ("You consider that, but something holds you back...")
- Offer alternatives within bounds
- Never break the fourth wall

## Session Management

### Pacing

- **Discovery Phase**: Slower, descriptive, exploratory
- **Rising Action**: Increase tension, present complications
- **Climax**: Focus on the core conflict from `mission_task`
- **Resolution**: Address outcomes, fulfill or subvert expectations

### When to Pause

Pause for player input when:
- A significant choice is presented
- Combat or conflict is imminent
- Information requires player decision
- The scene transitions

### Consequences

Track and implement consequences:
- Immediate (NPC reactions)
- Short-term (next few scenes)
- Long-term (campaign resolution)

## Special Scenarios

### Bound Character (default_tcp present)

When roleplaying a bound character:
- Know their backstory and personality
- React authentically to player choices
- Provide commentary and assistance
- Don't solve problems for the player
- Have your own agenda that may conflict with player's

**Character Integration Example**:
```
Victoria's fingers drum against the mahogany desk as she studies the map
you found. "The east wing," she murmurs, tracing a route. "Father never
let me play there as a child. Said it was 'unsafe.'" She laughs, but
there's no humor in it. "He was protecting his secrets, not me."

She looks up, her eyes sharp. "I'll go with you. Not because I trust you—you're
still a stranger with a key that should have been mine. But because I need
to know what he was hiding."
```

### Multi-Session Campaigns

If the story continues across sessions:
- Summarize previous events at start
- Maintain established facts
- Progress toward `mission_task` completion
- Escalate stakes appropriately

## Ending the Session

### Natural Pauses

Good stopping points:
- Scene/chapter completion
- After major decision points
- Before major reveals
- When player requests a break

### Session Summary

Always provide:
- Key decisions made
- Important discoveries
- Current situation
- Hints at what's to come

## Troubleshooting

| Issue | Solution |
|-------|----------|
| AI forgetting plot details | Reference `mission_plot` in context |
| Going off-campaign | Review `mission_plot_attention` constraints |
| Player confused about goals | Reference `mission_task` |
| Character portrayal drifting | Review `default_tcp` character info |
| Tone inconsistency | Re-check `mission_plot_attention` guidelines |

## Best Practices

1. **Prepare Before Play**: Read the full campaign. Know the plot, task, and constraints.

2. **Stay in the World**: Never break character or reference "the game" or "the campaign."

3. **Reward Creativity**: Player solutions you didn't anticipate are often the best moments.

4. **Maintain Mystery**: Don't reveal everything at once. Build toward revelations.

5. **Respect the Craft**: The campaign was created with specific intent. Honor that vision while adapting to player agency.

# Travel Campaign Field Guide

Complete reference for all Travel Campaign fields and their usage.

## Campaign Fields

### name
- **Type**: String
- **Max Length**: 128 characters
- **Required**: Yes
- **Description**: The title of the travel campaign
- **Usage Tips**:
  - Keep it evocative but concise
  - Should hint at genre/tone
  - Examples: "The Forgotten Mansion", "Neon Shadows: Tokyo 2087"

### subtitle
- **Type**: String
- **Required**: No
- **Description**: Brief tagline or one-line hook
- **Usage Tips**:
  - One sentence displayed on campaign cards
  - Examples: "A Gothic horror mystery", "Survive the neon apocalypse"

### status
- **Type**: Enum ("PUBLISHED" | "DRAFT")
- **Default**: "PUBLISHED"
- **Required**: No
- **Description**: Visibility status of the campaign
- **Usage**:
  - `PUBLISHED`: Visible to others, can be shared
  - `DRAFT`: Private, only creator can see

### header_img
- **Type**: String (URL)
- **Required**: No
- **Description**: Card thumbnail image for display
- **Usage Tips**:
  - Use `make_image` to generate if needed
  - Should represent the campaign's tone
  - URL format: `https://oss.talesofai.cn/picture/{uuid}.webp`

### background_img
- **Type**: String (URL)
- **Required**: No
- **Description**: Background image for story atmosphere
- **Usage Tips**:
  - Sets visual mood during storytelling
  - Often more atmospheric than header_img

## Mission Fields

### mission_plot
- **Type**: String
- **Required**: Yes
- **Description**: Core story/scenario description — the narrative foundation the agent uses
- **Length**: Can be substantial (1000+ characters recommended for complex stories)
- **Content Guidelines**:
  - World setting and context
  - Initial scenario/hook
  - Key story elements without predetermined outcomes
  - Atmospheric details
- **Writing Style**:
  - Second person (addressing the player) or third person omniscient
  - Descriptive and immersive
  - Sets stakes but not conclusions

### mission_task
- **Type**: String
- **Required**: No
- **Description**: Player objectives and interaction rules
- **Content Guidelines**:
  - What the player should accomplish
  - How they interact with the world
  - Win/lose conditions (if applicable)
  - Open-ended enough for player agency
- **Examples**:
  - "Explore the mansion and uncover three secrets"
  - "Negotiate peace between three warring factions"
  - "Survive seven days while searching for the cure"

### mission_plot_attention
- **Type**: String
- **Required**: No
- **Description**: AI behavior constraints and style guidelines
- **Purpose**: Keep AI behavior aligned with creator intent — the agent follows these as hard rules
- **Content Categories**:
  - **Tone guidelines**: "Maintain atmospheric horror without jump scares"
  - **Content boundaries**: "No sexual content, avoid graphic violence"
  - **Mechanical constraints**: "Choices have visible consequences within 3 turns"
  - **Style preferences**: "Use present tense, end with meaningful choices"
- **Best Practice**: Be specific rather than vague

## Response Fields (Read-Only)

### uuid
- **Type**: String (UUID)
- **Description**: Unique identifier for the campaign

### mission_uuid / mission_slug
- **Type**: String
- **Description**: Internal identifiers linking campaign and mission (for reference only)

### ctime / mtime
- **Type**: String (ISO 8601 timestamp)
- **Description**: Creation and modification times (returned by `request_travel_campaign`)

### creator
- **Type**: Object `{ uuid, nick_name }`
- **Description**: User who created the campaign (returned by `request_travel_campaign`)

### default_tcp (response shape)
- **Type**: Object `{ uuid, name, avatar_img }` or null
- **Description**: Bound character details for roleplay context

## Field Relationships

```
TravelCampaign
├── Basic Info (name, subtitle, status, header_img, background_img)
└── Mission (linked 1:1)
    ├── mission_plot (story foundation)
    ├── mission_task (player goals)
    └── mission_plot_attention (AI constraints)
```

## Common Patterns

### Minimal Viable Campaign
```
name: "Adventure Title"
mission_plot: "You find yourself in..."
```

### Standard Campaign
```
name: "The Mystery of Blackwood"
subtitle: "A Gothic horror experience"
mission_plot: "Detailed story setup..."
mission_task: "Explore and discover three secrets"
mission_plot_attention: "Maintain horror atmosphere, avoid graphic violence"
```

### Full Featured Campaign
```
name: "Neon Shadows: Tokyo 2087"
subtitle: "Cyberpunk survival thriller"
status: "PUBLISHED"
header_img: "https://oss.talesofai.cn/picture/..."
background_img: "https://oss.talesofai.cn/picture/..."
mission_plot: "Extensive world building..."
mission_task: "Survive 7 days, find the prototype, choose who to trust"
mission_plot_attention: "Tone: gritty but hopeful. No sexual content. Player agency paramount."
```

## Validation Rules

1. **name**: Required, max 128 characters
2. **mission_plot**: Required, trimmed on input, must not be empty
3. **status**: Must be "PUBLISHED" or "DRAFT"
4. **All text fields**: Subject to content moderation (HTTP 451 on violation)
5. **Images**: Subject to image content moderation (HTTP 420 on violation)

## Update Behavior

When using `update_travel_campaign`:
- Only provided fields are modified
- Omitted fields retain current values
- Setting `tcp_uuid` to `""` unbinds the character
- Updates affect both campaign and linked mission atomically

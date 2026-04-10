---
name: neta-suggest
description: Neta API research and recommendation skill — provide keyword/tag/category suggestions, validate taxonomy paths, and power multi‑mode content feeds, supporting progressive exploration from broad to precise. Use this skill when the user has no clear goal, wants topic/idea suggestions, or needs systematic content filtering by keywords/categories. It does not directly generate media (handled by neta-creative); community interactions are handled by neta-community.
---

# Neta Suggest Skill

## Instructions

1. For research‑type tasks like “find me some ideas”, “what’s trending now”, or “filter content by a theme/category”, follow this flow:
2. Recommended path: **browse categories → discover tags → validate paths → fetch content** (the “Progressive Exploration” section below contains full command examples).
3. Before content creation, use this skill to research topics/tags/categories, then hand off to `neta-creative` for concrete creation.
4. When the user wants to like/comment or otherwise interact with specific works, switch to `neta-community`.

## Core capabilities

### 1. suggest_keywords — keyword suggestions

Provide popular search keyword suggestions based on an input prefix, helping users discover directions of interest.

```bash
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "game" --size 20
```

**Parameters**

- `--prefix`: keyword prefix (required)
- `--size`: number of results, recommended 10–20 (optional)

**Use cases**

- User only has a vague idea.
- Explore trending topics and themes.
- Prepare for later precise filtering.

### 2. suggest_tags — related tag suggestions

Recommend related taxonomy tags based on a full keyword.

```bash
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "character design" --size 15
```

**Parameters**

- `--keyword`: full keyword (required)
- `--size`: number of results, recommended 10–20 (optional)

**Use cases**

- Understand which tags surround a topic.
- Discover popular tags in a vertical domain.
- Choose suitable tags for publishing content.

### 3. suggest_categories — category navigation

Provide navigation suggestions in a 3‑level category hierarchy, supporting step‑by‑step exploration.

```bash
# Level 1 (top‑level categories)
npx -y @talesofai/neta-skills@latest suggest_categories --level 1

# Level 2 (requires parent path)
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "Derivative Creation"

# Level 3 (most granular)
npx -y @talesofai/neta-skills@latest suggest_categories --level 3 --parent_path "Derivative Creation>Fan Works"
```

**Parameters**

- `--level`: category level (1/2/3) (required)
- `--parent_path`: parent category path, required when level > 1 (optional)

**Example taxonomy**

```text
Level 1
├─ Derivative Creation
│  ├─ Fan Works (Level 2)
│  │  ├─ Honkai: Star Rail (Level 3)
│  │  └─ Genshin Impact (Level 3)
│  └─ Digital Art
├─ Lifestyle
└─ ...
```

**Use cases**

- Systematically understand the platform’s category structure.
- Navigate by following the tree to find specific domains.
- Validate candidate category paths.

### 4. validate_tax_path — validate taxonomy path

Validate that a taxonomy path string is valid before using it.

```bash
npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "Derivative Creation>Fan Works>Honkai: Star Rail"
```

**Parameters**

- `--tax_path`: full taxonomy path (required)

**Use cases**

- Validate paths before using them in filters.
- Ensure taxonomy paths are accurate.

### 5. suggest_content — intelligent content feed

Powerful content recommendation tool supporting three modes: **recommend**, **search**, and **exact**.

```bash
# Mode 1: recommend (broad exploration)
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent recommend

# Mode 2: search (keyword‑based)
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent search \
  --search_keywords "character,creativity"

# Mode 3: exact (category filtering)
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent exact \
  --tax_paths "Derivative Creation>Fan Works"

# Combined filters
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent search \
  --search_keywords "AI,painting" \
  --tax_paths "Digital Art>Concept Art" \
  --exclude_keywords "test,discarded"
```

**Parameters**

- `--page_index`: page index, starting from 0 (default 0)
- `--page_size`: items per page, 1–40 (default 20)
- `--scene`: scene identifier (default `"agent_intent"`)
- `--biz_trace_id`: session trace ID (optional)
- `--intent`: `recommend` \| `search` \| `exact` (default `recommend`)
- `--search_keywords`: search keywords, separated by commas (optional)
- `--tax_paths`: taxonomy paths, separated by commas (optional)
- `--tax_primaries`: level‑1 categories (optional)
- `--tax_secondaries`: level‑2 categories (optional)
- `--tax_tertiaries`: level‑3 categories (optional)
- `--exclude_keywords`: excluded keywords (optional)
- `--exclude_tax_paths`: excluded taxonomy paths (optional)

## Progressive exploration

### Standard path (broad → narrow)

```text
graph LR
    A[Browse categories] --> B[Discover tags]
    B --> C[Validate paths]
    C --> D[Fetch content]
```

#### Step 1: browse category system

```bash
# View all level‑1 categories
npx -y @talesofai/neta-skills@latest suggest_categories --level 1
# Example output: ["Derivative Creation", "Digital Art", "Lifestyle"]

# Dive into an interesting category
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "Derivative Creation"
# Example: ["Fan Works", "Original Stories", "Interactive Fiction"]
```

#### Step 2: discover related tags

```bash
# Find tags from a keyword
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "Fan Works" --size 15
# Example: ["Honkai: Star Rail", "Genshin Impact", "Arknights"]

# Use keyword suggestions to help
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "Hon" --size 10
```

#### Step 3: validate taxonomy path

```bash
npx -y @talesofai/neta-skills@latest validate_tax_path \
  --tax_path "Derivative Creation>Fan Works>Honkai: Star Rail"
```

#### Step 4: fetch recommended content

```bash
# Exact mode: filter by taxonomy only
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "Derivative Creation>Fan Works>Honkai: Star Rail" \
  --page_size 20

# Search mode: combine keyword and taxonomy
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "Honkai: Star Rail,fan art" \
  --tax_paths "Derivative Creation>Fan Works" \
  --page_size 20
```

## Common scenarios

### Scenario 1: exploration without a clear goal

User is just browsing with no specific goal.

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent recommend \
  --page_size 20
```

Tips:

- Avoid constraints at first.
- Let the system recommend based on popularity.
- Good for serendipitous discovery.

### Scenario 2: vague interest direction

User has a rough topic in mind but not specific content.

```bash
# Step 1: keyword suggestions
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "game" --size 15

# Step 2: tag suggestions
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "game" --size 15

# Step 3: search mode
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "Genshin Impact" \
  --page_size 20
```

### Scenario 3: clear category goal

```bash
# Step 1: confirm taxonomy path
npx -y @talesofai/neta-skills@latest suggest_categories --level 1
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "Derivative Creation"

# Step 2: validate path
npx -y @talesofai/neta-skills@latest validate_tax_path \
  --tax_path "Derivative Creation>Fan Works>Honkai: Star Rail"

# Step 3: exact filter
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "Derivative Creation>Fan Works>Honkai: Star Rail" \
  --page_size 20
```

### Scenario 4: pre‑creation research

```bash
# Step 1: understand popular tags
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "character writing" --size 20

# Step 2: inspect related categories
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "Derivative Creation"

# Step 3: view popular content under that category
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "character,setting" \
  --tax_paths "Derivative Creation>Fan Works" \
  --page_size 30
```

### Scenario 5: excluding unwanted content

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "AI,painting" \
  --tax_paths "Digital Art" \
  --exclude_keywords "tutorial,ad" \
  --exclude_tax_paths "Digital Art>Courses" \
  --page_size 20
```

## Parameter combination tips

### Combination 1: keyword + taxonomy

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "video,editing" \
  --tax_paths "Digital Art>Video Production" \
  --page_size 20
```

### Combination 2: multi‑level taxonomy

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "Derivative Creation>Fan Works>Honkai: Star Rail" \
  --page_size 20
```

### Combination 3: recommend + exclusions

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent recommend \
  --exclude_keywords "tutorial, repost" \
  --exclude_tax_paths "Courses" \
  --page_size 20
```

### Combination 4: pagination continuity

```bash
# Page 1
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --intent search \
  --search_keywords "ideas" > /tmp/page0.json

# Extract biz_trace_id
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# Page 2 (reuse same biz_trace_id)
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 1 \
  --page_size 20 \
  --intent search \
  --search_keywords "ideas" \
  --biz_trace_id "$BIZ_TRACE_ID"
```

## Output formats

### suggest_keywords / suggest_tags / suggest_categories

```json
{
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
```

### validate_tax_path

Valid path:

```json
{
  "valid": true,
  "message": "Path is valid"
}
```

Invalid path:

```json
{
  "valid": false,
  "message": "Error message"
}
```

### suggest_content

```json
{
  "module_list": [
    {
      "data_id": "module id",
      "module_id": "module type",
      "template_id": "template id",
      "json_data": {}
    }
  ],
  "page_data": {
    "has_next_page": true,
    "page_index": 0,
    "page_size": 20,
    "biz_trace_id": "trace id"
  }
}
```

## Performance tips

1. **Choose page_size wisely**
   - Exploration: 10–15 for quick iteration.
   - Deep browsing: 20–30 to reduce page switches.
   - Precise lookup: 20–40 to fetch enough content at once.
2. **Cache suggestions**
   - Cache taxonomy and tag suggestions to avoid repeated calls.
3. **Preload next‑level categories**
   - While the user is viewing level‑1 categories, preload level‑2 categories in the background.
4. **Batch‑validate taxonomy paths**
   - Validate multiple candidate paths in parallel or via a simple script.

## Debugging tips

1. Turn on debug logs for `suggest_content` to verify parameters.
2. Use exact mode with only taxonomy to test whether a path actually returns content.
3. Compare `recommend`, `search`, and `exact` with the same topic to understand their differences.

## FAQ

### Q1: What’s the difference between suggest_keywords and suggest_tags?

- `suggest_keywords`: prefix‑based fuzzy matching, good for early exploration.
- `suggest_tags`: relevance‑based matching on full keywords, more precise.

### Q2: Why does validate_tax_path succeed but suggest_content return empty?

Possible reasons:

1. The taxonomy path is valid but currently has no content.
2. Wrong intent mode (e.g., using `recommend` instead of `exact`).
3. Other filters conflict.

### Q3: How to choose the right intent?

| Intent      | Use case                    | Required params           |
|------------|-----------------------------|---------------------------|
| `recommend`| Browsing without clear goal | None                      |
| `search`   | Keyword‑driven search       | `search_keywords`         |
| `exact`    | Strict category filtering   | `tax_paths` or taxonomy params |

### Q4: How to use exclude_keywords and exclude_tax_paths?

Use them to aggressively filter noise content, but note they can significantly reduce result count.

### Q5: How to maintain biz_trace_id across pages?

Always keep and reuse the **first** `biz_trace_id` returned for a given query instead of chaining from page to page.

## Summary

Key points for using the exploration skill:

1. **Progressive exploration**: Categories → Tags → Validation → Content.
2. **Intent selection**: `recommend` for aimless browsing, `search` for keyword queries, `exact` for strict taxonomy.
3. **Combination filters**: combine keywords with taxonomy for precise control.
4. **Exclusions**: use `exclude_*` parameters judiciously to filter noise.
5. **Session continuity**: maintain a consistent `biz_trace_id` for stable paging behavior.

By following these practices, you can explore and discover high‑quality content on the platform efficiently.


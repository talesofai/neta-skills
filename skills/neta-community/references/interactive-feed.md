# Best Practices for Interactive Feed

## Overview

`request_interactive_feed` is a powerful interactive content recommendation API that supports multiple scenarios with automatic scene inference. This document describes how to use it effectively.

## Core concepts

### Automatic scene detection

The API infers the scene from the parameters you pass; you rarely need to hard‑code a scene enum:

- **With `collection_uuid` only**: related‑content scenarios
- **With `target_user_uuid`**: user profile scenario
- **With no special parameters**: default home interactive feed

### Key parameters

- **`collection_uuid`** — the most important scene control parameter
  - `page_index = 0`: fetch details for a single collection (detail view)
  - `page_index > 0`: fetch related content for that collection (recommendations)

- **`page_index`** — controls both pagination and scene semantics
  - `0`: typically used to fetch details or the first page
  - `>0`: used for recommendations or subsequent pages

- **`biz_trace_id`** — maintains session continuity
  - First request: omit or leave empty
  - Subsequent pages: reuse the same `biz_trace_id` that was returned from the first page

## Common scenarios

### 1. Home feed (default)

Basic usage for browsing the home interactive feed.

```bash
# Get home recommendations
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 --page_size 10
```

**Characteristics:**

- No extra parameters needed.
- Returns personalized recommended content.
- Suitable as the default view when opening the app.

### 2. View a single collection’s details

When you want full information for a specific collection:

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "TARGET_COLLECTION_UUID"
```

### 3. Get similar content

Fetch recommendations related to a seed collection:

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "SEED_COLLECTION_UUID"
```

**Characteristics:**

- Recommends content similar to the seed.
- Ideal for “more like this” scenarios.

### 4. View original and all derivatives

View the original work and all its derivative (remix) works:

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'relation_feed_child' \
  --target_collection_uuid "TARGET_COLLECTION_UUID" \
  --collection_uuid "TARGET_COLLECTION_UUID"
```

**Characteristics:**

- Requires both `collection_uuid` and `target_collection_uuid`.
- Uses `scene='relation_feed_child'`.
- Returns the original work plus all derivatives.

### 5. User profile feed

Fetch all works created by a specific user:

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "USER_UUID"
```

**Characteristics:**

- Requires `target_user_uuid`.
- Uses `scene='personal_feed'`.
- Returns all works by that user.

### 6. Child works in comment view

View child works under a parent work (e.g. in a comment context):

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'relation_feed_same' \
  --collection_uuid "PARENT_COLLECTION_UUID"
```

**Characteristics:**

- Uses `scene='relation_feed_same'`.
- Filters by parent/child relation.
- Suitable for “same series” or “child works” views.

## Maintaining pagination continuity

To keep recommendation results consistent across pages, you must use `biz_trace_id` correctly.

### Correct paging flow

**Core principle: always reuse the `biz_trace_id` returned by the first request for all subsequent pages.**

```bash
# First request (page 0)
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 10 > /tmp/page0.json

# Extract biz_trace_id
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# Page 1
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"

# Page 2
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 2 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"
```

### Incorrect patterns

**❌ Wrong 1: using the latest `biz_trace_id` from each page**

```bash
# Page 0
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID_0=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# Page 1
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID_0" > /tmp/page1.json
BIZ_TRACE_ID_1=$(cat /tmp/page1.json | jq -r '.page_data.biz_trace_id')

# Page 2 (WRONG: should still use BIZ_TRACE_ID_0)
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID_1"
```

**❌ Wrong 2: never passing `biz_trace_id`**

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1  # missing biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2  # missing biz_trace_id
```

Each call starts a new session, and recommendations may not be consistent.

## Parameter combinations

### Combo 1: basic browsing

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 10
```

### Combo 2: profile + paging

```bash
# Page 0
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "user-uuid"

# Page 1 (using returned biz_trace_id)
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "user-uuid" \
  --biz_trace_id "VALUE_FROM_PREVIOUS_PAGE"
```

### Combo 3: precise relation scene

```bash
# View child works for a parent collection
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 15 \
  --scene 'relation_feed_same' \
  --collection_uuid "parent-work-uuid"
```

## Output structure

### `module_list` module types

The returned `module_list` contains different kinds of modules:

1. **NORMAL** — standard collection modules
   - `template_id: "NORMAL"`
   - Full collection info, cover image, author info, etc.

2. **DRAFT** — draft modules
   - `template_id: "DRAFT"`
   - Unfinished drafts created by the user.

3. **SPACE** — space entry modules
   - `template_id: "into_space"`
   - Used to guide users into specific spaces.

### Key data fields

Each module item contains:

- `data_id`: unique module identifier
- `module_id`: module type (NORMAL/DRAFT/SPACE)
- `template_id`: template type
- `json_data`: template‑specific payload, for example:
  - `uuid`: collection UUID
  - `name`: collection name
  - `coverUrl`: cover image URL
  - creator and stats fields, etc.

## Performance tips

### 1. Reasonable `page_size`

- Home feed: 10–20 (balance speed and volume).
- Profile pages: 20–30 (users have more intent).
- Related content: 10–15 (quick exploration).
- Single detail: 1 (for detail‑only views).

### 2. Caching

Cache feed results to avoid repeated calls:

```bash
# Cache first page
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/feed_cache.json

# Reuse cache
cat /tmp/feed_cache.json | jq '.module_list'
```

### 3. Preloading

Preload the next page while the user is viewing the current one:

```bash
# Current page
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json &

# Preload next page
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 > /tmp/page1.prefetch.json &
wait
```

## Debugging tips

### 1. Verify scenes

Check whether the returned `module_list` matches expectations:

- Home feed: diverse content.
- Profile: only works by that user.
- Related: content similar to the seed collection.

### 2. Check `biz_trace_id` consistency

```bash
# Request with a specified biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --biz_trace_id "your-biz-trace-id" > /tmp/response.json

# Compare with returned value
cat /tmp/response.json | jq '.page_data.biz_trace_id'
```

### 3. Enable debug logs

```bash
DEBUG=* npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0
```

## FAQ

### Q: Why is the result empty?

Possible reasons:

- Scene parameters are inconsistent.
- `collection_uuid` or `target_user_uuid` is invalid.
- There is genuinely no content for that scenario.

Solutions:

- First try the default scene (no extra parameters).
- Validate that UUIDs are correct.
- Check if `page_index` is excessively large.

### Q: Which `biz_trace_id` should I use?

**Always use the one from the first page**:

```bash
# Correct
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID"
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID"
```

### Q: How to distinguish different content types in NORMAL modules?

Inspect fields in `json_data`, for example:

- `has_video`: whether there’s a video.
- `bgm_uuid`: whether there’s background music.
- `is_interactive`: whether it’s interactive content.

## Summary

Key points for using `request_interactive_feed`:

1. **Understand scene inference**: scenes are switched automatically by parameter combinations.
2. **Use `page_index` correctly**: `0` is usually detail/first page, `>0` is recommendations.
3. **Maintain `biz_trace_id`**: to keep sessions consistent.
4. **Set `page_size` appropriately**: depending on the context.
5. **Use `scene` when needed**: for precise control in advanced scenarios.

Following these practices will help you get better and more consistent feed results.


# @neta/skills-neta

## 0.15.1

### Patch Changes

- support network media url for media assets upload

## 0.15.0

### Minor Changes

- support media assets upload

## 0.14.3

### Patch Changes

- fix api logger env problem

## 0.14.2

### Patch Changes

- usage analytics

## 0.14.1

### Patch Changes

- - Add api logs for debug.
  - Add api timeout with 10000ms.

  - Fixed error info about remove_background input_image param in docs.

## 0.14.0

### Minor Changes

- 54180c1: feat(premium): implement premium subscription commands and integrate dayjs for date handling

  - Add premium subscription CLI commands: `create_premium_order`, `pay_premium_order`, `get_current_premium_plan`, `get_premium_order`, `list_premium_orders`, `list_premium_plans`; wire commerce APIs and command loading.
  - Add `dayjs` and `src/utils/date.ts` for date formatting/parsing; adjust `parse_meta` as needed.
  - Update `README.md` and `skills/neta-creative/SKILL.md`; add `skills/neta-creative/references/premium.md` for premium workflows.

## 0.13.0

### Minor Changes

- rename all "travel" keywords in docs、commands to "adventure"

## 0.12.0

### Minor Changes

- 0a03853: introduce neta-travel skill for creating and playing AI-driven interactive story adventures (travel campaigns)

## 0.11.0

### Minor Changes

- make image command support size params and model selection

## 0.10.0

### Minor Changes

- bump npm package version

## 0.9.0

### Minor Changes

- add commands about character create and management

## 0.8.0

### Minor Changes

- use https://api.talesofai.com for default api endpoint

## 0.7.0

### Minor Changes

- docs fix

## 0.6.0

### Minor Changes

- i18n changes for commands

## 0.5.0

### Minor Changes

- README.en.md created to host the full English README, with cross-links between README.md and README.en.md.
  skills/neta/SKILL.md now documents the new discovery-related commands (interactive feed and suggestion APIs) and fixes CLI examples.
  collection-remix.md formatting improved for constraint bullets.
  New reference docs community-exploration.md and interactive-feed.md describe best practices for discovery workflows and interactive feeds (currently written in Chinese but affect the doc surface).

  Updated apis/index.ts and feeds.ts to wire in new recommendation / interactive endpoints.
  Added recsys.ts (and built recsys.js) as the dedicated client for recommendation-system APIs backing suggest_content and related flows.
  Extended commands/schema.ts (and built JS) so the schema reflects all newly added community / discovery commands.

  Added a new set of community / discovery commands (both TypeScript source and built JS):
  request_interactive_feed for interactive feed retrieval across homepage, collection relations, user profiles, and comment-thread children.
  suggest_keywords for prefix-based keyword suggestions.
  suggest_tags for keyword-based tag suggestions.
  suggest_categories for hierarchical category navigation (levels 1–3).
  validate_tax_path to check the validity of taxonomy paths.
  suggest_content as a flexible content stream engine with recommend, search, and exact intents plus rich include/exclude filters.
  Added / updated the corresponding localized command metadata files (\*.cmd.zh_cn.yml) and built JS handlers under skills/neta/bin/commands/community/.

## 0.4.0

### Minor Changes

- appends space commands

## 0.3.0

### Minor Changes

- add collection publish command

## 0.2.0

### Minor Changes

- structure refactor

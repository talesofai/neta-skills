# @neta/skills-neta

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

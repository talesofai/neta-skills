# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[English](./README.md) · [简体中文](./README.zh_cn.md)

---

## Overview

**NETA Skills** is a collection of powerful AI agent skills and accompanying CLI tools designed for interacting with the [Neta Art](https://www.neta.art/) API. Built for developers and AI agents, it seamlessly extends any agent's capabilities to generate multimedia, manage characters, and process audio/video workflows.

You can get your access token from the [Neta Open Portal](https://www.neta.art/open/).

---

## ✨ Features

- 🎨 **Multimedia Creation:** Generate stunning images, videos, and songs using state-of-the-art AI models.
- 🔧 **Image & Video Processing:** Effortlessly remove backgrounds and merge video assets.
- 👤 **Character & Style Management:** Search, fetch details, and manage characters and stylistic elements.
- 🏷️ **Community Integrations:** Explore trending hashtags, popular characters, and curated collections.
- 🧭 **Smart Discovery & Suggestions:** Explore interactive feeds and get keyword, tag, and category suggestions for progressive content discovery.
- 🤖 **Agent First:** Designed from the ground up to plug into your favorite AI agent frameworks.

---

## 🚀 Getting Started with Skills

The primary way to use this project is by installing the skills into your AI agent environment.

### Installation (skills.sh)

Install the unified [`neta`](skills/neta/SKILL.md) skill into your agent:

```bash
npx skills add talesofai/neta-skills/skills/neta
```

You can also install the specialized skills separately if your agent prefers more granular capabilities:

```bash
# Community exploration (hashtags, spaces, interactive feed)
npx skills add talesofai/neta-skills/skills/neta-community

# Creation workflows (image / video / song)
npx skills add talesofai/neta-skills/skills/neta-creative

# Discovery & suggestions (keywords, tags, categories, content)
npx skills add talesofai/neta-skills/skills/neta-suggest

# Space navigation & exploration
npx skills add talesofai/neta-skills/skills/neta-space

# Character VToken creation and management
npx skills add talesofai/neta-skills/skills/neta-character

# Elementum VToken creation and management
npx skills add talesofai/neta-skills/skills/neta-elementum
```

### Available Commands

The skill includes **30 commands** for various tasks:

| Category | Command | Description |
|----------|---------|-------------|
| **Creation** | `make_image` | Generate images from text prompts |
| | `make_video` | Generate videos from images and prompts |
| | `make_song` | Compose songs with custom prompts and lyrics |
| | `remove_background` | Remove the background from an image |
| | `edit_collection` | Edit an existing collection (name, description, tags, status, etc.) |
| | `publish_collection` | Publish or update a collection |
| | `search_character_or_elementum` | Search reusable TCP building blocks (characters / elements / flows) |
| **VToken Management** | `create_character` | Create a character VToken (consumes credits) |
| | `update_character` | Update an existing character VToken |
| | `list_my_characters` | List all characters created by the current user |
| | `create_elementum` | Create an elementum VToken (consumes credits) |
| | `update_elementum` | Update an existing elementum VToken |
| | `list_my_elementum` | List all elementa created by the current user |
| **Characters** | `request_character_or_elementum` | Fetch character or elementum details by name or UUID |
| **Community** | `get_hashtag_info` | Get details and lore for a specific hashtag |
| | `get_hashtag_characters` | Get a list of characters under a hashtag |
| | `get_hashtag_collections` | Get curated collections under a hashtag |
| | `read_collection` | Read details for a specific collection (玩法) |
| | `list_spaces` | List spaces that can be explored |
| | `list_space_topics` | List topics available under a specific space |
| | `request_interactive_feed` | Get interactive content feeds for collections, spaces, and users |
| | `suggest_keywords` | Get autocomplete suggestions for search keywords |
| | `suggest_tags` | Get recommended hashtags related to a keyword |
| | `suggest_categories` | Get navigation suggestions for taxonomy categories |
| | `validate_tax_path` | Validate that a taxonomy path is valid |
| | `suggest_content` | Discover content via recommend, search, or exact filter modes |
| | `get_fan_list` | Get the list of users who follow the current user |
| | `get_subscribe_list` | Get the list of creators the current user follows |
| | `favor_collection` | Favorite or unfavorite a collection |
| | `like_collection` | Like or unlike a collection |
| | `subscribe_user` | Follow or unfollow a creator |
| | `create_comment` | Create a comment on a collection |

---

## 🛠️ CLI Usage (`@talesofai/neta-skills`)

The project also ships a standalone CLI package `@talesofai/neta-skills` for testing, scripting, and CI automation.

### Install CLI

```bash
# Global install (recommended)
npm install -g @talesofai/neta-skills

# Or use npx / pnpm dlx without global install
npx @talesofai/neta-skills --help
pnpm dlx @talesofai/neta-skills --help
```

Configure your environment:

```bash
# Set NETA_TOKEN in your environment or put it into a .env / .env.local file
export NETA_TOKEN=your_token_here
```

### Running Commands

```bash
# Get general help or specific command help
neta-cli --help
neta-cli make_image --help

# Example: Generate an image
neta-cli make_image --prompt "A cyberpunk cityscape at night" --aspect "16:9"

# Example: Search for characters or elementum
neta-cli search_character_or_elementum --keywords "fantasy"
```

---

## 📂 Project Structure

```text
neta-skills/
├── skills/
│   ├── neta/                       # Unified Neta skill (agent-first)
│   │   └── SKILL.md                # Core skill documentation (EN)
│   ├── neta-community/             # Community / hashtag / space exploration skills (EN)
│   ├── neta-creative/              # Image / video / song creation skills (EN)
│   ├── neta-suggest/               # Discovery & suggestion skills (EN)
│   ├── neta-space/                 # Space navigation & exploration skills (EN)
│   ├── neta-character/             # Character VToken creation & management (EN)
│   ├── neta-elementum/             # Elementum VToken creation & management (EN)
│   └── zh_cn/                      # Chinese-localized skills & references
│       ├── neta/
│       ├── neta-community/
│       ├── neta-creative/
│       ├── neta-suggest/
│       ├── neta-space/
│       ├── neta-character/
│       └── neta-elementum/
├── src/                            # TypeScript source for the CLI
│   ├── apis/                       # Typed Neta API client helpers
│   ├── commands/                   # CLI command definitions (TS + YAML meta)
│   ├── utils/                      # Shared utilities
│   └── cli.ts                      # CLI entrypoint (TypeScript)
├── bin/                            # Built JavaScript output for the CLI
│   ├── apis/
│   ├── commands/
│   ├── utils/
│   └── cli.js                      # CLI entrypoint (compiled JS)
├── scripts/
│   └── postbuild.js                # Build/post-build helpers
├── .env.example                    # Environment variable template
├── package.json                    # Root package config / scripts
├── pnpm-lock.yaml                  # Dependency lockfile
├── tsconfig.json                   # TypeScript configuration
├── biome.json                      # Biome (formatter / linter) config
└── lint-staged.config.mjs          # lint-staged configuration
```

---

## 📖 Best Practices & Workflows (References)

The `skills/neta/references/` directory contains detailed **best practice workflows**. These guides are designed to help AI agents (and developers) understand how to combine multiple commands to achieve complex goals effectively. 

Agents use these references to learn the optimal sequence of actions, parameter tuning, and standard operating procedures for specific NETA Art workflows, such as:

- **Image & Video Generation:** Best practices for chaining prompts, generating assets, and assembling videos.
- **Song & MV Creation:** Workflows for composing songs and creating music videos with synchronized visuals.
- **Character & Hashtag Research:** Processes for finding trending content, searching characters, and utilizing community trends.
- **Character & Elementum Creation:** Character creation and elementum alchemy workflows.

---

## 📝 Environment Variables

Both the AI agent skills and the CLI require the following environment configuration:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NETA_TOKEN` | ✅ | - | Your Neta Art API access token. |
| `NETA_API_BASE_URL` | ❌ | default: `https://api.talesofai.com` | Base URL for the Neta API. |

### i18n and locale detection

The CLI and skills automatically detect the current locale and map it to internal language variants:

- Locales starting with `zh` (for example, `zh_CN`, `en_US`) → use `zh_cn` docs and metadata.
- All other locales → default to `en_us` docs and metadata.

In terminal environments, locale is typically controlled by:

- Your operating system language settings (macOS / Linux / Windows), and
- Environment variables such as `LC_ALL`, `LC_MESSAGES`, `LANG`, and `LANGUAGE`.

If you want to force a specific language for a single command, you can prefix it with the desired locale, for example:

```bash
LC_ALL=zh_CN.UTF-8 neta-cli make_image --help
LANG=en_US.UTF-8 neta-cli make_image --help
```

---

## 🔧 Development

To develop and test locally:

```bash
# Install dependencies
corepack enabled
pnpm i

# Run TypeScript type checking
pnpm type-check

# Run lint
pnpm lint

# Test CLI commands locally
pnpm dev <command> [options]

# Build bin scripts
pnpm build
```

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🔗 Links

- [Neta Art Official Website](https://www.neta.art/)
- [skills.sh Documentation](https://skills.sh/docs)


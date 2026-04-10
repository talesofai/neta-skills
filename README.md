# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D22-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[English](./README.md) · [简体中文](./README.zh_cn.md)

---

## Overview

**NETA Skills** is a collection of powerful AI agent skills and accompanying CLI tools designed for interacting with the [Neta Art](https://www.neta.art/) API. Built for developers and AI agents, it seamlessly extends any agent's capabilities to generate multimedia, manage characters, and process audio/video workflows.

You can get your access token (`NETA_TOKEN`) from the [Neta Open Portal](https://www.neta.art/open/). On the **global** API host, you may also sign in with the CLI `login` command (OAuth device flow) instead of pasting a token into every environment—see [Authentication](#authentication-neta_token-vs-login) below.

---

## ✨ Features

- 🎨 **Multimedia Creation:** Generate stunning images, videos, and songs using state-of-the-art AI models.
- ⭐ **Premium & Subscriptions:** List plans, create orders, start Stripe checkout, and verify the active tier via dedicated CLI commands (global API environment).
- 🔧 **Image & Video Processing:** Effortlessly remove backgrounds and merge video assets.
- 👤 **Character & Style Management:** Search, fetch details, and manage characters and stylistic elements.
- 🏷️ **Community Integrations:** Explore trending hashtags, popular characters, and curated collections.
- 🧭 **Smart Discovery & Suggestions:** Explore interactive feeds and get keyword, tag, and category suggestions for progressive content discovery.
- 📖 **Interactive Story Adventures:** Craft and play AI-driven narrative campaigns (Adventure) — the agent acts as DM and character roleplayer for immersive interactive fiction.
- 🤖 **Agent First:** Designed from the ground up to plug into your favorite AI agent frameworks.
- 🔐 **CLI sign-in (optional):** On the **global** API host (`api.talesofai.com`), you can use OAuth **device authorization** via `neta login` instead of copying `NETA_TOKEN` into every environment.

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

# Creation workflows (image / video / song) and premium subscription flows
npx skills add talesofai/neta-skills/skills/neta-creative

# Discovery & suggestions (keywords, tags, categories, content)
npx skills add talesofai/neta-skills/skills/neta-suggest

# Space navigation & exploration
npx skills add talesofai/neta-skills/skills/neta-space

# Character VToken creation and management
npx skills add talesofai/neta-skills/skills/neta-character

# Elementum VToken creation and management
npx skills add talesofai/neta-skills/skills/neta-elementum

# AI-driven interactive story adventures (Adventure Campaigns)
npx skills add talesofai/neta-skills/skills/neta-adventure
```

### Available Commands

The skill includes **49 commands** for various tasks:

| Category | Command | Description |
|----------|---------|-------------|
| **User** | `login` | Start OAuth device login (`request-code`) or complete it (`verify-code`); stores tokens locally on success |
| | `logout` | Clear stored CLI session (access token and any in-progress device flow) |
| | `me` | Show the authenticated user's profile, AP balance, and asset totals |
| **Adventure Campaigns** | `create_adventure_campaign` | Create an AI-driven interactive story adventure |
| | `update_adventure_campaign` | Update an existing adventure campaign |
| | `list_my_adventure_campaigns` | List your created adventure campaigns |
| | `request_adventure_campaign` | Load full campaign details for play mode |
| **Creation** | `make_image` | Generate images from text prompts |
| | `make_video` | Generate videos from images and prompts |
| | `make_song` | Compose songs with custom prompts and lyrics |
| | `remove_background` | Remove the background from an image |
| | `edit_collection` | Edit an existing collection (name, description, tags, status, etc.) |
| | `publish_collection` | Publish or update a collection |
| | `search_character_or_elementum` | Search reusable TCP building blocks (characters / elements / flows) |
| | `get_ap_info` | Get detailed AP (Action Points) balance breakdown |
| | `get_ap_history` | Get paginated AP consumption and recharge history |
| | `list_my_artifacts` | List your generated media assets with filters |
| | `upload` | Upload a local or remote media file to create a media artifact |
| **Premium** | `get_current_premium_plan` | Get the signed-in user’s current tier and subscription end when applicable |
| | `list_premium_plans` | List available premium plans and SPU UUIDs |
| | `create_premium_order` | Create an order for a plan (by SPU UUID) |
| | `get_premium_order` | Fetch details for a single premium order |
| | `list_premium_orders` | List premium orders (paginated) |
| | `pay_premium_order` | Start payment for an unpaid order (e.g. Stripe Checkout) |
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

### Authentication (`NETA_TOKEN` vs `login`)

You can authenticate in either of these ways:

1. **Environment token (works everywhere)**  
   Set `NETA_TOKEN` from the [Neta Open Portal](https://www.neta.art/open/). The CLI and API client send it as the `x-token` header when no stored session exists.

2. **CLI device login (global API only)**  
   When `NETA_API_BASE_URL` points at the **global** host (`…talesofai.com`), you can run:

   ```bash
   npx -y @talesofai/neta-skills@latest login
   ```

   The command returns OAuth device fields. Open **`verification_uri_complete`** in a browser, finish sign-in, then run:

   ```bash
   npx -y @talesofai/neta-skills@latest login --action verify-code
   ```

   On success, tokens are stored under the app config directory (see `NETA_CONFIG_DIR` below). Subsequent API calls use `Authorization: Bearer …` until the session expires or you run `logout`.

If the CLI reports that login is not supported for your **region** (non-global API), use `NETA_TOKEN` instead.

### Running Commands

```bash
# Get general help or specific command help
npx -y @talesofai/neta-skills@latest --help
npx -y @talesofai/neta-skills@latest make_image --help

# Example: Generate an image
npx -y @talesofai/neta-skills@latest make_image --prompt "A cyberpunk cityscape at night" --aspect "16:9"

# Example: Search for characters or elementum
npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "fantasy"
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
│   ├── neta-adventure/                # Interactive story adventures / Adventure Campaigns (EN)
│   └── zh_cn/                      # Chinese-localized skills & references
│       ├── neta/
│       ├── neta-community/
│       ├── neta-creative/
│       ├── neta-suggest/
│       ├── neta-space/
│       ├── neta-character/
│       ├── neta-elementum/
│       └── neta-adventure/
├── src/                            # TypeScript source for the CLI
│   ├── apis/                       # Typed Neta API client helpers (incl. commerce)
│   ├── commands/                   # CLI command groups: user, creative, community, adventure, VToken, premium, …
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
- **Premium / Subscriptions:** Plan listing, order lifecycle, checkout channels, and environment limits. See `skills/neta-creative/references/premium.md`.
- **Adventure Campaign Crafting & Play:** Multi-turn story creation workflow (Craft Mode), interactive session management (Play Mode), field reference, and complete genre examples. See `skills/neta-adventure/references/`.

---

## 📝 Environment Variables

Both the AI agent skills and the CLI require the following environment configuration:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NETA_TOKEN` | Conditional* | - | API access token from the [Neta Open Portal](https://www.neta.art/open/). Required when not using a CLI session from `login`. |
| `NETA_API_BASE_URL` | ❌ | `https://api.talesofai.com` | Base URL for the Neta API. Device login is only available when this resolves to the **global** host (`…talesofai.com`). |
| `NETA_AUTH_API_BASE_URL` | ❌ | derived from `NETA_API_BASE_URL` | OIDC / token endpoints for `login` and refresh (override for custom stacks). |
| `NETA_CLIENT_ID` | ❌ | built-in public client id | OAuth client id for device login and refresh. |
| `NETA_CONFIG_DIR` | ❌ | OS-specific config path | Directory where the CLI stores OAuth tokens and device-flow state (see `env-paths` + `neta-cli`). |
| `DISABLE_TELEMETRY` | ❌ | unset | Set to `1` to disable CLI usage analytics (see below). |

\* If you have completed `login` / `verify-code` successfully on the global API, the CLI can run without `NETA_TOKEN` until you `logout` or the refresh session is cleared.

### CLI usage analytics (telemetry)

The `@talesofai/neta-skills` CLI sends lightweight usage data—such as which command ran, the options you passed, CLI version and locale, a coarse API-region hint, outcomes and timing, and your user UUID when signed in (not your API token)—so we can measure reliability and improve the experience.

To disable analytics entirely, set `DISABLE_TELEMETRY=1` in your environment; no telemetry HTTP requests are sent.

### i18n and locale detection

The CLI and skills automatically detect the current locale and map it to internal language variants:

- Locales starting with `zh` (for example, `zh_CN`, `en_US`) → use `zh_cn` docs and metadata.
- All other locales → default to `en_us` docs and metadata.

In terminal environments, locale is typically controlled by:

- Your operating system language settings (macOS / Linux / Windows), and
- Environment variables such as `LC_ALL`, `LC_MESSAGES`, `LANG`, and `LANGUAGE`.

If you want to force a specific language for a single command, you can prefix it with the desired locale, for example:

```bash
LC_ALL=zh_CN.UTF-8 npx -y @talesofai/neta-skills@latest make_image --help
LANG=en_US.UTF-8 npx -y @talesofai/neta-skills@latest make_image --help
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

# Test CLI commands locally (commands without extra flags)
pnpm dev -- <command>

# Subcommands with options: `pnpm` may insert `--` before argv; use the entrypoint directly, e.g.:
# NODE_ENV=development node src/cli.ts get_ap_history --page_size 5

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


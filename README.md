# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

**NETA Skills** is a collection of powerful AI agent skills and accompanying CLI tools designed for interacting with the [Neta Art](https://www.neta.art/) API. Built for developers and AI agents, it seamlessly extends any agent's capabilities to generate multimedia, manage characters, and process audio/video workflows.

---

## ✨ Features

- 🎨 **Multimedia Creation:** Generate stunning images, videos, and songs using state-of-the-art AI models.
- 🔧 **Image & Video Processing:** Effortlessly remove backgrounds and merge video assets.
- 👤 **Character & Style Management:** Search, fetch details, and manage characters and stylistic elements.
- 🏷️ **Community Integrations:** Explore trending hashtags, popular characters, and curated collections.
- 🤖 **Agent First:** Designed from the ground up to plug into your favorite AI agent frameworks.

## 🚀 Getting Started with Skills

The primary way to use this project is by installing the skills into your AI agent environment.

### Installation

Install the unified [`neta`](skills/neta/SKILL.md) skill into your agent:

```bash
npx skills add neta-skills/skills/neta
```

### Available Commands

The skill includes 12 commands for various tasks:

| Category | Command | Description |
|----------|---------|-------------|
| **Creation** | `make-image` | Generate images from text prompts |
| | `make-video` | Generate videos from images and prompts |
| | `make-song` | Compose songs with custom prompts and lyrics |
| | `remove-background` | Remove the background from an image |
| | `merge-video` | Merge multiple media assets into a single video |
| **Characters**| `search-tcp` | Search for characters and style elements |
| | `request-character` | Fetch character details by name |
| | `request-character-or-style` | Fetch character/style details by name or UUID |
| | `request-bgm` | Fetch background music |
| **Community**| `get-hashtag-info` | Get details about a specific hashtag |
| | `get-hashtag-characters` | Get a list of characters under a hashtag |
| | `get-hashtag-collections` | Get curated collections under a hashtag |

---

## 🛠️ CLI Usage

The unified skill includes a built-in CLI for testing and automation.

### Setup

```bash
# 1. Clone & Install
git clone https://github.com/neta-skills.git
cd neta-skills/skills/neta
npm install

# 2. Configure Environment
# Set NETA_TOKEN in your environment or create a .env file
export NETA_TOKEN=your_token_here
```

### Running Commands

```bash
# Get general help or specific command help
npm start --help
npm start make-image --help

# Example: Generate an image
npm start make-image -p "A cyberpunk cityscape at night" -a "16:9"

# Example: Search for characters
npm start search-tcp -k "fantasy"
```

---

## 📂 Project Structure

```text
neta-skills/
├── skills/
│   └── neta/                   # Unified skill with full CLI
│       ├── SKILL.md            # Skill documentation
│       ├── package.json        # Dependencies
│       ├── src/
│       │   ├── cli.ts          # CLI entry point
│       │   ├── api/            # API client
│       │   ├── commands/       # Command definitions
│       │   └── types.ts        # TypeScript types
│       └── references/         # Best practices & workflow guides
├── .env.example                # Environment template
└── package.json                # Root config
```

## 📖 Best Practices & Workflows (References)

The `skills/neta/references/` directory contains detailed **best practice workflows**. These guides are designed to help AI agents (and developers) understand how to combine multiple commands to achieve complex goals effectively. 

Agents use these references to learn the optimal sequence of actions, parameter tuning, and standard operating procedures for specific NETA Art workflows, such as:
- **Image & Video Generation:** Best practices for chaining prompts, generating assets, and assembling videos.
- **Song & MV Creation:** Workflows for composing songs and creating music videos with synchronized visuals.
- **Character & Hashtag Research:** Processes for finding trending content, searching characters, and utilizing community trends.

## 📝 Environment Variables

Both the AI agent skills and the CLI require the following environment configuration:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NETA_TOKEN` | ✅ | - | Your Neta Art API access token. |
| `NETA_BASE_URL` | ❌ | `https://api.talesofai.cn` | Base URL for the Neta API. |

## 🔧 Development

To develop and test locally:

```bash
# Install dependencies
cd skills/neta
npm install

# Run TypeScript type checking
npm run typecheck

# Run lint
npm run lint

# Test CLI commands locally
npm start <command> [options]
```

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

## 🔗 Links

- [Neta Art Official Website](https://www.neta.art/)
- [skills.sh Documentation](https://skills.sh/docs)

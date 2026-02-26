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

### Installation via `skills.sh`
You can easily install these skills into your agent using the [skills.sh](https://skills.sh/docs) CLI:

```bash
npx skills add talesofai/neta-skills
```
*(Note: Depending on your agent setup, you may need to specify individual skill paths or configurations).*

### Available Skills

All skills are located in the `skills/` directory. Each skill contains a `SKILL.md` file detailing its capabilities, inputs, and outputs.

| Category | Skill | Description |
|----------|-------|-------------|
| **Creation** | [`make-image`](skills/make-image/SKILL.md) | Generate images from text prompts. |
| | [`make-video`](skills/make-video/SKILL.md) | Generate videos from images and prompts. |
| | [`make-song`](skills/make-song/SKILL.md) | Compose songs with custom prompts and lyrics. |
| | [`remove-background`](skills/remove-background/SKILL.md) | Remove the background from an image. |
| | [`merge-video`](skills/merge-video/SKILL.md) | Merge multiple media assets into a single video. |
| **Characters**| [`search-tcp`](skills/search-tcp/SKILL.md) | Search for characters and style elements. |
| | [`request-character`](skills/request-character/SKILL.md) | Fetch character details by name. |
| | [`request-character-or-style`](skills/request-character-or-style/SKILL.md)| Fetch character/style details by name or UUID. |
| | [`request-bgm`](skills/request-bgm/SKILL.md) | Fetch background music. |
| **Community**| [`get-hashtag-info`](skills/community/get-hashtag-info/SKILL.md)| Get details about a specific hashtag. |
| | [`get-hashtag-characters`](skills/community/get-hashtag-characters/SKILL.md)| Get a list of characters under a hashtag. |
| | [`get-hashtag-collections`](skills/community/get-hashtag-collections/SKILL.md)| Get curated collections under a hashtag. |

---

## 🛠️ CLI Usage (Optional)

While primarily designed as agent skills, the underlying CLI tools can also be executed manually for testing, automation, or integration into CI/CD pipelines.

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`

### Setup

```bash
# 1. Clone & Install
git clone https://github.com/talesofai/neta-skills.git
cd neta-skills
npm install

# 2. Configure Environment
cp .env.example .env
# Open .env and set your NETA_TOKEN
```

### Running Commands

You can execute tools via the `npm run neta` command.

```bash
# Get general help or specific command help
npm run neta -- --help
npm run neta -- make-image --help

# Example: Generate an image
npm run neta -- make-image --prompt "A cyberpunk cityscape at night" --aspect "16:9"

# Example: Search for characters
npm run neta -- search-tcp --keywords "fantasy"
```

---

## 📂 Project Structure

```text
neta-skills/
├── skills/                 # AI agent skills directory (SKILL.md files)
│   ├── make-image/
│   ├── make-video/
│   ├── community/
│   └── ...                 
├── packages/
│   └── neta-cli/           # Core CLI implementation backing the skills
│       ├── src/
│       │   ├── api/        # Neta Art API client
│       │   ├── commands/   # CLI command logic
│       │   └── index.ts    # CLI entry point
│       └── package.json
├── .env.example            # Environment template
└── package.json            # Root workspace config
```

## 📝 Environment Variables

Both the AI agent skills and the CLI require the following environment configuration:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NETA_TOKEN` | ✅ | - | Your Neta Art API access token. |
| `NETA_API_URL` | ❌ | `https://api.talesofai.com` | Base URL for the Neta Art API. |

## 🔧 Development

This project uses npm workspaces. To develop and test locally:

```bash
# Install dependencies
npm install

# Run TypeScript type checking
cd packages/neta-cli && npm run type-check

# Test CLI commands locally
npm run neta -- <command> [options]
```

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

## 🔗 Links

- [Neta Art Official Website](https://www.neta.art/)
- [skills.sh Documentation](https://skills.sh/docs)
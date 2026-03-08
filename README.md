# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[简体中文](./README.md) · [English](./README.en.md)

---

## 简体中文

### 简介

**NETA Skills** 是一组基于 [Neta Art](https://www.neta.art/) API 的 AI Agent 技能与 CLI 工具集合，帮助你在 Agent 环境中一站式完成：

- 生成图片 / 视频 / 歌曲等多媒体内容
- 查询与管理角色（Character）与风格元素（Elementum）
- 进行标签（Hashtag）与空间玩法探索
- 通过推荐引擎和互动 Feed 进行玩法内容发现

你可以在 [Neta 开放平台](https://www.neta.art/open/) 获取访问令牌 `NETA_TOKEN`。
也可以在[国内登陆账号后台](https://app.nieta.art/security) 获取访问令牌 `NETA_TOKEN`。

---

### ✨ 功能特性

- 🎨 **多媒体创作**：使用最新的 AI 模型生成图片、视频和歌曲。
- 🔧 **图像与视频处理**：支持移除背景、视频合并等常见素材处理流程。
- 👤 **角色与风格管理**：搜索、获取角色与风格元素详情，在创作中标准化复用。
- 🏷️ **社区与标签集成**：浏览热门标签、空间、玩法合集与角色。
- 🧭 **智能内容探索**：通过关键词建议、标签推荐、分类导航与智能内容流，渐进式发现玩法与内容。
- 🤖 **Agent 优先设计**：面向 AI Agent 场景设计，易于在各类 Agent 框架中集成调用。

---

### 🚀 在 Agent 中使用技能

在你的 Agent 环境中安装统一的 [`neta`](skills/neta/SKILL.md) 技能：

```bash
npx skills add talesofai/neta-skills/skills/neta
```

#### 可用指令总览

当前技能共包含 **18 个命令**，覆盖创作、角色与社区探索等场景：

| 分类 | 命令 | 说明 |
|------|------|------|
| **创作 Creation** | `make_image` | 基于提示词生成图片 |
| | `make_video` | 基于图片与动作描述生成视频 |
| | `make_song` | 基于风格与歌词生成歌曲 |
| | `remove_background` | 移除图片背景 |
| **角色 Characters** | `search_character_or_elementum` | 搜索角色与风格元素 |
| | `request_character_or_elementum` | 通过名称或 UUID 获取角色 / 元素详情 |
| **社区 Community** | `get_hashtag_info` | 查询标签基础信息与 worldbuilding lore |
| | `get_hashtag_characters` | 获取标签下的角色列表 |
| | `get_hashtag_collections` | 获取标签下的玩法合集 |
| | `read_collection` | 读取单个玩法合集（含 Remix 模板） |
| | `list_spaces` | 列出可游览的空间 |
| | `list_space_topics` | 获取空间下的子空间（topic）信息 |
| | `request_interactive_feed` | 获取玩法互动 Feed（合集、空间、用户等场景） |
| | `suggest_keywords` | 获取搜索关键词自动补全建议 |
| | `suggest_tags` | 基于关键词获取相关标签建议 |
| | `suggest_categories` | 按层级获取玩法分类导航 |
| | `validate_tax_path` | 验证分类路径是否有效 |
| | `suggest_content` | 推荐 / 搜索 / 精确筛选三模式内容流 |

更详细的中文 CLI 示例与最佳实践，请参考 `skills/neta/SKILL.md` 以及 `skills/neta/references/` 目录下的文档。

---

### 🛠️ CLI 使用（本地调试与自动化）

统一技能内置了 CLI，方便在本地或 CI 中调试与批量调用。

#### 安装与构建

```bash
# 1. 克隆仓库并安装依赖
git clone https://github.com/talesofai/neta-skills.git
cd neta-skills
corepack enabled
pnpm i
pnpm -r build

# 2. 配置环境变量
# 在环境中设置 NETA_TOKEN，或在项目根目录创建 .env
export NETA_TOKEN=your_token_here
```

#### 运行示例

```bash
# 查看帮助
pnpm start:skills --help
pnpm start:skills make_image --help

# 示例：生成一张图片
pnpm start:skills make_image \
  --prompt "夜晚的赛博朋克城市，霓虹灯，高楼大厦，雨中街道" \
  --aspect "16:9"

# 示例：搜索角色或元素
pnpm start:skills search_character_or_elementum \
  --keywords "幻想" \
  --parent_type "character"
```

---

### 📂 项目结构

```text
neta-skills/
├── skills/
│   └── neta/                   # 统一 Neta 技能（含 CLI）
│       ├── SKILL.md            # 技能说明与中文用法示例
│       ├── package.json        # 子包依赖配置
│       ├── src/
│       │   ├── cli.ts          # CLI 入口
│       │   ├── apis/           # API Client（activity, artifact, audio, verse 等）
│       │   ├── commands/       # 各类命令实现（assign, community, verse 等）
│       │   └── utils/          # 通用工具
│       ├── bin/                # 构建后的 JS 产物
│       ├── scripts/            # 构建与发布脚本
│       └── references/         # 最佳实践与工作流参考文档
├── .env.example                # 环境变量示例
└── package.json                # 根包配置
```

---

### 📖 最佳实践与工作流参考

`skills/neta/references/` 目录下提供了详细的中文工作流与 SOP，适合 AI Agent 在规划调用顺序时阅读，例如：

- **图片与视频生成**：提示词结构、宽高比选择、从图到视频的完整链路。
- **歌曲与 MV 创作**：歌词模板、风格设计、MV 视觉规划与多场景组合。
- **角色与标签调研**：如何通过角色 / 标签 / 空间找到合适的创作方向。
- **玩法内容探索**：使用 `suggest_*` 与 `suggest_content` 构建渐进式探索闭环。

---

### 📝 环境变量

无论在 Agent 还是 CLI 中使用，都需要正确配置以下环境变量：

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NETA_TOKEN` | ✅ | - | Neta Art API 访问令牌 |
| `NETA_BASE_URL` | ❌ | `https://api.talesofai.cn` | Neta API 网关地址 |

---

### 🔧 本地开发

在本地开发与调试时，可以使用以下脚本：

```bash
# 安装依赖
corepack enabled
pnpm i

# TypeScript 类型检查
pnpm -r type-check

# 代码检查（lint）
pnpm lint

# 本地调试技能（watch / dev）
pnpm dev:skills <command> [options]

# 构建 bin 脚本
pnpm -r build
```

---

### 📄 开源协议与链接

本项目基于 [MIT License](LICENSE) 开源。

- [Neta Art 官网](https://www.neta.art/)
- [skills.sh 文档](https://skills.sh/docs)


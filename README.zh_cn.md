# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[简体中文](./README.md) · [English](./README.en.md)

---

## 简介

**NETA Skills** 是一组基于 [Neta Art](https://www.neta.art/) API 的 AI Agent 技能与 CLI 工具集合，帮助你在 Agent 环境中一站式完成：

- 生成图片 / 视频 / 歌曲等多媒体内容
- 查询与管理角色（Character）与风格元素（Elementum）
- 进行标签（Hashtag）与空间玩法探索
- 通过推荐引擎和互动 Feed 进行玩法内容发现

你可以在 [Neta 开放平台](https://www.neta.art/open/) 获取访问令牌 `NETA_TOKEN`。
也可以在[国内登陆账号后台](https://app.nieta.art/security) 获取访问令牌 `NETA_TOKEN`。

---

## ✨ 功能特性

- 🎨 **多媒体创作**：使用最新的 AI 模型生成图片、视频和歌曲。
- 🔧 **图像与视频处理**：支持移除背景、视频合并等常见素材处理流程。
- 👤 **角色与风格管理**：搜索、获取角色与风格元素详情，在创作中标准化复用。
- 🏷️ **社区与标签集成**：浏览热门标签、空间、玩法合集与角色。
- 🧭 **智能内容探索**：通过关键词建议、标签推荐、分类导航与智能内容流，渐进式发现玩法与内容。
- 🤖 **Agent 优先设计**：面向 AI Agent 场景设计，易于在各类 Agent 框架中集成调用。

---

## 🚀 在 Agent 中使用技能

在你的 Agent 环境中安装统一的 [`neta`](skills/zh_cn/neta/SKILL.md) 技能：

```bash
npx skills add talesofai/neta-skills/skills/zh_cn/neta
```

如果你希望在 Agent 中按功能模块更精细地控制权限，也可以分别安装拆分后的技能：

```bash
# 社区 / 标签 / 空间探索
npx skills add talesofai/neta-skills/skills/zh_cn/neta-community

# 图片 / 视频 / 歌曲创作
npx skills add talesofai/neta-skills/skills/zh_cn/neta-creative

# 关键词 / 标签 / 分类 / 内容推荐与检索
npx skills add talesofai/neta-skills/skills/zh_cn/neta-suggest

# 空间导航与探索（space / topic）
npx skills add talesofai/neta-skills/skills/zh_cn/neta-space

# 角色 VToken 创建与管理
npx skills add talesofai/neta-skills/skills/zh_cn/neta-character

# 元素 VToken 创建与管理
npx skills add talesofai/neta-skills/skills/zh_cn/neta-elementum
```

### 可用指令总览

当前技能共包含 **30 个命令**，覆盖创作、角色与社区探索等场景：

| 分类 | 命令 | 说明 |
|------|------|------|
| **创作 Creation** | `make_image` | 基于提示词生成图片 |
| | `make_video` | 基于图片与动作描述生成视频 |
| | `make_song` | 基于风格与歌词生成歌曲 |
| | `remove_background` | 移除图片背景 |
| | `edit_collection` | 编辑已有玩法合集（名称、描述、标签、状态等） |
| | `publish_collection` | 发布或更新玩法合集内容 |
| | `search_character_or_elementum` | 搜索可复用的 TCP（角色 / 元素 / 玩法模块） |
| **VToken 管理** | `create_character` | 创建角色 VToken（消耗电量） |
| | `update_character` | 更新现有角色 VToken |
| | `create_elementum` | 创建元素 VToken（消耗电量） |
| | `update_elementum` | 更新现有元素 VToken |
| **角色 Characters** | `request_character_or_elementum` | 通过名称或 UUID 获取角色 / 元素详情 |
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
| | `get_fan_list` | 获取当前用户的粉丝列表 |
| | `get_subscribe_list` | 获取当前用户关注的创作者列表 |
| | `favor_collection` | 收藏 / 取消收藏玩法合集 |
| | `like_collection` | 点赞 / 取消点赞玩法合集 |
| | `subscribe_user` | 关注 / 取消关注创作者 |
| | `create_comment` | 对玩法合集创建评论 |

更详细的中文 CLI 示例与最佳实践，请参考 `skills/neta/SKILL.md` 以及 `skills/neta/references/` 目录下的文档。

---

## 🛠️ CLI 使用（`@talesofai/neta-skills`）

项目同时提供了一个独立的 CLI 包 `@talesofai/neta-skills`，适合在本地终端、脚本和 CI 中直接调用 Neta API。

### 安装 CLI

```bash
# 全局安装（推荐）
npm install -g @talesofai/neta-skills

# 或者使用 npx / pnpm dlx 临时调用
npx @talesofai/neta-skills --help
pnpm dlx @talesofai/neta-skills --help
```

配置环境变量：

```bash
# 在环境中设置 NETA_TOKEN，或在你的 .env / .env.local 中配置
export NETA_TOKEN=your_token_here
```

### 运行示例

```bash
# 查看帮助
neta-cli --help
neta-cli make_image --help

# 示例：生成一张图片
neta-cli make_image \
  --prompt "夜晚的赛博朋克城市，霓虹灯，高楼大厦，雨中街道" \
  --aspect "16:9"

# 示例：搜索角色或元素
neta-cli search_character_or_elementum \
  --keywords "幻想" \
  --parent_type "character"
```

---

## 📂 项目结构

```text
neta-skills/
├── skills/
│   ├── neta/                       # 英文统一 Neta 技能（Agent 优先）
│   │   └── SKILL.md                # 英文技能说明
│   ├── neta-community/             # 英文社区 / 标签 / 空间探索相关技能
│   ├── neta-creative/              # 英文图片 / 视频 / 歌曲创作相关技能
│   ├── neta-suggest/               # 英文推荐 / 搜索 / 分类导航技能
│   ├── neta-space/                 # 英文空间与话题导航 / 探索技能
│   ├── neta-character/             # 英文角色 VToken 创建与管理技能
│   ├── neta-elementum/             # 英文元素 VToken 创建与管理技能
│   └── zh_cn/                      # 中文本地化技能与参考文档
│       ├── neta/
│       ├── neta-community/
│       ├── neta-creative/
│       ├── neta-suggest/
│       ├── neta-space/
│       ├── neta-character/
│       └── neta-elementum/
├── src/                            # CLI 对应的 TypeScript 源码
│   ├── apis/                       # 封装后的 Neta API 调用
│   ├── commands/                   # CLI 命令定义（TS + YAML 描述）
│   ├── utils/                      # 通用工具方法
│   └── cli.ts                      # CLI 入口（TypeScript）
├── bin/                            # 构建后的 JavaScript 产物
│   ├── apis/
│   ├── commands/
│   ├── utils/
│   └── cli.js                      # CLI 入口（编译后的 JS）
├── scripts/
│   └── postbuild.js                # 构建 / 后处理脚本
├── .env.example                    # 环境变量示例文件
├── package.json                    # 根包配置与脚本
├── pnpm-lock.yaml                  # 依赖锁定文件
├── tsconfig.json                   # TypeScript 配置
├── biome.json                      # Biome（格式化 / Lint）配置
└── lint-staged.config.mjs          # lint-staged 配置
```

---

## 📖 最佳实践与工作流参考

`skills/neta/references/` 目录下提供了详细的中文工作流与 SOP，适合 AI Agent 在规划调用顺序时阅读，例如：

- **图片与视频生成**：提示词结构、宽高比选择、从图到视频的完整链路。
- **歌曲与 MV 创作**：歌词模板、风格设计、MV 视觉规划与多场景组合。
- **角色与标签调研**：如何通过角色 / 标签 / 空间找到合适的创作方向。
- **角色与元素创建**：角色创建和元素炼金的工作流。
- **玩法内容探索**：使用 `suggest_*` 与 `suggest_content` 构建渐进式探索闭环。

---

## 📝 环境变量

无论在 Agent 还是 CLI 中使用，都需要正确配置以下环境变量：

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NETA_TOKEN` | ✅ | - | Neta Art API 访问令牌 |
| `NETA_API_BASE_URL` | ❌ | default: `https://api.talesofai.com` | Neta API 网关地址 |

### 多语言与本地化（i18n）

CLI 与 Skills 会根据系统与环境变量自动选择使用的语言：

- 系统语言或环境变量以 `zh` 开头（如 `zh_CN`、`en_US`）→ 使用 `zh_cn` 文案与元数据；
- 其他语言环境 → 默认使用 `en_us` 文案与元数据。

在终端环境中，可以通过以下方式影响语言选择：

- 操作系统语言设置（macOS / Linux / Windows）；
- Shell 中的本地化环境变量：`LC_ALL`、`LC_MESSAGES`、`LANG`、`LANGUAGE` 等。

在需要强制指定语言时，推荐在运行命令前显式设置环境变量，例如：

```bash
LC_ALL=zh_CN.UTF-8 neta-cli make_image --help
LANG=en_US.UTF-8 neta-cli make_image --help
```

---

## 🔧 本地开发

在本地开发与调试时，可以使用以下脚本：

```bash
# 安装依赖
corepack enabled
pnpm i

# TypeScript 类型检查
pnpm type-check

# 代码检查（lint）
pnpm lint

# 本地调试技能（watch / dev）
pnpm dev <command> [options]

# 构建 bin 脚本
pnpm build
```

---

## 📄 开源协议与链接

本项目基于 [MIT License](LICENSE) 开源。

- [Neta Art 官网](https://www.neta.art/)
- [skills.sh 文档](https://skills.sh/docs)


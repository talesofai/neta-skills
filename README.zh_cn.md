# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D22-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

[简体中文](./README.md) · [English](./README.en.md)

---

## 简介

**NETA Skills** 是一组基于 [Neta Art](https://www.neta.art/) API 的 AI Agent 技能与 CLI 工具集合，帮助你在 Agent 环境中一站式完成：

- 生成图片 / 视频 / 歌曲等多媒体内容
- 查询与管理角色（Character）与风格元素（Elementum）
- 进行标签（Hashtag）与空间玩法探索
- 通过推荐引擎和互动 Feed 进行玩法内容发现
- 创作与游玩 AI 驱动的交互式故事冒险（奇遇剧本），Agent 担任 DM 与角色扮演者

你可以在 [Neta 开放平台](https://www.neta.art/open/) 或[国内账号后台](https://app.nieta.art/security) 获取访问令牌 `NETA_TOKEN`。在**全球** API 环境下，也可使用 CLI 的 `login`（OAuth 设备流）登录，详见下文「身份验证」小节。

---

## ✨ 功能特性

- 🎨 **多媒体创作**：使用最新的 AI 模型生成图片、视频和歌曲。
- 🔧 **图像与视频处理**：支持移除背景、视频合并等常见素材处理流程。
- 👤 **角色与风格管理**：搜索、获取角色与风格元素详情，在创作中标准化复用。
- 🏷️ **社区与标签集成**：浏览热门标签、空间、玩法合集与角色。
- 🧭 **智能内容探索**：通过关键词建议、标签推荐、分类导航与智能内容流，渐进式发现玩法与内容。
- 🤖 **Agent 优先设计**：面向 AI Agent 场景设计，易于在各类 Agent 框架中集成调用。
- 🔐 **CLI 登录（可选）**：在**全球** API 环境（`api.talesofai.com`）下，可通过 `login` 使用 OAuth **设备授权**登录，无需在每台环境手动配置 `NETA_TOKEN`。

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

# AI 驱动的交互式故事冒险（奇遇剧本）
npx skills add talesofai/neta-skills/skills/zh_cn/neta-adventure
```

### 可用指令总览

当前技能共包含 **36 个命令**，覆盖创作、奇遇、角色与社区探索等场景：

| 分类 | 命令 | 说明 |
|------|------|------|
| **用户 User** | `login` | OAuth 设备流：默认 `request-code` 发起登录；浏览器完成后用 `verify-code` 换票并写入本地会话 |
| | `logout` | 清除本地保存的访问令牌及未完成的设备授权状态 |
| **奇遇剧本 Adventure** | `create_adventure_campaign` | 创建 AI 驱动的交互式故事冒险剧本 |
| | `update_adventure_campaign` | 更新已有奇遇剧本 |
| | `list_my_adventure_campaigns` | 列出你创建的奇遇剧本 |
| | `request_adventure_campaign` | 加载完整剧本详情（游玩模式） |
| **创作 Creation** | `make_image` | 基于提示词生成图片 |
| | `make_video` | 基于图片与动作描述生成视频 |
| | `make_song` | 基于风格与歌词生成歌曲 |
| | `remove_background` | 移除图片背景 |
| | `edit_collection` | 编辑已有玩法合集（名称、描述、标签、状态等） |
| | `publish_collection` | 发布或更新玩法合集内容 |
| | `search_character_or_elementum` | 搜索可复用的 TCP（角色 / 元素 / 玩法模块） |
| **VToken 管理** | `create_character` | 创建角色 VToken（消耗电量） |
| | `update_character` | 更新现有角色 VToken |
| | `list_my_characters` | 列出当前用户创建的所有角色 |
| | `create_elementum` | 创建元素 VToken（消耗电量） |
| | `update_elementum` | 更新现有元素 VToken |
| | `list_my_elementum` | 列出当前用户创建的所有元素 |
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

### 身份验证（`NETA_TOKEN` 与 `login`）

任选其一即可：

1. **环境变量令牌（通用）**  
   在 [Neta 开放平台](https://www.neta.art/open/) 或国内后台获取 `NETA_TOKEN`。未建立 CLI 会话时，客户端会将其作为 `x-token` 发送。

2. **CLI 设备授权登录（仅全球 API）**  
   当 `NETA_API_BASE_URL` 为全球域名（`…talesofai.com`）时，可执行：

   ```bash
   npx -y @talesofai/neta-skills@latest login
   ```

   命令会返回 OAuth 设备授权字段。请让用户在浏览器中打开 **`verification_uri_complete`** 完成登录与授权，完成后执行：

   ```bash
   npx -y @talesofai/neta-skills@latest login --action verify-code
   ```

   成功后令牌保存在本机配置目录（见下文 `NETA_CONFIG_DIR`）。之后在会话有效期内，请求会携带 `Authorization: Bearer …`，直至执行 `logout` 或刷新失效。

若 CLI 提示**当前区域不支持**设备登录（非全球 API），请改用 `NETA_TOKEN`。

### 运行示例

```bash
# 查看帮助
npx -y @talesofai/neta-skills@latest --help
npx -y @talesofai/neta-skills@latest make_image --help

# 示例：生成一张图片
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "夜晚的赛博朋克城市，霓虹灯，高楼大厦，雨中街道" \
  --aspect "16:9"

# 示例：搜索角色或元素
npx -y @talesofai/neta-skills@latest search_character_or_elementum \
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
│   ├── neta-adventure/                # 英文交互式故事冒险（奇遇剧本）技能
│   └── zh_cn/                      # 中文本地化技能与参考文档
│       ├── neta/
│       ├── neta-community/
│       ├── neta-creative/
│       ├── neta-suggest/
│       ├── neta-space/
│       ├── neta-character/
│       ├── neta-elementum/
│       └── neta-adventure/
├── src/                            # CLI 对应的 TypeScript 源码
│   ├── apis/                       # 封装后的 Neta API 调用
│   ├── commands/                   # CLI 命令定义（含 user / creative / community 等）
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
- **奇遇剧本创作与游玩**：多轮协作故事创作工作流（创作模式）、交互式会话管理（游玩模式）、字段手册，以及含历史穿越、末世生存、武侠江湖的完整类型范例。见 `skills/zh_cn/neta-adventure/references/`。

---

## 📝 环境变量

无论在 Agent 还是 CLI 中使用，都需要正确配置以下环境变量：

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NETA_TOKEN` | 视情况* | - | 从开放平台或国内后台获取的 API 令牌；未使用 `login` 会话时必填 |
| `NETA_API_BASE_URL` | ❌ | `https://api.talesofai.com` | Neta API 网关；设备登录仅在指向**全球**域名（`…talesofai.com`）时可用 |
| `NETA_AUTH_API_BASE_URL` | ❌ | 由 `NETA_API_BASE_URL` 推导 | OIDC / 换票端点；自建环境可显式覆盖 |
| `NETA_CLIENT_ID` | ❌ | 内置公共客户端 ID | 设备流与刷新令牌使用的 OAuth `client_id` |
| `NETA_CONFIG_DIR` | ❌ | 系统配置目录 | CLI 存放 OAuth 令牌与设备流状态的目录（`env-paths` + `neta-cli`） |
| `DISABLE_TELEMETRY` | ❌ | 未设置 | 设为 `1` 可关闭 CLI 使用数据统计（见下文） |

\* 若你已在**全球** API 上成功执行 `login` / `verify-code`，在会话有效期间可不设 `NETA_TOKEN`，直至 `logout` 或刷新会话失效。

### CLI 使用数据（埋点 / 遥测）

`@talesofai/neta-skills` CLI 会上报轻量使用数据（例如执行的命令、命令行参数、CLI 版本与语言、大致 API 区域、执行结果与耗时、登录时的用户 UUID 等；**不包含** API Token），用于衡量稳定性并改进产品体验。

若不希望参与统计，请在环境中设置 `DISABLE_TELEMETRY=1`，此时不会发起相关上报请求。

### 多语言与本地化（i18n）

CLI 与 Skills 会根据系统与环境变量自动选择使用的语言：

- 系统语言或环境变量以 `zh` 开头（如 `zh_CN`、`en_US`）→ 使用 `zh_cn` 文案与元数据；
- 其他语言环境 → 默认使用 `en_us` 文案与元数据。

在终端环境中，可以通过以下方式影响语言选择：

- 操作系统语言设置（macOS / Linux / Windows）；
- Shell 中的本地化环境变量：`LC_ALL`、`LC_MESSAGES`、`LANG`、`LANGUAGE` 等。

在需要强制指定语言时，推荐在运行命令前显式设置环境变量，例如：

```bash
LC_ALL=zh_CN.UTF-8 npx -y @talesofai/neta-skills@latest make_image --help
LANG=en_US.UTF-8 npx -y @talesofai/neta-skills@latest make_image --help
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


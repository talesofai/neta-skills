# NETA Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

TalesofAI API CLI tools and [pi coding agent](https://github.com/mariozechner/pi-coding-agent) skills.

## ✨ 功能特性

- 🎨 **多媒体创作** - 生成图片、视频、音乐
- 🔧 **图像处理** - 移除背景、合并视频
- 👤 **角色管理** - 搜索角色、获取角色详情
- 🏷️ **社区功能** - 标签信息、角色列表、精选合集
- 🤖 **AI Skills** - 适用于 pi coding agent 的技能包

## 📦 安装

### 前置要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 步骤

1. 克隆仓库
```bash
git clone https://github.com/talesofai/neta-skills.git
cd neta-skills
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 NETA_TOKEN
```

## 🚀 使用方法

### CLI 命令

所有命令通过 `npm run neta` 执行：

```bash
# 查看所有命令
npm run neta -- --help

# 查看具体命令帮助
npm run neta -- make-image --help
```

#### 创作类命令

```bash
# 生成图片
npm run neta -- make-image --prompt "一个可爱的猫咪" --aspect "3:4"

# 生成视频 (图生视频)
npm run neta -- make-video \
  --image-source "https://example.com/image.jpg" \
  --prompt "让图片动起来" \
  --model "model_s"

# 生成歌曲
npm run neta -- make-song \
  --prompt "欢快的流行音乐" \
  --lyrics "这里是歌词内容..."

# 移除图片背景
npm run neta -- remove-background --input-image "artifact-uuid"

# 合并视频素材
npm run neta -- merge-video --input "合并指令"
```

#### 角色/元素类命令

```bash
# 搜索角色和元素
npm run neta -- search-tcp --keywords "角色名"

# 获取角色详情
npm run neta -- request-character --name "角色名"

# 获取角色或元素详情 (支持名称或 UUID)
npm run neta -- request-character-or-style --name "角色名"
npm run neta -- request-character-or-style --uuid "uuid-xxx"

# 获取背景音乐
npm run neta -- request-bgm
```

#### 社区类命令

```bash
# 获取标签信息
npm run neta -- get-hashtag-info --hashtag "标签名"

# 获取标签下的角色列表
npm run neta -- get-hashtag-characters --hashtag "标签名"

# 获取标签下的精选合集
npm run neta -- get-hashtag-collections --hashtag "标签名"
```

### CLI 参数说明

| 命令 | 参数 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `make-image` | `--prompt, -p` | ✅ | - | 图片描述提示词 |
| | `--aspect, -a` | ❌ | 3:4 | 宽高比 (1:1, 3:4, 4:3, 9:16, 16:9) |
| `make-video` | `--image-source, -i` | ✅ | - | 源图片 URL |
| | `--prompt, -p` | ✅ | - | 视频描述提示词 |
| | `--model, -m` | ❌ | model_s | 模型 (model_s: 快速，model_w: 高质量) |
| `make-song` | `--prompt, -p` | ✅ | - | 歌曲描述 (10-2000 字符) |
| | `--lyrics, -l` | ✅ | - | 歌词内容 (10-3500 字符) |
| `remove-background` | `--input-image, -i` | ✅ | - | 输入图片 artifact UUID |
| `merge-video` | `--input, -i` | ✅ | - | 合并指令/提示词 |
| `search-tcp` | `--keywords, -k` | ✅ | - | 搜索关键词 |
| | `--parent-type, -t` | ❌ | both | 类型 (character/elementum/both) |
| | `--sort-scheme, -s` | ❌ | best | 排序 (exact/best) |
| `request-character` | `--name, -n` | ✅ | - | 角色名称 |
| `request-character-or-style` | `--name, -n` | ❌* | - | 角色/元素名称 |
| | `--uuid, -u` | ❌* | - | 角色/元素 UUID |
| | `--parent-type, -t` | ❌ | both | 类型 |

*name 和 uuid 至少提供一个

### Skills

Skills 位于 `skills/` 目录，每个 skill 包含 `SKILL.md` 文件，可在 pi coding agent 中使用。

#### 创作类 Skills

| Skill | 描述 |
|-------|------|
| [`make-image`](skills/make-image/SKILL.md) | 基于文本提示词生成图片 |
| [`make-video`](skills/make-video/SKILL.md) | 基于图片和提示词生成视频 |
| [`make-song`](skills/make-song/SKILL.md) | 基于提示词和歌词生成歌曲 |
| [`remove-background`](skills/remove-background/SKILL.md) | 移除图片背景 |
| [`merge-video`](skills/merge-video/SKILL.md) | 将多个素材合并为视频 |

#### 角色/元素类 Skills

| Skill | 描述 |
|-------|------|
| [`search-tcp`](skills/search-tcp/SKILL.md) | 搜索角色和风格元素 |
| [`request-character`](skills/request-character/SKILL.md) | 通过名称获取角色详情 |
| [`request-character-or-style`](skills/request-character-or-style/SKILL.md) | 通过名称或 UUID 获取角色/元素详情 |
| [`request-bgm`](skills/request-bgm/SKILL.md) | 获取背景音乐 |

#### 社区类 Skills

| Skill | 描述 |
|-------|------|
| [`get-hashtag-info`](skills/community/get-hashtag-info/SKILL.md) | 获取标签详细信息 |
| [`get-hashtag-characters`](skills/community/get-hashtag-characters/SKILL.md) | 获取标签下的角色列表 |
| [`get-hashtag-collections`](skills/community/get-hashtag-collections/SKILL.md) | 获取标签下的精选合集 |

## 📁 项目结构

```
neta-skills/
├── packages/
│   └── neta-cli/           # CLI 工具包
│       ├── src/
│       │   ├── api/        # API 客户端
│       │   │   └── client.ts
│       │   ├── commands/   # CLI 命令实现
│       │   │   ├── community/
│       │   │   ├── make-image.ts
│       │   │   ├── make-video.ts
│       │   │   └── ...
│       │   ├── types.ts    # Zod 类型定义
│       │   └── index.ts    # CLI 入口
│       └── package.json
├── skills/
│   ├── make-image/
│   ├── make-video/
│   ├── make-song/
│   ├── remove-background/
│   ├── merge-video/
│   ├── search-tcp/
│   ├── request-character/
│   ├── request-character-or-style/
│   ├── request-bgm/
│   └── community/
│       ├── get-hashtag-info/
│       ├── get-hashtag-characters/
│       └── get-hashtag-collections/
├── .env.example            # 环境变量示例
├── .gitignore
├── package.json            # 根配置 (npm workspaces)
└── README.md
```

## 🔧 开发

```bash
# 安装依赖
npm install

# 类型检查
cd packages/neta-cli && npm run type-check

# 运行命令（开发模式）
npm run neta -- <command> [options]

# 查看帮助
npm run neta -- --help
```

## 📝 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `NETA_TOKEN` | ✅ | TalesofAI API 访问令牌 |
| `NETA_API_URL` | ❌ | API 基础 URL (默认：https://api.talesofai.com) |

## 📄 License

[MIT License](LICENSE)

## 🔗 相关链接

- [pi coding agent](https://github.com/mariozechner/pi-coding-agent)
- [TalesofAI](https://talesofai.com)

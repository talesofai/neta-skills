# NETA Skill

Neta API Agent Skill，为 AI 助手扩展 Neta API 交互能力，支持图片/视频/歌曲生成、角色/元素搜索、标签内容管理等场景。

## ✨ 功能特性

- 🎨 **图片生成**：基于文本提示词生成图片，支持多种宽高比
- 🎬 **视频生成**：将图片转换为动态视频，支持快速和高质量两种模式
- 🎵 **歌曲生成**：基于提示词和歌词创作歌曲
- ✂️ **移除背景**：一键抠图，移除图片背景
- 🎞️ **合并视频**：将多个素材合并为完整视频
- 🔍 **角色搜索**：模糊搜索角色和风格元素
- 📋 **角色详情**：获取角色或元素的详细信息
- 🏷️ **标签管理**：获取标签信息、角色列表和精选合集
- 🎼 **背景音乐**：获取推荐的背景音乐

## 📦 前置要求

- Node.js >= 18.x
- Neta API Token

## 🛠️ 安装

### 作为 Agent Skill 安装

使用 [`skills`](https://github.com/vercel-labs/skills) CLI 安装到你的 Agent 环境：

```bash
# 从 GitHub 安装
npx skills add neta-skills/skills/neta
```

### 本地开发安装

```bash
git clone https://github.com/talesofai/neta-skills.git
cd neta-skills/skills/neta
npm install
```

## ⚙️ 配置

设置环境变量 `NETA_TOKEN`：

```bash
export NETA_TOKEN=your_token_here
```

或在项目目录下创建 `.env` 文件：

```env
NETA_TOKEN=your_token_here
```

## 🚀 使用方法

### 图片生成

```bash
npm start make-image -p "一个可爱的猫咪" -a "3:4"
```

### 视频生成

```bash
npm start make-video -i "https://example.com/image.jpg" -p "让图片动起来" -m "model_s"
```

### 歌曲生成

```bash
npm start make-song -p "欢快的流行音乐" -l "这里是歌词内容..."
```

### 搜索角色

```bash
npm start search-tcp -k "魔法少女"
```

### 获取标签信息

```bash
npm start get-hashtag-info -t "标签名"
npm start get-hashtag-characters -t "标签名"
npm start get-hashtag-collections -t "标签名"
```

### 查看所有命令

```bash
npm start --help
```

## 📖 文档

- [SKILL.md](./SKILL.md) - 技能说明和参考文档索引
- [参考文档](./references/) - 按场景分类的最佳实践指南

## 🔧 开发

```bash
# 安装依赖
npm install

# 类型检查
npm run typecheck

# Lint 检查
npm run lint

# 运行命令
npm start <command> [options]
```

## 📁 项目结构

```
skills/neta/
├── SKILL.md              # 技能说明
├── README.md             # 本文件
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── biome.json            # Lint 配置
├── src/
│   ├── cli.ts            # CLI 入口
│   ├── api/
│   │   └── client.ts     # API 客户端
│   ├── commands/         # 命令定义
│   │   ├── make-image.ts
│   │   ├── make-video.ts
│   │   ├── make-song.ts
│   │   ├── remove-background.ts
│   │   ├── merge-video.ts
│   │   ├── search-tcp.ts
│   │   ├── request-character.ts
│   │   ├── request-character-or-style.ts
│   │   ├── request-bgm.ts
│   │   └── community/
│   │       ├── get-hashtag-info.ts
│   │       ├── get-hashtag-characters.ts
│   │       └── get-hashtag-collections.ts
│   └── types.ts          # 类型定义
└── references/
    └── api.md            # API 参考文档
```

## 📄 许可证

MIT License

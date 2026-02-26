# NETA Skills

TalesofAI API CLI tools and pi skills.

## 前置条件

1. 安装 Node.js (v20+)
2. 设置环境变量 `NETA_TOKEN`

```bash
export NETA_TOKEN=your_api_token_here
```

或创建 `.env` 文件：
```bash
cp .env.example .env
# 编辑 .env 填入 NETA_TOKEN
```

## 安装

```bash
npm install
```

## 使用方法

### CLI 命令

所有命令通过 `npm run neta` 执行：

```bash
# 查看所有命令
npm run neta -- --help

# 生成图片
npm run neta -- make-image --prompt "一个可爱的猫咪" --aspect "3:4"

# 生成视频
npm run neta -- make-video --image-source "https://example.com/image.jpg" --prompt "让图片动起来"

# 生成歌曲
npm run neta -- make-song --prompt "欢快的流行音乐" --lyrics "歌词内容..."

# 移除背景
npm run neta -- remove-background --input-image "artifact-uuid"

# 合并视频
npm run neta -- merge-video --input "合并指令"

# 搜索角色和元素
npm run neta -- search-tcp --keywords "角色名"

# 获取角色详情
npm run neta -- request-character --name "角色名"

# 获取角色或元素详情
npm run neta -- request-character-or-style --name "角色名"

# 获取背景音乐
npm run neta -- request-bgm

# 获取标签信息
npm run neta -- get-hashtag-info --hashtag "标签名"

# 获取标签角色
npm run neta -- get-hashtag-characters --hashtag "标签名"

# 获取标签合集
npm run neta -- get-hashtag-collections --hashtag "标签名"
```

### Skills

Skills 位于 `skills/` 目录，每个 skill 包含 `SKILL.md` 文件。

#### 创作类 Skills
- `make-image` - 生成图片
- `make-video` - 生成视频
- `make-song` - 生成歌曲
- `remove-background` - 移除背景
- `merge-video` - 合并视频

#### 角色/元素类 Skills
- `search-tcp` - 搜索角色和元素
- `request-character` - 获取角色详情
- `request-character-or-style` - 获取角色或元素详情
- `request-bgm` - 获取背景音乐

#### 社区类 Skills
- `get-hashtag-info` - 获取标签信息
- `get-hashtag-characters` - 获取标签角色
- `get-hashtag-collections` - 获取标签合集

## 项目结构

```
neta-skills/
├── packages/
│   └── neta-cli/           # CLI 工具包
│       ├── src/
│       │   ├── api/        # API 客户端
│       │   ├── commands/   # CLI 命令
│       │   └── types.ts    # 类型定义
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
├── package.json
└── .env.example
```

## 开发

```bash
# 类型检查
cd packages/neta-cli && npm run type-check

# 运行命令（开发模式）
npm run neta -- <command> [options]
```

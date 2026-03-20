---
name: neta-space
description: Neta API 空间与世界观浏览技能——按空间/标签维度浏览世界观设定、子空间与玩法内容。当用户提到世界观/空间/宇宙/场景设定，或想基于空间与活动结构来浏览角色与玩法时使用本技能；不负责具体的图片/视频/歌曲创作（由 neta-creative 负责）。
---

# Neta Space Skill

用于与 Neta API 交互，进行空间内容的浏览

## Instructions

1. 处理「**有哪些空间/活动**」「某个空间的世界观/玩法结构」等任务时，可按以下步骤组织查询：
2. 推荐工作流：
   - 列出全部空间；
   - 选定空间后获取空间详情（世界观设定、活动信息）；
   - 获取子空间及其官方/用户 collections；
   - 视需要获取空间内角色列表或具体玩法信息。
3. 若用户在空间下提出「要生成图片/视频/歌曲」，可在拿到空间/玩法信息后，切换到 `neta-creative` 进行创作。

## 空间

> 空间是一系列有主题的玩法的集合，一个进行内容生产与消费的场域

## Terminology (术语表)
- **Hashtag**：标签/空间。用于构建世界观、组织社团。
- **Collection**：可供浏览、Remix、改变的内容, 也可以泛指空间内发生的事件、场景，玩法
- **活动**：官方主导的特殊 Hashtag。

## 空间结构

- 空间
  - 世界观、设定（lore）
  - 角色
  - collections

  - 子空间
    - offical_collections
    - collections

## Workflow

- 列出全部空间 `list_spaces`
- 获取空间详情 `get_hashtag_info`
- 获取子空间 `list_space_topics`
- 获取空间或子空间内的内容 `get_hashtag_collections` `get_hashtag_characters`

## 获取可供游览的空间

```bash
npx -y @talesofai/neta-skills@latest list_spaces
```

**返回内容**

- space_uuid: 空间 UUID
- name: 空间名称
- main_hashtag_name: hashtag
- topic_count: 子空间（topic）数量

## 获取空间详细信息

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_info --hashtag "空间标签名"
```

**返回内容：**
- 标签 lore（世界观设定）
- 活动详情
- 热度数据
- 订阅数量

## 获取子空间

```bash
npx -y @talesofai/neta-skills@latest list_space_topics --space_uuid "空间 UUID"
```

**返回内容**

- primary_topic 主空间
- topics 子空间列表
  - offical_collections

## 获取空间内角色

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_characters --hashtag "空间标签名" --sort_by "hot"
```

## 获取空间内的场景、事件、内容（可供游玩的部分）

```bash
npx -y @talesofai/neta-skills@latest get_hashtag_collections --hashtag "标签名"
```

## 获取空间中的某个玩法信息

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "official_collections in topic | collections in hashtag"
```

## 内容创作

[内容创作技能](https://github.com/talesofai/neta-skills/tree/main/skills/neta-creative)

```bash
npx skills add talesofai/neta-skills/skills/neta-creative
```

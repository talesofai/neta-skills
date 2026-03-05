# 空间

> 空间是一系列有主题的玩法的集合，一个进行内容生产与消费的场域

# Terminology (术语表)
- **Hashtag**：标签/空间。用于构建世界观、组织社团。
- **Collection**：可供浏览、Remix、改变的内容, 也可以泛指空间内发生的事件、场景，玩法
- **活动**：官方主导的特殊 Hashtag。

# Workflow

- 列出全部空间 `list_spaces`
- 获取空间详情 `get_hashtag_info`
- 获取子空间 `list_space_topics`
- 获取空间或子空间内的内容 `get_hashtag_collections` `get_hashtag_characters`
- 扮演空间中的某个角色，或者使用某个角色 `request_character_or_elementum`
- Remix 空间的内容 📖 [Remix](./collection-remix.md)

# 空间结构

- 空间
  - 世界观、设定（lore）
  - 角色
  - collections

  - 子空间
    - offical_collections
    - collections

# 获取可供游览的空间

```bash
pnpm start list_spaces
```

**返回内容**

- space_uuid: 空间 UUID
- name: 空间名称
- main_hashtag_name: hashtag
- topic_count: 子空间（topic）数量

# 获取空间详细信息

参考 📖 [标签](./hashtag-research.md)


```bash
pnpm start get_hashtag_info --hashtag "空间标签名"
```

**返回内容：**
- 标签 lore（世界观设定）
- 活动详情
- 热度数据
- 订阅数量

# 获取子空间

```bash
pnpm start list_space_topics --space_uuid "空间 UUID"
```

**返回内容**

- primary_topic 主空间
- topics 子空间列表
  - offical_collections

# 获取空间内角色

```bash
pnpm start get_hashtag_characters --hashtag "空间标签名" --sort_by "hot"
```

# 获取空间内的场景、事件、内容（可供游玩的部分）

```bash
pnpm start get_hashtag_collections --hashtag "标签名"
```

# 获取空间中的某个玩法信息

```bash
pnpm start read_collection --uuid "official_collections in topic | collections in hashtag"
```

## 在空间内游玩

📖 [内容创作](./collection-remix.md)

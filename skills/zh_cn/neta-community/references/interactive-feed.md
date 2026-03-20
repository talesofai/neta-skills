# 互动玩法推荐列表最佳实践

## 概述

`request_interactive_feed` 是一个强大的互动玩法内容推荐接口，支持多种场景的自动判断。本文档介绍如何高效使用这个技能。

## 核心概念

### 场景自动判断机制

接口根据传入参数自动判断场景，无需手动指定 Scene 枚举：

- **提供 `collection_uuid`**：进入相关性场景
- **提供 `target_user_uuid`**：进入个人主页场景


- **无特殊参数**：默认首页互动流主模式

### 关键参数说明

- **`collection_uuid`**：最重要的场景控制参数
  - `page_index=0`：获取单个作品的详细信息（单体接口）
  - `page_index>0`：获取与该作品相关的其他作品（相关推荐）

- **`page_index`**：不仅控制分页，还影响场景类型
  - `0`：通常用于获取详情或首屏
  - `>0`：用于获取相关推荐或继续浏览

- **`biz_trace_id`**：保持会话连续性
  - 首次请求：不传或传空
  - 后续请求：使用上一次返回的 `biz_trace_id`

## 常见使用场景

### 1. 获取首页推荐列表（默认场景）

最基础的用法，用于浏览首页互动流。

```bash
# 获取首页推荐
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 --page_size 10
```

**特点：**
- 不需要额外参数
- 返回个性化的推荐内容
- 适合用户打开 APP 时的默认展示

### 2. 查看单个作品详情

当需要获取某个作品的完整信息时使用。

```bash
# 获取单个作品详情
npx -y @talesofai/neta-skills@latest read_collection --uuid "目标作品 UUID"
```

### 3. 获取相似作品推荐

基于某个作品获取相关推荐内容。

```bash
# 获取相似作品（从第 1 页开始）
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --collection_uuid "种子作品 UUID"
```

**特点：**
- 基于内容相似度推荐
- 适合"看了又看"场景

### 4. 查看原作及同款子作品

查看某个作品的原作以及所有同款二创作品。

```bash
# 获取原作及全部同款
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'relation_feed_child' \
  --target_collection_uuid "目标合集 UUID" \
  --collection_uuid "目标合集 UUID"
```

**特点：**
- 需要同时提供 `collection_uuid` 和 `target_collection_uuid`
- 指定 `scene='relation_feed_child'`
- 返回原作信息和所有同款作品

### 5. 查看用户个人主页

获取指定用户的作品集。

```bash
# 获取用户主页
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "用户 UUID"
```

**特点：**
- 必须提供 `target_user_uuid`
- 指定 `scene='personal_feed'`
- 返回该用户的所有作品

### 6. 评论区查看子作品

在评论区查看某个作品的子作品列表。

```bash
# 获取评论区子作品
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'relation_feed_same' \
  --collection_uuid "父作品 UUID"
```

**特点：**
- 指定 `scene='relation_feed_same'`
- 基于父子关系筛选
- 适合"同系列作品"场景

## 翻页连续性维护

为了保持推荐结果的一致性和连续性，需要正确使用 `biz_trace_id`。

### 正确的翻页流程

**核心原则：使用第一次请求返回的 biz_trace_id，后续所有请求都使用这个值。**

```bash
# 第 1 次请求（首页）
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 10 > /tmp/page0.json

# 从返回结果中提取 biz_trace_id
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# 第 2 次请求（下一页）- 使用相同的 biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"

# 第 3 次请求 - 继续使用同一个 biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 2 \
  --page_size 10 \
  --biz_trace_id "$BIZ_TRACE_ID"
```

### 错误示例

**❌ 错误 1：每次都用上一次的返回值**
```bash
# 第 1 页
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID_0=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# 第 2 页（正确：使用第 1 页返回的）
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID_0" > /tmp/page1.json
BIZ_TRACE_ID_1=$(cat /tmp/page1.json | jq -r '.page_data.biz_trace_id')

# 第 3 页（错误：使用了第 2 页返回的，应该一直用第 1 页的）
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID_1"
```

**❌ 错误 2：完全不传 biz_trace_id**
```bash
# 每次都开启新的会话，推荐内容会不连续
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1  # 没有 biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2  # 没有 biz_trace_id
```

## 参数组合技巧

### 组合 1：基础浏览

```bash
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 10
```

### 组合 2：个人主页 + 翻页

```bash
# 第 1 页
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "user-uuid"

# 第 2 页（使用返回的 biz_trace_id）
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --page_size 20 \
  --scene 'personal_feed' \
  --target_user_uuid "user-uuid" \
  --biz_trace_id "从上一页获取"
```

### 组合 3：精确场景控制

```bash
# 查看某作品的同款二创
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 0 \
  --page_size 15 \
  --scene 'relation_feed_same' \
  --collection_uuid "parent-work-uuid"
```

## 输出数据结构

### module_list 模块类型

返回的 `module_list` 包含不同类型的模块：

1. **NORMAL** - 普通作品模块
   - `template_id: "NORMAL"`
   - 包含完整的作品信息、封面图、作者信息等

2. **DRAFT** - 草稿模块
   - `template_id: "DRAFT"`
   - 用户未完成的创作草稿

3. **SPACE** - 空间入口模块
   - `template_id: "into_space"`
   - 引导用户进入特定空间

### 关键数据字段

每个模块项包含以下字段：

- **data_id**: 模块唯一标识
- **module_id**: 模块类型（NORMAL/DRAFT/SPACE）
- **template_id**: 模板类型
- **json_data**: 具体数据对象，根据 template_id 不同包含不同的字段
  - uuid: 作品 UUID
  - name: 作品名称
  - coverUrl: 封面图 URL
  - 等其他字段...

## 性能优化建议

### 1. 合理设置 page_size

- **首页浏览**：10-20（平衡加载速度和流量）
- **个人主页**：20-30（用户有明确目的）
- **相关推荐**：10-15（快速试错）
- **单个详情**：1（只获取一个）

### 2. 缓存策略

缓存推荐结果，避免重复请求：

```bash
# 缓存第一页结果
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/feed_cache.json

# 使用缓存（从文件读取）
cat /tmp/feed_cache.json | jq '.module_list'
```

**实际应用中可以使用文件系统或数据库来缓存结果。**

### 3. 预加载策略

在用户浏览当前页时，后台预加载下一页：

```bash
# 获取当前页
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json &

# 同时预加载下一页（后台任务）
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 > /tmp/page1.prefetch.json &
wait
```

**这样可以提升用户体验，减少等待时间。**

## 调试技巧

### 1. 验证场景是否正确

检查返回的 `module_list` 内容是否符合预期：
- 首页应该有多样化的内容
- 个人主页应该只有该用户的作品
- 相关推荐应该与种子作品相似

### 2. 检查 biz_trace_id 一致性

验证请求和返回的 biz_trace_id 是否一致：

```bash
# 请求时指定 biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed \
  --page_index 1 \
  --biz_trace_id "your-biz-trace-id" > /tmp/response.json

# 检查返回的 biz_trace_id
cat /tmp/response.json | jq '.page_data.biz_trace_id'

# 两者应该相同（除非服务端主动更新）
```

### 3. 使用日志调试

```bash
# 开启 debug 日志查看请求参数
DEBUG=* npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0
```

## 常见问题

### Q1: 为什么返回的结果为空？

**可能原因：**
- 场景参数组合不正确
- `collection_uuid` 或 `target_user_uuid` 无效
- 该场景下确实没有内容

**解决方案：**
- 先尝试默认场景（不加任何参数）
- 验证 UUID 是否有效
- 检查 `page_index` 是否过大

### Q2: biz_trace_id 应该用哪一个？

**原则：使用第一次请求返回的 biz_trace_id**

```bash
# ✅ 正确：一直使用第一次返回的 biz_trace_id
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID"
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID"

# ❌ 错误：每次都用上一次的返回值
npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 0 > /tmp/page0.json
BIZ_TRACE_ID_0=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 1 --biz_trace_id "$BIZ_TRACE_ID_0" > /tmp/page1.json
BIZ_TRACE_ID_1=$(cat /tmp/page1.json | jq -r '.page_data.biz_trace_id')

npx -y @talesofai/neta-skills@latest request_interactive_feed --page_index 2 --biz_trace_id "$BIZ_TRACE_ID_1"  # 错误！应该用 BIZ_TRACE_ID_0
```

### Q3: 如何区分 NORMAL 模块中的不同内容类型？

通过 `json_data` 中的字段判断：
- 检查 `has_video` 判断是否有视频
- 检查 `bgm_uuid` 判断是否有背景音乐
- 检查 `is_interactive` 判断是否是交互式作品

## 总结

使用 `request_interactive_feed` 的关键点：

1. **理解场景自动判断**：通过参数组合自动切换场景
2. **掌握 page_index 语义**：0 通常是详情，>0 是推荐
3. **维护 biz_trace_id**：保持会话连续性
4. **合理设置 page_size**：根据场景选择合适的大小
5. **善用 scene 参数**：精确控制特定场景

通过遵循这些最佳实践，你可以更高效地使用这个技能，获得更好的推荐效果。

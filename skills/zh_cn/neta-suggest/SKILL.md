---
name: neta-suggest
description: Neta API 内容调研与推荐技能——提供关键词/标签/分类建议、分类路径验证以及多模式内容推荐流，支持从宽泛到精确的渐进式探索。当用户没有明确目标、想找创作题材或热门方向，或需要按关键词/分类做系统性内容筛选时使用本技能；不直接生成图片/视频/歌曲（由 neta-creative 负责），社区互动由 neta-community 负责。
---

# Neta Suggest Skill

## Instructions

1. 处理「随便帮我找点题材」「帮我看看现在什么热门」「按某个主题/分类筛内容」这类调研任务时，可参考以下推荐流程：
2. 推荐标准流程：**浏览分类 → 发现标签 → 验证分类路径 → 获取推荐内容**（本文件的“渐进式探索流程”部分已经给出详细命令）。
3. 在内容创作前，可使用本 skill 先完成题材/标签/分类层面的调研，再交给 `neta-creative` 进行具体创作。
4. 当用户需要对具体作品进行点赞/互动时，应切换到 `neta-community`。

## 核心技能

### 1. suggest_keywords - 获取搜索关键词建议

基于输入前缀提供热门搜索词建议，帮助用户发现感兴趣的内容方向。

```bash
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "游戏" --size 20
```

**参数说明：**
- `--prefix`: 关键词前缀（必填）
- `--size`: 返回数量，建议 10-20（可选，默认值根据系统配置）

**适用场景：**
- 用户只有模糊想法时
- 探索热门话题和趋势
- 为后续精确筛选做准备

### 2. suggest_tags - 获取相关标签建议

基于完整关键词推荐相关的 tax 标签。

```bash
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "角色塑造" --size 15
```

**参数说明：**
- `--keyword`: 完整的关键词（必填）
- `--size`: 返回数量，建议 10-20（可选）

**适用场景：**
- 了解某个主题的相关标签
- 发现垂直领域的热门标签
- 为内容创作选择合适的话题标签

### 3. suggest_categories - 获取分类层级导航

提供三级分类体系的导航建议，支持逐级深入探索。

```bash
# 获取一级分类（顶层分类）
npx -y @talesofai/neta-skills@latest suggest_categories --level 1

# 获取二级分类（需要父级路径）
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "衍生创作类"

# 获取三级分类（最细粒度）
npx -y @talesofai/neta-skills@latest suggest_categories --level 3 --parent_path "衍生创作类>同人二创"
```

**参数说明：**
- `--level`: 分类层级（1/2/3）（必填）
- `--parent_path`: 父级分类路径，level>1 时必填（可选）

**分类体系：**
```
一级分类（Level 1）
├─ 衍生创作类
│  ├─ 同人二创（Level 2）
│  │  ├─ 崩坏星穹铁道（Level 3）
│  │  └─ 原神（Level 3）
│  └─ 数字艺术
├─ 生活方式
└─ ...
```

**适用场景：**
- 系统性了解平台内容分类
- 按图索骥查找特定领域内容
- 验证分类路径的有效性

### 4. validate_tax_path - 验证分类路径

检查分类路径是否有效，避免使用不存在的分类。

```bash
npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "衍生创作类>热门 IP>崩坏星穹铁道"
```

**参数说明：**
- `--tax_path`: 完整的分类路径（必填）

**适用场景：**
- 在使用分类路径前进行验证
- 确保分类路径的准确性

### 5. suggest_content - 智能内容流引擎

强大的内容推荐工具，支持三种模式：推荐、搜索、精确筛选。

```bash
# 模式 1：推荐模式（广泛探索）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent recommend

# 模式 2：搜索模式（关键词搜索）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent search \
  --search_keywords "角色,创意"

# 模式 3：精确模式（分类筛选）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent exact \
  --tax_paths "衍生创作类>同人二创"

# 组合使用（多条件筛选）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --scene agent_intent \
  --intent search \
  --search_keywords "AI,绘画" \
  --tax_paths "数字艺术>概念设计" \
  --exclude_keywords "测试,废弃"
```

**参数说明：**
- `--page_index`: 页码，从 0 开始（默认 0）
- `--page_size`: 每页数量，范围 1-40（默认 20）
- `--scene`: 场景标识（默认 "agent_intent"）
- `--biz_trace_id`: 会话追踪 ID（可选）
- `--intent`: 意图类型 `recommend` | `search` | `exact`（默认 recommend）
- `--search_keywords`: 搜索关键词，多个之间用英文逗号分隔（可选）
- `--tax_paths`: 分类路径，多个之间用英文逗号分隔（可选）
- `--tax_primaries`: 一级分类，多个之间用英文逗号分隔（可选）
- `--tax_secondaries`: 二级分类，多个之间用英文逗号分隔（可选）
- `--tax_tertiaries`: 三级分类，多个之间用英文逗号分隔（可选）
- `--exclude_keywords`: 排除关键词，多个之间用英文逗号分隔（可选）
- `--exclude_tax_paths`: 排除分类路径，多个之间用英文逗号分隔（可选）

## 渐进式探索流程

### 标准探索路径（从宽到窄）

```
graph LR
    A[浏览分类] --> B[发现标签]
    B --> C[验证路径]
    C --> D[获取内容]
```

#### 步骤 1：浏览分类体系

先了解整体的内容分类结构：

```bash
# 查看所有一级分类
npx -y @talesofai/neta-skills@latest suggest_categories --level 1
# 输出示例：["衍生创作类", "数字艺术", "生活方式"]

# 对感兴趣的分类深入查看
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "衍生创作类"
# 输出示例：["同人二创", "原创故事", "互动小说"]
```

#### 步骤 2：发现相关标签

基于分类或关键词发现热门标签：

```bash
# 基于关键词找标签
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "同人二创" --size 15
# 输出示例：["崩坏星穹铁道", "原神", "明日方舟"]

# 或者用关键词建议辅助
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "崩" --size 10
# 输出示例：["崩坏星穹铁道", "崩坏 3", "崩坏学园"]
```

#### 步骤 3：验证分类路径

在正式使用前验证路径有效性：

```bash
npx -y @talesofai/neta-skills@latest validate_tax_path \
  --tax_path "衍生创作类>同人二创>崩坏星穹铁道"
# 如果有效会返回成功，否则提示错误
```

#### 步骤 4：获取推荐内容

使用验证过的路径获取内容：

```bash
# 精确模式：按分类筛选
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "衍生创作类>同人二创>崩坏星穹铁道" \
  --page_size 20

# 或者搜索模式：结合关键词
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "崩坏星穹铁道，同人" \
  --tax_paths "衍生创作类>同人二创" \
  --page_size 20
```

## 常见使用场景

### 场景 1：无明确目标的探索

用户只是随便看看，没有特定目标。

```bash
# 策略：使用推荐模式，广泛浏览
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent recommend \
  --page_size 20
```

**技巧：**
- 不设置任何筛选条件
- 让算法根据热度推荐
- 适合发现意外惊喜

### 场景 2：有模糊兴趣方向

用户对某个主题感兴趣，但不确定具体内容。

```bash
# 步骤 1：先用关键词建议发现方向
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "游" --size 15

# 步骤 2：基于发现的关键词找标签
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "游戏" --size 15

# 步骤 3：使用搜索模式探索
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "原神" \
  --page_size 20
```

**技巧：**
- 从宽泛的关键词开始
- 逐步缩小范围
- 结合标签和关键词

### 场景 3：有明确的分类目标

用户明确想看某个分类的内容。

```bash
# 步骤 1：确认分类路径
npx -y @talesofai/neta-skills@latest suggest_categories --level 1
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "衍生创作类"

# 步骤 2：验证路径
npx -y @talesofai/neta-skills@latest validate_tax_path \
  --tax_path "衍生创作类>同人二创>崩坏星穹铁道"

# 步骤 3：精确筛选
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "衍生创作类>同人二创>崩坏星穹铁道" \
  --page_size 20
```

**技巧：**
- 先验证路径再使用
- 使用 exact 模式确保精确匹配
- 可以组合多个分类路径

### 场景 4：内容创作前的调研

准备创作内容，需要了解热门标签和分类。

```bash
# 步骤 1：了解热门标签
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "角色塑造" --size 20

# 步骤 2：了解相关分类
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "衍生创作类"

# 步骤 3：查看该分类下的热门内容
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "角色,设定" \
  --tax_paths "衍生创作类>同人二创" \
  --page_size 30
```

**技巧：**
- 全面了解后再创作
- 参考热门标签提高曝光
- 选择合适的分类投放

### 场景 5：排除特定内容

想看某类内容，但想排除某些元素。

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "AI,绘画" \
  --tax_paths "数字艺术" \
  --exclude_keywords "教程,广告" \
  --exclude_tax_paths "数字艺术>课程培训" \
  --page_size 20
```

**技巧：**
- 使用 `exclude_keywords` 过滤不想要的内容
- 使用 `exclude_tax_paths` 排除特定分类
- 正向筛选 + 负向排除结合

## 参数组合技巧

### 组合 1：关键词 + 分类双重筛选

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "视频,剪辑" \
  --tax_paths "数字艺术>视频制作" \
  --page_size 20
```

**效果：** 在"视频制作"分类下搜索包含"视频"和"剪辑"的内容

### 组合 2：多级分类组合

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "衍生创作类>同人二创>崩坏星穹铁道" \
  --page_size 20
```

**效果：** 精确筛选三级分类，等价于 `tax_paths: "衍生创作类>同人二创>崩坏星穹铁道"`

### 组合 3：推荐模式 + 排除条件

```bash
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent recommend \
  --exclude_keywords "教程,搬运" \
  --exclude_tax_paths "课程类" \
  --page_size 20
```

**效果：** 智能推荐，但排除教程和搬运内容

### 组合 4：翻页连续性

```bash
# 第 1 页
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --intent search \
  --search_keywords "创意"

# 保存返回的 biz_trace_id（假设返回值为 "abc123"）

# 第 2 页（使用第 1 页返回的 biz_trace_id）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 1 \
  --page_size 20 \
  --intent search \
  --search_keywords "创意" \
  --biz_trace_id "abc123"
```

**效果：** 保持搜索结果的一致性

## 输出数据结构

### suggest_keywords / suggest_tags / suggest_categories

返回建议列表：

```json
{
  "suggestions": ["建议 1", "建议 2", "建议 3"]
}
```

### validate_tax_path

验证分类路径是否有效：

```json
{
  "valid": true,
  "message": "路径有效"
}
```

或无效时：

```json
{
  "valid": false,
  "message": "错误信息"
}
```

### suggest_content

返回推荐内容列表和分页信息：

```json
{
  "module_list": [
    {
      "data_id": "模块 ID",
      "module_id": "模块类型",
      "template_id": "模板 ID",
      "json_data": {}
    }
  ],
  "page_data": {
    "has_next_page": true,
    "page_index": 0,
    "page_size": 20,
    "biz_trace_id": "会话追踪 ID"
  }
}
```

## 性能优化建议

### 1. 合理设置 page_size

- **探索阶段**：10-15（快速试错）
- **深入浏览**：20-30（减少翻页次数）
- **精确查找**：20-40（一次性获取足够内容）

### 2. 缓存建议结果

缓存分类、标签等建议结果，避免重复请求：

```bash
# 第一次请求
npx -y @talesofai/neta-skills@latest suggest_categories --level 1 > /tmp/categories_level1.json

# 后续使用缓存（示例：从缓存文件读取）
cat /tmp/categories_level1.json
```

**实际应用中可以使用文件系统或数据库来缓存结果。**

### 3. 预加载下一级分类

在用户查看当前层级时，后台预加载可能的下一级分类：

```bash
# 获取 Level 1 分类
npx -y @talesofai/neta-skills@latest suggest_categories --level 1

# 并行预加载 Level 2 分类（示例：使用后台任务）
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "衍生创作类" &
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "数字艺术" &
npx -y @talesofai/neta-skills@latest suggest_categories --level 2 --parent_path "生活方式" &
wait
```

**这样可以提升用户体验，减少等待时间。**

### 4. 批量验证分类路径

一次性验证多个分类路径的有效性：

```bash
# 并行验证多个路径
npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "衍生创作类>同人二创>崩坏星穹铁道" &
npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "衍生创作类>同人二创>原神" &
npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "数字艺术>概念设计" &
wait

# 或者使用脚本批量处理
cat > /tmp/paths.txt << EOF
衍生创作类>同人二创>崩坏星穹铁道
衍生创作类>同人二创>原神
数字艺术>概念设计
EOF

while read path; do
  npx -y @talesofai/neta-skills@latest validate_tax_path --tax_path "$path"
done < /tmp/paths.txt
```

**这样可以提前筛选出有效的分类路径，避免后续请求失败。**

## 调试技巧

### 1. 检查搜索关键词是否生效

```bash
# 开启 debug 日志
DEBUG=* npx -y @talesofai/neta-skills@latest suggest_content \
  --intent search \
  --search_keywords "测试关键词"
```

检查日志中是否正确传递了关键词参数。

### 2. 验证分类路径匹配

```bash
# 先用 exact 模式测试
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "你的分类路径" \
  --page_size 5

# 如果返回空，可能是：
# - 分类路径不存在
# - 该分类下没有内容
# - 路径格式不正确
```

### 3. 对比不同模式的结果

```bash
# 同一关键词，对比三种模式
npx -y @talesofai/neta-skills@latest suggest_content --intent recommend --page_size 10
npx -y @talesofai/neta-skills@latest suggest_content --intent search --search_keywords "关键词" --page_size 10
npx -y @talesofai/neta-skills@latest suggest_content --intent exact --tax_paths "分类路径" --page_size 10
```

观察不同模式下结果的差异，理解各模式的特点。

## 常见问题

### Q1: suggest_keywords 和 suggest_tags 有什么区别？

**A:** 
- `suggest_keywords`: 基于**前缀**的模糊匹配，适合探索阶段
- `suggest_tags`: 基于**完整关键词**的相关性匹配，更精确

```bash
# keywords - 前缀匹配
npx -y @talesofai/neta-skills@latest suggest_keywords --prefix "崩"  # 返回所有以"崩"开头的词

# tags - 相关性匹配
npx -y @talesofai/neta-skills@latest suggest_tags --keyword "游戏"   # 返回与"游戏"相关的标签
```

### Q2: 为什么 validate_tax_path 验证通过，但 suggest_content 返回空？

**可能原因：**
1. 分类路径有效，但该分类下暂时没有内容
2. intent 模式不对（应该用 exact 却用了 recommend）
3. 还有其他筛选条件冲突

**解决方案：**
```bash
# 尝试去掉其他条件，只用分类路径
npx -y @talesofai/neta-skills@latest suggest_content \
  --intent exact \
  --tax_paths "你的分类路径" \
  --page_size 10
```

### Q3: 如何选择合适的 intent 模式？

**选择指南：**

| 模式 | 使用场景 | 必需参数 |
|------|---------|---------|
| `recommend` | 无目的浏览、探索 | 无 |
| `search` | 有明确关键词 | `search_keywords` |
| `exact` | 严格按分类筛选 | `tax_paths` 或分类参数 |

### Q4: exclude_keywords 和 exclude_tax_paths 如何使用？

```bash
# 排除包含特定词的内容
npx -y @talesofai/neta-skills@latest suggest_content \
  --exclude_keywords "教程,广告,搬运" \
  --search_keywords "绘画"

# 排除特定分类
npx -y @talesofai/neta-skills@latest suggest_content \
  --exclude_tax_paths "课程培训,商业推广" \
  --tax_paths "数字艺术"
```

**注意：** 排除条件会显著减少结果数量，慎用。

### Q5: biz_trace_id 在多轮对话中如何维护？

**方法：保存第一次请求返回的 biz_trace_id，后续请求都使用这个值。**

```
# 第 1 次请求（首页）
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 0 \
  --page_size 20 \
  --intent search \
  --search_keywords "关键词" > /tmp/page0.json

# 从返回结果中提取 biz_trace_id
BIZ_TRACE_ID=$(cat /tmp/page0.json | jq -r '.page_data.biz_trace_id')

# 第 2 次请求（下一页），使用保存的 biz_trace_id
npx -y @talesofai/neta-skills@latest suggest_content \
  --page_index 1 \
  --page_size 20 \
  --intent search \
  --search_keywords "关键词" \
  --biz_trace_id "$BIZ_TRACE_ID"
```

**注意：** 应该使用第一次返回的 biz_trace_id，而不是每次都用上一次的返回值。

## 总结

使用玩法内容探索技能的关键点：

1. **渐进式探索**：分类 → 标签 → 验证 → 内容
2. **模式选择**：无目的用 recommend，有关键词用 search，有分类用 exact
3. **参数组合**：善用关键词 + 分类的双重筛选
4. **排除技巧**：合理使用 exclude 参数过滤噪音
5. **会话连续**：正确维护 biz_trace_id 保证体验一致性

遵循这些最佳实践，可以高效地探索和发现平台上的优质内容！

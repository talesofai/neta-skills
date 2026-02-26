# 标签调研最佳实践

适用于 `get-hashtag-info`、`get-hashtag-characters` 和 `get-hashtag-collections` 命令。

---

## 工作流程

```
1. 获取标签信息 → 2. 查看热门角色 → 3. 分析精选合集 → 4. 确定创作方向
```

---

## 标签信息

### 基本信息查询

```bash
npm start get-hashtag-info -t "标签名"
```

**返回内容：**
- 标签 lore（世界观设定）
- 活动详情
- 热度数据
- 订阅数量

### 标签 lore 使用

lore 包含标签的世界观和设定，是创作的重要参考：

```json
{
  "lore": [
    {
      "name": "设定名称",
      "category": "设定类别",
      "description": "详细描述..."
    }
  ]
}
```

**应用：**
- 基于 lore 创作符合世界观的内容
- 使用 lore 中的关键词作为提示词
- 保持创作与官方设定一致

---

## 角色调研

### 获取热门角色

```bash
npm start get-hashtag-characters \
  -t "标签名" \
  --sort-by "hot" \
  --page-size 20
```

### 获取最新角色

```bash
npm start get-hashtag-characters \
  -t "标签名" \
  --sort-by "newest" \
  --page-size 20
```

### 筛选角色类型

```bash
# 只看 OC 角色
npm start get-hashtag-characters -t "标签名" --parent-type "oc"

# 只看风格元素
npm start get-hashtag-characters -t "标签名" --parent-type "elementum"
```

### 分析角色特征

```bash
# 1. 获取角色列表
npm start get-hashtag-characters -t "标签名" > characters.json

# 2. 分析热门角色的共同特征
# - 发型/发色分布
# - 服装风格
# - 常见元素

# 3. 获取详情
npm start request-character -n "热门角色名"
```

---

## 精选合集分析

### 获取精选作品

```bash
npm start get-hashtag-collections -t "标签名"
```

**返回内容：**
- 精选作品列表
- 封面图
- 创作者信息
- 点赞数

### 分析热门作品

```bash
# 1. 获取合集
npm start get-hashtag-collections -t "标签名" > collections.json

# 2. 分析高赞作品
# - 使用的角色
# - 视觉风格
# - 构图特点
# - 色彩搭配

# 3. 总结成功要素
```

### 学习创作技巧

通过精选合集学习：
- 流行的构图方式
- 常用的色彩搭配
- 受欢迎的角色组合
- 热门的场景设定

---

## 完整调研流程

### 示例：新标签创作调研

```bash
# 1. 了解标签整体信息
npm start get-hashtag-info -t "魔法少女"

# 2. 查看热门角色（前 20 个）
npm start get-hashtag-characters -t "魔法少女" --sort-by "hot" --page-size 20

# 3. 查看精选作品
npm start get-hashtag-collections -t "魔法少女"

# 4. 获取感兴趣角色的详情
npm start request-character -n "角色名"

# 5. 基于调研结果创作
npm start make-image -p "符合标签风格的提示词..."
```

---

## 数据记录

### 调研笔记模板

```markdown
# 标签调研：标签名

## 基本信息
- 订阅数：xxx
- 热度：xxx
- 核心设定：...

## 热门角色 Top 5
1. 角色名 - 特征...
2. 角色名 - 特征...
3. ...

## 流行元素
- 发色：...
- 服装：...
- 道具：...
- 背景：...

## 创作方向
基于调研，计划创作...
```

### 保存调研结果

```bash
# 保存完整调研数据
mkdir research/标签名
npm start get-hashtag-info -t "标签名" > research/标签名/info.json
npm start get-hashtag-characters -t "标签名" > research/标签名/characters.json
npm start get-hashtag-collections -t "标签名" > research/标签名/collections.json
```

---

## 常见用例

### 新角色创作调研

```bash
# 1. 调研现有角色，避免重复
npm start search-tcp -k "角色特征" -t "character"

# 2. 调研相关标签的热门元素
npm start get-hashtag-characters -t "相关标签"

# 3. 基于调研设计独特角色
```

### 系列活动策划

```bash
# 1. 调研标签 lore 和设定
npm start get-hashtag-info -t "标签名"

# 2. 分析精选作品的主题
npm start get-hashtag-collections -t "标签名"

# 3. 策划符合标签调性的系列内容
```

### 竞品分析

```bash
# 1. 收集热门标签
npm start get-hashtag-info -t "标签 1"
npm start get-hashtag-info -t "标签 2"

# 2. 对比各标签的热门角色
npm start get-hashtag-characters -t "标签 1" --sort-by "hot"
npm start get-hashtag-characters -t "标签 2" --sort-by "hot"

# 3. 分析差异和机会点
```

---

## 调研技巧

### 发现新兴标签

- 关注 `newest` 排序的新角色
- 查看活跃度上升的标签
- 注意跨界合作的标签

### 识别趋势

- 定期调研同一标签
- 记录热门角色的变化
- 观察精选作品风格演变

### 高效调研

- 先广度后深度（先了解整体，再深入细节）
- 善用分页获取完整数据
- 保存常用标签的调研结果

---

## 常见问题

### Q: 如何找到适合创作的标签？

**A:**
1. 浏览热门标签列表
2. 查看各标签的订阅数
3. 选择与创作风格匹配的标签
4. 考虑竞争程度（热门标签竞争大）

### Q: 标签 lore 太长如何快速提取要点？

**A:**
1. 关注核心设定（世界观、背景）
2. 提取关键词和术语
3. 记录角色关系
4. 注意禁忌/限制

### Q: 如何判断标签的热度趋势？

**A:**
1. 对比不同时间的调研数据
2. 观察新角色发布频率
3. 查看精选合集更新时间
4. 关注订阅数变化

---

## 相关文档

- [角色查询](./character-search.md) - 获取角色详细信息
- [图片生成](./image-generation.md) - 基于调研结果创作

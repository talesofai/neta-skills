# 角色查询最佳实践

适用于 `search-tcp`、`request-character` 和 `request-character-or-style` 命令。

---

## 工作流程

```
1. 模糊搜索 → 2. 确认角色 → 3. 获取详情 → 4. 使用标准信息
```

---

## 搜索策略

### 精确搜索

当知道确切角色名称时：

```bash
# 使用精确排序
npm start search-tcp -k "角色全名" -s "exact" -t "character"
```

### 模糊搜索

当只记得部分名称或关键词时：

```bash
# 使用相关性排序
npm start search-tcp -k "关键词" -s "best" -t "both"
```

### 分页浏览

```bash
# 第一页
npm start search-tcp -k "魔法少女" --page-index 0 --page-size 10

# 第二页
npm start search-tcp -k "魔法少女" --page-index 1 --page-size 10
```

---

## 参数选择

### parent_type

| 值 | 说明 | 使用场景 |
|------|------|----------|
| `character` | 仅角色 | 确定搜索 OC 角色 |
| `elementum` | 仅风格元素 | 确定搜索风格/元素 |
| `both` | 两者都搜索 | 不确定类型时（默认） |

### sort_scheme

| 值 | 说明 | 使用场景 |
|------|------|----------|
| `exact` | 精确匹配 | 知道确切名称 |
| `best` | 综合相关 | 模糊搜索（默认） |

---

## 获取角色详情

### 通过名称

```bash
npm start request-character -n "角色名"
```

### 通过 UUID

```bash
npm start request-character-or-style -u "角色-uuid"
```

### 返回数据示例

```json
{
  "detail": {
    "type": "character",
    "uuid": "xxx-xxx-xxx",
    "name": "角色名",
    "age": "18",
    "interests": "唱歌、跳舞",
    "persona": "开朗活泼",
    "description": "详细描述...",
    "occupation": "学生",
    "avatar_img": "https://...",
    "header_img": "https://..."
  }
}
```

---

## 常见用例

### 基于角色生成图片

```bash
# 1. 获取角色标准信息
npm start request-character -n "初音未来"

# 2. 从返回中提取特征描述
# age: "16", 葱绿色双马尾，等等

# 3. 生成图片
npm start make-image \
  -p "16 岁少女，葱绿色双马尾，穿着标志性服装，手持大葱，舞台背景" \
  -a "3:4"
```

### 标签角色调研

```bash
# 1. 获取标签下的角色列表
npm start get-hashtag-characters -t "热门标签" --sort-by "hot"

# 2. 获取感兴趣角色的详情
npm start request-character -n "角色名"

# 3. 分析角色特征，确定创作方向
```

### 风格元素查询

```bash
# 搜索风格元素
npm start search-tcp -k "赛博朋克" -t "elementum"

# 获取元素详情
npm start request-character-or-style -n "赛博朋克风格"
```

---

## 搜索技巧

### 使用别名/简称

有些角色有多个名称：
```bash
# 尝试不同名称
npm start search-tcp -k "角色全名" -s "exact"
npm start search-tcp -k "角色简称" -s "exact"
```

### 组合关键词

```bash
# 特征 + 类型
npm start search-tcp -k "粉色头发 魔法少女" -t "character"

# 作品名 + 角色
npm start search-tcp -k "作品名 角色名" -s "exact"
```

### 利用标签筛选

```bash
# 先查标签
npm start get-hashtag-info -t "标签名"

# 再查标签下角色
npm start get-hashtag-characters -t "标签名"
```

---

## 数据缓存

### 缓存角色信息

```bash
# 第一次查询并保存
npm start request-character -n "角色名" > character_cache/角色名.json

# 后续使用缓存数据
cat character_cache/角色名.json
```

### 缓存搜索结果的

```bash
# 保存搜索结果
npm start search-tcp -k "关键词" > search_cache/关键词.json
```

---

## 常见问题

### Q: 搜索不到角色怎么办？

**A:**
1. 尝试不同的名称变体
2. 使用模糊搜索（`-s "best"`）
3. 检查是否拼写错误
4. 确认角色确实存在于数据库中

### Q: 如何区分同名角色？

**A:**
1. 查看详细描述
2. 对比头像图片
3. 查看所属标签/作品
4. 使用更精确的搜索词

### Q: 角色信息不完整怎么办？

**A:**
1. 有些角色可能信息较少
2. 可以结合多个来源
3. 使用角色的 avatar_img 作为参考
4. 基于已有信息创作

---

## 最佳实践总结

1. **先搜索后创作** - 确保使用官方标准设定
2. **缓存常用角色** - 避免重复 API 调用
3. **精确优先** - 知道全名时用 `exact` 排序
4. **保存 UUID** - 方便后续直接查询
5. **结合标签** - 利用标签系统发现相关角色

---

## 相关文档

- [图片生成](./image-generation.md) - 基于角色信息生成图片
- [标签查询](./hashtag-research.md) - 通过标签发现角色

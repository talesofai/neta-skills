# 社区玩法探索最佳实践

适用于 `suggest-keywords`、`suggest-tags`、`suggest-categories`、`suggest-content` 和 `validate-tax-path` 命令。

---

---

## 📊 渐进式探索流程

### 1️⃣ 浏览分类体系 - 了解整体结构

```bash
# 查看一级分类
npm start -- suggest-categories --level 1

# 查看二级分类
npm start -- suggest-categories --level 2 -P "衍生创作类"

# 查看三级分类
npm start -- suggest-categories --level 3 -P "衍生创作类>同人二创"
```

**热门一级分类示例**:
- 创意应用类 (1095 个内容)
- 互动演绎类 (226 个内容)
- 视觉设计类 (127 个内容)
- 角色塑造类 (75 个内容)

---

### 2️⃣ 发现热门标签 - 获取流行趋势

```bash
# 搜索关键词前缀（至少 1 个字符）
npm start -- suggest-keywords -p "角" -s 20

# 基于完整关键词获取相关标签
npm start -- suggest-tags -k "角色塑造" -s 15
```

**热门搜索词示例**（以"角"为例）:
- 角色塑造类
- 角色衍生
- 角色解析模板
- 角色专属场景
- 角色 Logo 设计

**相关标签建议**:
- OC 兼容创作
- OC 自设
- 角色印象
- OC 定制
- 跨次元合照

---

### 3️⃣ 验证分类路径 - 确保有效性

```bash
# 验证分类路径是否有效
npm start -- validate-tax-path -p "衍生创作类>同人二创>OC 自设"
# 返回：true 表示路径有效
```

---

### 4️⃣ 获取内容推荐 - 浏览实际作品

```bash
# 推荐模式（适合广泛探索，重多样性/热度）
npm start -- suggest-content -m recommend --limit 10

# 搜索模式（需要关键词，重相关性）
npm start -- suggest-content -m search -k "角色，创意" --limit 5

# 精确模式（严格按分类路径筛选）
npm start -- suggest-content -m exact -t "衍生创作类>同人二创" --limit 5
```

**三种模式对比**:

| 模式 | 用途 | 参数特点 | 适用场景 |
|------|------|----------|----------|
| **recommend** | 发现热门/多样性内容 | 无需特定参数 | 广泛探索、发现灵感 |
| **search** | 关键词精确搜索 | 需要 `-k` 关键词 | 有明确搜索意图 |
| **exact** | 严格匹配分类 | 需要 `-t` 分类路径 | 精准筛选特定类别 |

---

## 🔧 高级用法

### 组合筛选

```bash
# 指定一级分类筛选
npm start -- suggest-content -m recommend \
  --primaries "衍生创作类,创意应用类" \
  --limit 10

# 排除不想要的分类
npm start -- suggest-content -m recommend \
  --exclude-paths "负面情感" \
  --limit 10

# 使用原始 JSON 进行复杂查询
npm start -- suggest-content \
  -b '{"intent":"search","search_keywords":["角色"],"tax_paths":["衍生创作类>同人二创"]}'
```

### 分页浏览

```bash
# 获取第 2 页，每页 5 条
npm start -- suggest-content -m recommend --limit 5 --page 1
```

---

## 💡 最佳实践建议

1. **从宽到窄**: 先用 `recommend` 模式广泛浏览，再用 `exact` 模式精确定位
2. **多层级验证**: 使用 `suggest-categories` 探索时，逐级验证二级、三级分类
3. **关键词策略**: 使用 `suggest-keywords` 发现热门标签，再用 `suggest-tags` 获取完整标签树
4. **路径校验**: 在正式使用前，用 `validate-tax-path` 确保分类路径有效
5. **分页浏览**: 使用 `--limit` 和 `--page` 参数分批获取内容，避免单次请求过多数据

---

## 📋 常用命令速查表

### 分类探索
```bash
npm start -- suggest-categories --level 1                    # 一级分类
npm start -- suggest-categories --level 2 -P "分类名"         # 二级分类
npm start -- suggest-categories --level 3 -P "分类名>子分类"  # 三级分类
```

### 关键词发现
```bash
npm start -- suggest-keywords -p "前缀" -s 20                # 搜索热词
npm start -- suggest-tags -k "完整关键词" -s 15              # 获取标签
```

### 路径验证
```bash
npm start -- validate-tax-path -p "分类路径"                  # 验证路径
```

### 内容推荐
```bash
npm start -- suggest-content -m recommend --limit 10         # 推荐模式
npm start -- suggest-content -m search -k "关键词" --limit 5 # 搜索模式
npm start -- suggest-content -m exact -t "路径" --limit 5    # 精确模式
```

---

## 🎨 实战示例

### 场景：寻找角色相关的创意内容

```bash
# Step 1: 查看有哪些分类
npm start -- suggest-categories --level 1

# Step 2: 深入查看"衍生创作类"的子分类
npm start -- suggest-categories --level 2 -P "衍生创作类"

# Step 3: 发现"角色"相关的热门标签
npm start -- suggest-keywords -p "角" -s 20

# Step 4: 获取"角色塑造"的相关标签
npm start -- suggest-tags -k "角色塑造" -s 15

# Step 5: 验证感兴趣的路径
npm start -- validate-tax-path -p "衍生创作类>同人二创>OC 自设"

# Step 6: 获取该分类下的优质内容
npm start -- suggest-content -m exact -t "衍生创作类>同人二创>OC 自设" --limit 5
```

---

通过以上流程，你可以系统性地探索和发现 NETA 社区中的优质内容和创作灵感！


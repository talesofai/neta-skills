
```markdown
# 社区玩法探索最佳实践

适用于从「找玩法 → 游玩/创作 → 发布社区」的完整闭环，覆盖：

- 玩法发现：`suggest_categories` / `suggest_keywords` / `suggest_tags`
- 内容调研：`get_hashtag_info` / `get_hashtag_collections` / `read_collection`
- 角色与素材：`search_character_or_elementum` / `request_character_or_elementum`
- 创作与发布：`make_image` / `make_video` / `make_song` / `publish_collection`

---

## 目标流程（SOP）

```text
1. 定方向（类目）
2. 找关键词（玩法词）
3. 深挖样本（合集/角色）
4. 拆解玩法（read_collection）
5. 快速游玩（先出第一版）
6. 迭代优化（风格/文案/构图）
7. 打包发布（publish_collection）
8. 复盘沉淀（可复用模板）
```

---

## 1) 定方向：先广后窄

### 先看一级类目

```bash
pnpm start suggest_categories --level 1
```

### 再看二/三级类目

```bash
pnpm start suggest_categories --level 2 --parent_path "衍生创作类"
pnpm start suggest_categories --level 3 --parent_path "创意应用类>物品拟态"
```

**建议：**
- 先选 1 个主方向（如：物品拟态、漫画叙事、梗图/迷因）
- 再选 1~2 个子方向（如：表情包模板、互动刮刮乐）

---

## 2) 找关键词：拿到可执行玩法词

### 前缀补全（快速找词）

```bash
pnpm start suggest_keywords --prefix "表情包" --size 20
pnpm start suggest_keywords --prefix "治愈" --size 20
```

### 完整词建议（找 tax_path）

```bash
pnpm start suggest_tags --keyword "物品拟态" --size 20
```

### 验证分类路径是否有效

```bash
pnpm start validate_tax_path --tax_path "创意应用类>物品拟态"
```

---

## 3) 深挖样本：先看社区里谁跑通了

### 看标签信息（热度、订阅）

```bash
pnpm start get_hashtag_info --hashtag "漫画"
```

### 看标签精选合集（选高质量样本）

```bash
pnpm start get_hashtag_collections --hashtag "漫画"
```

### 看标签热门角色

```bash
pnpm start get_hashtag_characters --hashtag "漫画" --sort_by "hot"
```

**选样本建议（优先级）：**
1. `likeCount` 高
2. `sameStyleCount` 高（可复用性强）
3. 近期发布（不过时）
4. 标题/封面与你目标一致

---

## 4) 拆解玩法：把“好作品”变成“可复用模板”

```bash
pnpm start read_collection --uuid "玩法-uuid"
```

重点读取字段：
- `description`：玩法上下文与规则
- `tags`：所属社区语义
- `artifacts`：素材规模与形态
- `remix.launch_prompt.core_input`：可直接执行的详细指令
- `remix.launch_prompt.brief_input`：快速复用指令

**拆解产出建议：**
- 主题：要表达什么
- 结构：几格/单图/海报/叙事
- 变量：角色、文案、场景、色调
- 约束：比例、背景、是否要文字

---

## 5) 游玩执行：先出第一版，再迭代

### 角色确认

```bash
pnpm start search_character_or_elementum --keywords "奈塔" --parent_type "character" --sort_scheme "exact"
pnpm start request_character_or_elementum --uuid "角色-uuid"
```

### 生成第一版

```bash
pnpm start make_image \
  --prompt "@奈塔，Q版表情包九宫格，贴纸风，粗描边，白色背景，适合聊天软件" \
  --aspect "1:1"
```

### 固定文案版（如：我裂开了）

```bash
pnpm start make_image \
  --prompt "@奈塔，Q版表情包单图，白底贴纸风，夸张崩溃表情，画面固定大字：我裂开了" \
  --aspect "1:1"
```

**执行建议：**
- 第一版目标是“可用”，不是“一次完美”
- 固定文字要显式写进 prompt（如：`固定大字：我裂开了`）
- 表情包优先 `1:1`

---

## 6) 失败与回退策略（非常关键）

### A. `suggest_content` 返回 500
现象：`Request failed with status code 500`

回退路径：
1. 用 `suggest_keywords` + `suggest_tags` 找可用路径
2. 用 `validate_tax_path` 验证路径
3. 直接改走 `get_hashtag_collections` + `read_collection`

### B. `403 not logged in` / `user has not logged in`
现象：生成或发布失败

处理：
- 更新 `NETA_TOKEN` 后重试
- 或命令前临时注入 token：

```bash
NETA_TOKEN="<your_token>" pnpm start publish_collection ...
```

### C. 命令参数报错（如 too many arguments）
- 注意 `pnpm start <command>` 后不要重复写命令名
- 例：正确是 `pnpm start publish_collection --name ...`，而不是再写一个 `publish_collection`

---

## 7) 发布社区：把多张图打包成合集

```bash
pnpm start publish_collection \
  --name "奈塔表情包合集" \
  --description "包含九宫格表情包与固定文案单图" \
  --status PUBLISHED \
  --artifacts "uuid1,uuid2"
```

发布成功后重点确认：
- `uuid`：作品唯一 ID
- `status`：应为 `PUBLISHED`
- `coverUrl` / `shareUrl`：对外展示地址

**建议：**
- 标题 = 主题 + 玩法形态（如“奈塔表情包合集”）
- 描述写清用途（聊天斗图、治愈日常等）

---

## 8) 一套可直接复用的最小闭环

```bash
# 1) 找玩法词
pnpm start suggest_keywords --prefix "表情包" --size 20

# 2) 找角色
pnpm start search_character_or_elementum --keywords "奈塔" --parent_type "character" --sort_scheme "exact"

# 3) 生成两张图
pnpm start make_image --prompt "@奈塔，Q版九宫格表情包，白底贴纸风" --aspect "1:1"
pnpm start make_image --prompt "@奈塔，单图表情包，固定文案：我裂开了" --aspect "1:1"

# 4) 发布合集
pnpm start publish_collection --name "奈塔表情包合集" --description "九宫格+固定文案" --status PUBLISHED --artifacts "uuid1,uuid2"
```

---

## 9) 复盘模板（建议每次都记录）

```markdown
# 社区玩法复盘 - YYYY-MM-DD

## 目标
- 方向：
- 受众：
- 发布目标：

## 探索结果
- 主类目：
- 子类目：
- 关键词：
- 参考玩法 uuid：

## 创作参数
- 角色：
- 比例：
- 风格：
- 固定文案：

## 结果
- artifact uuids：
- collection uuid：
- 发布状态：

## 下次优化
- 保留：
- 修改：
```

---

## 相关文档

- [标签调研](./hashtag-research.md)
- [角色查询](./character-search.md)
- [图片生成](./image-generation.md)
- [内容创作](./collection-remix.md)
```


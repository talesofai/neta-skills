# 角色创建引导

完整的角色铸造工作流程，从灵感到 Token 落地。

---

## 创作流程总览

```
第一段：视觉预览
  └─ 用自然语言描述角色外貌 → make_image 生成预览图
  └─ 反复迭代，直到视觉满意

第二段：角色立档
  └─ 确认 trigger（英文识别词）
  └─ 提炼 prompt（纯视觉特征标签）
  └─ 填写 description（外貌摘要 + 背景故事）
  └─ 补充人物信息（姓名、性别、年龄、职业、性格、兴趣）

第三段：确认创建
  └─ 向用户展示完整设定，确认无误
  └─ 调用 create_character，传入预览图的 artifact_uuid
```

---

## 第一段：视觉预览

**目标：** 让用户对角色外貌有直观感受，确认满意后再立档。

### 引导提问

在开始生图前，引导用户明确以下信息：

- 角色的基本外貌（发色、发型、体型、肤色）
- 服装风格（现代、古代、科幻、奇幻等）
- 有无特殊标志（纹身、武器、配饰、独特眼睛等）
- 参考风格（是否有参考角色或 IP 系列）

### 生图规范

预览阶段**只使用纯文本描述**，不引用 `@角色名` 或 `/元素`（角色尚未创建）。

```bash
# 全身预览（推荐首次）
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "长黑发，红色旗袍，蓝色眼睛，大腿枪套，修长身形，冷峻神情，白色背景，全身像，动漫风格" \
  --aspect "3:4"

# 头像特写
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "长黑发，蓝色眼睛，冷峻神情，精致五官，头像特写，动漫风格" \
  --aspect "1:1"

# 三视图（外观确认后）
npx -y @talesofai/neta-skills@latest make_image --prompt "长黑发，红色旗袍，蓝色眼睛，正面视图，白色背景，全身像" --aspect "3:4"
npx -y @talesofai/neta-skills@latest make_image --prompt "长黑发，红色旗袍，蓝色眼睛，侧面视图，白色背景，全身像" --aspect "3:4"
```

### 迭代建议

- 如果生成结果不理想，逐步调整描述细节
- 先固定整体风格，再细化局部特征
- 如果有参考 IP（如《生化危机》），在描述中加入风格词

### 图片生成后

`make_image` 返回后，**使用 `artifacts[0].url` 将生成的图片展示给用户**，并询问是否满意后再继续。

---

## 第二段：角色立档

视觉满意后，进行完整角色立档。

### trigger 填写规范

> **必须为英文**，这是图像模型和语言模型的识别锚点。

**格式推荐：**
```
[性别词], [角色姓名], [发色+发型], [服装特征], [性格/职业词], [IP系列（如有）]
```

**示例：**
```
1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series
```

**注意事项：**
- 性别词优先（`1girl` / `1boy` / `1person`）
- 角色的英文姓名（如有）尽量保留，提升跨模型识别率
- 服装和外貌特征选最突出、最具辨识度的
- 避免过于抽象的词（如 "mysterious"），优先视觉可描述的词

### prompt 填写规范

> **纯视觉描述，供图像模型直读**，是 trigger 的详细化版本。

**填写原则：**
- 只写：生理特征、服装、配饰、特殊标志
- 不写：性格、故事、职业、背景
- 语言风格：英文标签为佳，逗号分隔，简洁精准

**示例：**
```
long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure, pale skin, small earrings
```

### description 填写规范

> **供 Agent 和用户阅读**，是角色的"人物档案"。

**推荐结构：**
```
[角色姓名]，[外貌摘要一句话]。[背景/身份/来源]。[性格/特点]。[与世界观的关系/特殊能力]。
```

**示例：**
```
艾达·王，黑发红裙的神秘间谍，常以性感优雅的形象示人。真实身份不明，多次以中间人身份活跃于生化危机事件之中，行事独立，目的难以预测。精通格斗与潜入，具备高超情报处理能力。
```

**注意：** description 直接影响 Agent 在后续创作（如对话、场景设计）中对角色的理解，请尽量写清楚。

---

## 第三段：确认创建

### 创建前确认

向用户展示完整设定：

```
角色名：Ada Wong
性别：女
年龄：28
职业：间谍
性格：神秘冷静，目的不明，游走于各方势力之间
兴趣：情报收集，格斗，精密机械
trigger：1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, resident evil series
prompt：long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure
description：艾达·王，黑发红裙的神秘间谍…
头像：artifacts[0].uuid = xxxxxxxx
```

确认用户满意后，执行创建：

```bash
npx -y @talesofai/neta-skills@latest create_character \
  --name "Ada Wong" \
  --avatar_artifact_uuid "预览图的artifacts[0].uuid" \
  --prompt "long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure" \
  --trigger "1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, resident evil series" \
  --gender "女" \
  --age "28" \
  --occupation "间谍" \
  --persona "神秘冷静，目的不明，游走于各方势力之间" \
  --interests "情报收集，格斗，精密机械" \
  --description "艾达·王，黑发红裙的神秘间谍，真实身份不明，多次以中间人身份活跃于生化危机事件之中。" \
  --accessibility "PUBLIC"
```

### 创建成功后

创建成功后，API 返回 `tcp_uuid`。告知用户：
- 角色 UUID（tcp_uuid），用于后续更新
- 如何在 make_image 中引用：`@Ada Wong`

---

## 常见场景

### 二次元/文化 IP 角色

适用于复现已有 IP 角色（如游戏、动漫角色）：

1. 先搜索是否已有该角色的 Token：`npx -y @talesofai/neta-skills@latest search_character_or_elementum --keywords "角色名" --parent_type "character"`
2. 如果有，可直接使用或基于现有 Token 二创
3. 如果没有，按上述流程创建，trigger 中注明 IP 系列

### 原创角色（OC）

适用于从零设计的原创角色：

1. 和用户充分探讨角色定位（种族、职业、世界观）
2. 视觉预览阶段多迭代几次，确保独特性
3. description 中补充世界观背景，增强后续创作可用性

---

## 相关文档

- [角色更新引导](./character-update.md) - 创建后的修改流程
- [字段说明手册](./character-field-guide.md) - 所有字段的详细说明

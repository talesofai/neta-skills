# 角色字段说明手册

`create_character` 和 `update_character` 所有字段的详细说明与填写规范。

---

## 必填字段

### `name`

角色名称，最多 128 字符。

- 中英文均可
- 建议与角色的真实姓名一致，便于后续通过 `@角色名` 引用
- 示例：`Ada Wong`、`奈塔`、`洛希OC`

---

### `avatar_artifact_uuid`（create 必填）

角色头像图片的素材 UUID，来自 `make_image` 返回的 `artifacts[0].uuid`。

- 必须是通过 `make_image` 生成的图片
- 建议使用全身像或半身像，清晰展示角色外貌
- 此图会作为角色的头像和 IMAGE_EDIT 模型的视觉锚点（`ref_image`）

---

### `prompt`（create 必填）

纯视觉特征描述，供图像模型直读。

**只写视觉，不写故事：**
| 写 ✅ | 不写 ❌ |
|-------|--------|
| 发色、发型 | 性格 |
| 服装、配饰 | 背景故事 |
| 体型、肤色 | 职业（除非有视觉体现）|
| 特殊标志（纹身、武器）| 情感状态 |

**语言风格：** 英文标签为佳，逗号分隔。

**示例：**
```
long black hair, red qipao dress, blue eyes, gun holster on thigh, slender figure, pale skin
```

---

### `trigger`（create 必填）

英文识别词，供语言模型和图像模型识别角色。

**格式推荐：**
```
[性别词], [角色姓名（英文）], [发色发型], [服装特征], [职业/性格词], [IP系列（如有）]
```

**规则：**
- **必须为英文**，中文 trigger 会显著降低识别率
- 性别词必须有（`1girl` / `1boy` / `1person` / `androgynous`）
- 角色的英文姓名尽量保留（提升跨模型识别率）
- 优先选最具辨识度的视觉特征
- 避免过于通用的词（如 `beautiful`、`cute`）

**示例：**
```
1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series
```

---

## 可选字段

### `gender`

角色性别。默认值：`自由`。

可选值：`男`、`女`、`中性`、`自由` 或自定义文本。

---

### `age`

角色年龄，字符串格式（支持模糊描述）。

- 示例：`28`、`少女`、`不明`、`数百岁`

---

### `occupation`

角色职业或身份。

- 示例：`间谍`、`魔法师`、`高中生`、`AI助手`

---

### `persona`

性格描述，供 Agent 在创作中把握角色气质。

- 侧重性格特点和行为模式
- 示例：`神秘冷静，目的不明，游走于各方势力之间，从不轻易信任他人`

---

### `interests`

兴趣爱好，逗号分隔。

- 示例：`情报收集，格斗，精密机械，品酒`

---

### `description`

角色简介，供 Agent 和用户阅读。这是 Agent 理解角色语境的核心字段。

**推荐结构：**
```
[姓名]，[外貌摘要]。[背景/身份/来源]。[性格特点]。[特殊能力/与世界观的关系]。
```

**示例：**
```
艾达·王，黑发红裙的神秘间谍，常以性感优雅的形象示人。真实身份不明，多次以中间人身份活跃于生化危机事件之中，行事独立，目的难以预测。精通格斗与潜入，具备高超情报处理能力。
```

> **重要：** description 直接影响 Agent 后续在使用该角色进行创作时的理解深度，建议尽量详细。

---

### `accessibility`

可见性设置。

| 值 | 含义 |
|----|------|
| `PUBLIC`（默认）| 所有用户可搜索和使用 |
| `PRIVATE` | 仅创建者可见和使用 |

---

## update_character 特有字段

### `tcp_uuid`（必填）

角色的唯一标识 UUID，通过 `request_character_or_elementum` 或 `create_character` 返回值获取。

---

## 字段关系总结

```
┌─────────────────────────────────────────────────────┐
│                  角色 Token (TCP/OC)                │
│                                                     │
│  给图像模型读                给 Agent/用户读          │
│  ──────────────             ─────────────────       │
│  trigger (识别词)            description (档案)      │
│  prompt  (视觉标签)          persona (性格)           │
│                             occupation / age        │
│                             interests               │
│                                                     │
│  anchor                                             │
│  ──────                                             │
│  avatar_artifact_uuid (头像图片，同时作为 ref_image)  │
└─────────────────────────────────────────────────────┘
```

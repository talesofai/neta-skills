# 奇遇剧本字段手册

所有奇遇剧本字段及其用法的完整参考。

## 剧本字段

### name
- **类型**: 字符串
- **最大长度**: 128 字符
- **必需**: 是
- **描述**: 奇遇剧本的标题
- **使用技巧**:
  - 保持简洁但引人入胜
  - 应该暗示类型/基调
  - 示例：「被遗忘的庄园」、「霓虹阴影：东京2087」

### subtitle
- **类型**: 字符串
- **必需**: 否
- **描述**: 简短的一行标语或钩子
- **使用技巧**:
  - 一句话，显示在剧本卡片上
  - 示例：「哥特式恐怖悬疑」、「在霓虹末日中生存」

### status
- **类型**: 枚举 ("PUBLISHED" | "DRAFT")
- **默认值**: "PUBLISHED"
- **必需**: 否
- **描述**: 剧本的可见性状态
- **用途**:
  - `PUBLISHED`: 对他人可见，可以分享
  - `DRAFT`: 私密，只有创建者可见

### header_img
- **类型**: 字符串 (URL)
- **必需**: 否
- **描述**: 卡片缩略图
- **使用技巧**:
  - 如需可用 `make_image` 生成
  - 应该代表剧本的基调
  - URL 格式：`https://oss.talesofai.cn/picture/{uuid}.webp`

### background_img
- **类型**: 字符串 (URL)
- **必需**: 否
- **描述**: 故事氛围的背景图片
- **使用技巧**:
  - 设定视觉基调
  - 通常比 header_img 更有氛围感

## 任务字段

### mission_plot
- **类型**: 字符串
- **必需**: 是
- **描述**: 核心故事/场景描述——Agent 用于讲述故事的叙事基础
- **长度**: 可以很长（复杂故事建议 1000+ 字符）
- **内容指南**:
  - 世界设定和背景
  - 初始场景/钩子
  - 不预定结果的关键故事元素
  - 氛围细节
- **写作风格**:
  - 第二人称（直接称呼玩家）或全知第三人称
  - 描述性和沉浸感
  - 建立利害关系但不预设结论

### mission_task
- **类型**: 字符串
- **必需**: 否
- **描述**: 玩家目标和互动规则
- **内容指南**:
  - 玩家应该完成什么
  - 他们如何与世界互动
  - 胜负条件（如适用）
  - 足够开放以允许玩家能动性
- **示例**:
  - 「探索庄园并揭开三个秘密」
  - 「在三个交战的派系之间谈判和平」
  - 「生存七天同时寻找解药」

### mission_plot_attention
- **类型**: 字符串
- **必需**: 否
- **描述**: AI 行为约束和风格指南——Agent 将这些作为硬性规则遵守
- **目的**: 保持 AI 行为与创建者意图一致
- **内容类别**:
  - **基调指南**：「保持氛围恐怖但不用 jump scares」
  - **内容边界**：「没有性内容，避免 graphic 暴力」
  - **机制约束**：「选择应在3回合内有可见后果」
  - **风格偏好**：「使用现在时，以有意义的选择结束」
- **最佳实践**：具体而非模糊

## 关系字段

### tcp_uuid
- **类型**: 字符串 (UUID)
- **必需**: 否
- **描述**: 用于角色扮演的绑定角色
- **用途**:
  - Agent 将在故事讲述中扮演此角色
  - 角色必须是 PUBLIC 和 PUBLISHED
  - 可通过传空字符串 "" 取消绑定
- **查找角色**:
  - 使用 `list_my_characters` 查看你创建的角色
  - 使用 `create_character` 创建新角色

## 响应字段（只读）

### uuid
- **类型**: 字符串 (UUID)
- **描述**: 剧本的唯一标识符

### mission_uuid / mission_slug
- **类型**: 字符串
- **描述**: 链接剧本和任务的内部标识符（仅供参考）

### ctime / mtime
- **类型**: 字符串 (ISO 8601 时间戳)
- **描述**: 创建和修改时间（由 `request_travel_campaign` 返回）

### creator
- **类型**: 对象 `{ uuid, nick_name }`
- **描述**: 创建剧本的用户（由 `request_travel_campaign` 返回）

### default_tcp（响应形状）
- **类型**: 对象 `{ uuid, name, avatar_img }` 或 null
- **描述**: 绑定角色的详情，用于角色扮演上下文

## 字段关系

```
TravelCampaign
├── 基本信息 (name, subtitle, status, header_img, background_img)
└── 任务 (1:1 链接)
    ├── mission_plot (故事基础)
    ├── mission_task (玩家目标)
    └── mission_plot_attention (AI 约束)
└── 可选关系
    └── tcp_uuid → default_tcp (绑定角色)
```

## 常见模式

### 最小可行剧本
```
name: "冒险标题"
mission_plot: "你发现自己身处..."
```

### 标准剧本
```
name: "黑木之谜"
subtitle: "哥特式恐怖体验"
mission_plot: "详细的故事设定..."
mission_task: "探索并发现三个秘密"
mission_plot_attention: "保持恐怖氛围，避免 graphic 暴力"
```

### 全功能剧本
```
name: "霓虹阴影：东京2087"
subtitle: "赛博朋克生存惊悚"
status: "PUBLISHED"
header_img: "https://oss.talesofai.cn/picture/..."
background_img: "https://oss.talesofai.cn/picture/..."
mission_plot: "广泛的世界构建..."
mission_task: "生存7天，找到原型，选择信任谁"
mission_plot_attention: "基调：粗粝但充满希望。没有性内容。玩家能动性至关重要。"
tcp_uuid: "character-uuid-here"
```

## 验证规则

1. **name**: 必需，最多 128 字符
2. **mission_plot**: 必需，输入时裁剪，不能为空
3. **status**: 必须是 "PUBLISHED" 或 "DRAFT"
4. **tcp_uuid**: 如提供，角色必须存在且为 PUBLIC 和 PUBLISHED
5. **所有文本字段**: 受内容审核（违规返回 HTTP 451）
6. **图片**: 受图片内容审核（违规返回 HTTP 420）

## 更新行为

使用 `update_travel_campaign` 时：
- 只有提供的字段会被修改
- 省略的字段保留当前值
- 将 tcp_uuid 设为 `""` 解绑角色
- 更新同时原子性地影响剧本和链接的任务

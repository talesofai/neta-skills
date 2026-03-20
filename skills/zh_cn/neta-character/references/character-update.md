# 角色更新引导

已有角色的修改场景与操作流程。

---

## 核心原则

`update_character` **只传需要改的字段**，未传入的字段保持不变。传入空字符串 `""` 可清空可选字段。

---

## 获取 tcp_uuid

更新前需先获取角色的 `tcp_uuid`：

```bash
# 通过角色名搜索
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "Ada Wong"
```

返回结果中的 `uuid` 字段即为 `tcp_uuid`。

---

## 常见更新场景

### 场景一：视觉不满意，重新生图

用户对角色外貌不满意，需要重新生图并更换头像。

**流程：**
1. 用 `make_image` 重新生成角色预览（参考[角色创建引导](./character-creation.md)的预览规范）
2. 确认满意后，用新的 `artifacts[0].uuid` 更新头像和 prompt

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --avatar_artifact_uuid "新生成图的artifacts[0].uuid" \
  --prompt "更新后的视觉特征，如：long black hair, updated outfit details"
```

### 场景二：补充或修改角色背景

角色设定已有变化，或初次创建时背景故事不完整。

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --description "更新后的完整角色背景故事" \
  --persona "更新后的性格描述" \
  --occupation "新的职业" \
  --interests "新的兴趣爱好"
```

### 场景三：修正 trigger 提升识别率

如果使用 `@角色名` 生图时角色特征不准确，可能需要优化 trigger。

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --trigger "1girl, Ada Wong, long black hair, red qipao dress, gun holster, spy, elegant, cold expression, resident evil series"
```

**优化方向：**
- 确保包含性别词（`1girl` / `1boy`）
- 加入角色的英文姓名
- 突出最具辨识度的视觉特征
- 若属于某 IP，加入系列名

### 场景四：改变可见性

将角色从私密改为公开，或反之：

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --accessibility "PUBLIC"
```

### 场景五：清空某个可选字段

传入空字符串 `""` 可清空字段：

```bash
npx -y @talesofai/neta-skills@latest update_character \
  --tcp_uuid "角色的tcp_uuid" \
  --interests ""
```

---

## 更新后验证

更新完成后，可以用 `make_image` 验证效果：

```bash
# 用更新后的角色生成测试图
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@Ada Wong，白色背景，全身像，展示更新后的外观" \
  --aspect "3:4"
```

如果 trigger 或 prompt 有变化，可能需要等待几分钟让系统同步。

---

## 相关文档

- [角色创建引导](./character-creation.md) - 完整创作流程
- [字段说明手册](./character-field-guide.md) - 所有字段的详细说明

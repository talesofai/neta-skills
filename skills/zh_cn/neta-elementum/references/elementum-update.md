# 元素更新引导

已有元素的修改场景与操作流程。

---

## 核心原则

`update_elementum` **只传需要改的字段**，未传入的字段保持不变。传入空字符串 `""` 可清空 `description` 等可选字段。

---

## 获取 tcp_uuid

更新前需先获取元素的 `tcp_uuid`：

```bash
npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "元素名"
```

返回结果中的 `uuid` 字段即为 `tcp_uuid`。

---

## 常见更新场景

### 场景一：视觉不准确，重新生图

元素的代表图不能准确表达概念，需要重新生图。

**流程：**
1. 参考[炼金引导](./elementum-alchemy.md)的视觉预览规范，重新生图
2. 确认满意后，同时更新 `artifact_uuid` 和 `prompt`

```bash
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --artifact_uuid "新生成图的artifacts[0].uuid" \
  --prompt "更新后的生图指令"
```

### 场景二：优化 prompt 提升生图效果

使用 `/元素名` 生图时效果不理想，需要优化生图指令。

```bash
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --prompt "优化后的生图指令，更精准的视觉描述"
```

**优化方向：**
- 增加关键视觉词的权重（靠前的词权重更高）
- 加入艺术风格词稳定输出
- 去掉过于模糊的描述词
- 确保 prompt 可以单独使用（不依赖特定角色）

### 场景三：完善 description 使用说明

Agent 在使用该元素时理解不准确，需要完善说明。

```bash
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --description "更新后的使用说明：此元素表示[X]，使用时[方法]，参考图展示[说明]。[注意事项]"
```

### 场景四：添加或更换参考图

需要添加一张参考图来锚定视觉风格。

```bash
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --ref_image_uuid "参考图的artifact_uuid"
```

参考图来源：
- `make_image` 生成的图片的 `artifacts[0].uuid`
- `read_collection` 获取到的图片 artifact

### 场景五：改变可见性

```bash
npx -y @talesofai/neta-skills@latest update_elementum \
  --tcp_uuid "元素的tcp_uuid" \
  --accessibility "PRIVATE"
```

---

## 更新后验证

更新 prompt 后，用 `make_image` 验证效果：

```bash
# 单独测试元素效果
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "/RE4村庄，夜晚，写实风格" \
  --aspect "16:9"

# 搭配角色测试组合效果
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@Ada Wong, /RE4村庄，战斗姿态，夜晚" \
  --aspect "3:4"
```

---

## 相关文档

- [元素炼金引导](./elementum-alchemy.md) - 完整炼金流程
- [字段说明手册](./elementum-field-guide.md) - 所有字段的详细说明

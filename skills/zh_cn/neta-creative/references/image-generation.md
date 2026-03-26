# 图片生成最佳实践

理解用户需求，完善提示词，在满足用户要求的同时，提升画面的细节和氛围感。

适用于 `make_image` 和 `remove_background` 命令。

---

## 提示词结构

- 角色:通过"@角色名"格式使用角色,如"@角色名"。角色名必须是完全一致的字符串,不得修改,不得加空格,不得简体繁体转换。这个引用会包含角色的完整形象信息。
- 画面元素:通过"/元素名称"格式使用工具自带的画面元素,如"/漫画屋"。
- 参考图: 使用 `8_image_edit` 时，用 **`参考图-<uuid>`** 引用已有**图片素材**，如 `参考图-1234567890`；亦可使用 **`ref_img-<uuid>`**（与英文 CLI 说明一致），解析效果相同。最多 14 张
- 中文自然语言词组:由短语组成的描述画面的文本,如果没有引用角色,则需要在自然语言词组中描述角色形象.

**推荐格式：**
```
[角色] + [画面元素] + [参考图] + [主体描述] + [外观细节] + [服装/配饰] + [姿势/动作] + [背景/环境] + [光影/氛围] + [艺术风格]
```

**注意：**
  - 对于 noobxl 模型，@角色名 必须放在首位
  - 画面元素必须以 "/名称" 形式出现,如 "/漫画屋"
  - 对于 8_image_edit 模型，要多提供上下文和意图。要描述场景，而不仅仅是列出关键字。该模型的核心优势在于其深厚的语言理解能力。与一连串不相关的字词相比，叙述性描述段落几乎总是能生成更好、更连贯的图片
  - 可以通过 search_character_or_elementum 搜索来获取可以使用的角色或元素，使用前通过 request_character_or_elementum 验证角色或者元素可用
  - 参考图须为 **`参考图-<uuid>`** 或 **`ref_img-<uuid>`**（`<uuid>` 为图片素材 ID）。来源包括：**`upload`（本地文件）**、`read_collection` 中的图片、或其它已生成的图片素材
  - 引用角色或者元素的时候,前后要添加空格或逗号分隔,如："@奈塔#996, /漫画风格, 在校园里散步"
  - 对于修改图片等跟原图参考相关的生成,请一定使用携带参考图并使用 8_image_edit 模型
  - 示例(引用角色和元素)：@奈塔#996, /漫画风格, 参考图-uuid, 参考图-uuid, 词组1, 词组2…
  - **存在具体的角色时，通过@角色名来使用角色，而不是重新描述角色的外貌**
---

## 模型选择

- 3_noobxl: 单角色的风格类图像生成，提示词使用 danbooru tag 格式。擅长多种画风还有画风组合，不擅长复杂场景、多角色、带文字的图像。当用户指定了具体的角色及风格元素需要绘制风格化的角色图片时优先使用这个模型。

生成角色的风格化立绘

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@奈塔#996，/漫画风格，角色立绘" \
  --aspect "3:4" \
  --model_series "3_noobxl"
```

- 8_image_edit（默认）: 全能高级图像生成模型，提示词使用自然语言描述，支持多张图片输入。擅长遵循复杂的指令并呈现高保真文本、多角色绘制、带文字的图像。不擅长精美的画风。可以用于连续艺术（漫画分格 / 故事板）、添加和移除元素、局部重绘（语义遮盖）、风格迁移、组合多张图片让事物焕发活力等。当涉及多个角色、参考图包含复杂的画面结构及文字内容或对指定的图片进行修改调整时优先使用这个模型

生成角色的多格漫画

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@奈塔#996，多格搞笑漫画" \
  --aspect "3:4" \
  --model_series "8_image_edit"
```

## 宽高比选择

| 比例 | 分辨率 | 适用场景 |
|------|--------|----------|
| `1:1` | 1024*1024 | 头像、图标、方形展示图 |
| `3:4` | 896*1152 | **默认推荐**，社交媒体竖图、海报 |
| `4:3` | 1152*896 | 横版插图、演示文稿 |
| `9:16` | 768*1344 | 手机壁纸、短视频封面、Stories |
| `16:9` | 1344*768 | 视频封面、横幅、桌面壁纸 |

**当需要使用上述五种比例时优先使用--aspect参数**

生成3:4的角色立绘

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@奈塔#996，角色立绘" \
  --aspect "3:4"
```

**当需要特殊的图片比例时直接使用--width,--height参数**

生成2:1的宽幅海报

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@奈塔#996，宽幅海报" \
  --width "1536" \
  --height "768"
```

**注意：使用自定义分辨率时，过高或过低的数值会导致画面崩坏，尽可能的将数值控制在[768-1536]之间**

---

## 本地文件作为参考图

若图片**只存在于本机**，请先执行 **`upload`**，再在提示词中使用 **`参考图-<uuid>`** 或 **`ref_img-<uuid>`**（`<uuid>` 取自上传命令返回的 JSON）。支持格式、大小及与 `make_video` / `remove_background` 的衔接见 [媒体上传](./media-upload.md)。

---

## 常见用例

### 角色立绘

```bash
npx -y @talesofai/neta-skills@latest make_image \
  --prompt "@奈塔#996，水手服，站在教室门口，阳光从窗户洒进来，清新自然" \
  --aspect "3:4"
```

### 三视图设定

```bash
# 正面
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，正面视图，白色背景，全身像" --aspect "3:4"

# 侧面
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，侧面视图，白色背景，全身像" --aspect "3:4"

# 背面
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，背面视图，白色背景，全身像" --aspect "3:4"
```

### 表情集

```bash
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，开心表情，特写，白色背景" --aspect "1:1"
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，生气表情，特写，白色背景" --aspect "1:1"
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，惊讶表情，特写，白色背景" --aspect "1:1"
npx -y @talesofai/neta-skills@latest make_image --prompt "@角色名，害羞表情，特写，白色背景" --aspect "1:1"
```

### 去背景（抠图）

```bash
npx -y @talesofai/neta-skills@latest remove_background --input_image "image_artifact_uuid"
```
---

## 常见问题

### Q: 生成结果不符合预期怎么办？

**A:** 逐步调整提示词：
1. 增加具体细节描述
2. 明确艺术风格
3. 简化过于复杂的场景
4. 尝试不同的宽高比

### Q: 人物脸部崩坏怎么办？

**A:** 
1. 避免过于复杂的表情描述
2. 不要同时描述多个动作
3. 尝试添加"精致的面部特征"等描述
4. 使用特写构图（在提示词中强调"面部特写"）

### Q: 如何保持角色一致性？

**A:**
1. 使用固定的角色特征描述
2. 保存成功的提示词模板
3. 先查询角色详情获取标准描述
   ```bash
   npx -y @talesofai/neta-skills@latest request_character_or_elementum --name "角色名"
   ```
4. 基于角色描述生成提示词

---

## 相关文档

- [角色查询](./character-search.md) - 获取角色标准信息
- [视频生成](./video-generation.md) - 将图片转换为动态视频
- [媒体上传](./media-upload.md) - 本地文件 → 素材，供参考图 / 视频首帧 / 抠图使用

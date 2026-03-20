# 上传用户媒体（本地文件）

当用户有**磁盘上的图片或视频**，需要先变成 Neta 平台上的**素材（artifact）** 时，使用 **`upload`** 命令。CLI 会读取文件、通过 STS 上传到对象存储、登记为图片或视频素材，并轮询直到状态离开 `PENDING` / `MODERATION`。

**命令**

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "/绝对路径或相对路径/文件.png"
```

**前置条件**

- 需设置 **`NETA_TOKEN`**（与其他需登录的命令相同）。未登录会报错。
- **`file_path`**：绝对路径，或相对于**执行命令时当前工作目录**的相对路径。

---

## 支持的格式与大小限制

类型依据文件 **魔数** 检测（不仅看扩展名）。无法识别或不支持的类型会触发 `file_type_not_supported`。

| 类型 | 扩展名（示例） | 默认最大体积 |
|------|----------------|--------------|
| 图片 | `png`、`jpeg`、`webp`、`gif` | 10 MiB |
| 视频 | `avi`、`mov`、`flv`、`mkv`、`webm`、`mp4`、`mpeg`、`wmv`、`rm`、`vob`、`ts` | 100 MiB |

超出限制会触发 `file_size_too_large`。

**地域与存储桶**：实现会根据 API 基址是否以 `.cn` 结尾选择国内或海外 OSS，一般无需在技能侧单独配置。

---

## 命令输出

成功时返回 **素材详情**（与其他 artifact 接口结构一致），通常包括：

- **`uuid`**：素材 ID —— 凡是命令要求「素材 UUID」的场景都使用它（见下表）。
- **`url`**：可访问的图片/视频 URL（若已就绪）—— 用于要求 **图片 URL** 的参数（例如 `make_video --image_source`）。
- **`modality`**、**`status`**，以及可选的 `image_detail` / `video_detail`。

需等待命令执行结束；其中已包含上传与审核轮询（极端情况下仍可能超时，按错误处理或换更小文件重试）。

---

## 上传结果在创作技能中的用法

以下 **`neta-creative`** 流程会在素材已存在（通过 **`upload`**、此前 **`make_image`** 产出、或 **`read_collection`** 等）时消费用户侧内容。

| 目标 | 命令 | 如何使用 `upload` 的返回值 |
|------|------|---------------------------|
| 图生图 / 多参考图（`8_image_edit`） | `make_image` | 在提示词中写 **`参考图-<uuid>`** 或 **`ref_img-<uuid>`**（最多 14 张，两种前缀解析器均支持）。见 [图片生成](./image-generation.md)。 |
| 图生视频 | `make_video` | **`--image_source`** 填素材的 **`url`**（字符串 URL），不要只填裸 UUID。见 [视频生成](./video-generation.md)。 |
| 抠图 / 去背 | `remove_background`、`remove_background_nocrop` | **`--input_image`** 填素材 **`uuid`**。见 [图片生成](./image-generation.md) 中去背景一节。 |
| 从作品 Remix | `read_collection` | 合集载荷里可能带参考图；**本地文件**不会自动进入合集 —— 先 **`upload`**，再在 `make_image` 里用 **`参考图-<uuid>`** / **`ref_img-<uuid>`**，或把 **`url`** 用于 `make_video`。见 [内容创作思路](./collection-remix.md)。 |
| 发布或更新合集素材 | `publish_collection`、`edit_collection` | **`artifacts`**：逗号分隔的**图片 UUID**（1～12 个）。先上传图片，再传入对应 UUID。 |

**`make_song`** 不接受图片/视频文件；做 MV 仍按 [歌曲 MV](./song-mv.md) 组合歌曲与画面。若封面只在本地，先 **`upload`** 再接到 `make_image` / `make_video`。

---

## 推荐工作流

### 本地静图 → 视频

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./静帧.png"
# 从输出的 JSON 中取 "url" 作为 image_source，或 "uuid" 用于后续步骤

npx -y @talesofai/neta-skills@latest make_video \
  --image_source "<上传输出中的_URL>" \
  --prompt "轻微呼吸感，发丝微动，光线柔和。" \
  --model "model_s"
```

### 本地图片 → 用 `8_image_edit` 改图

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./参考.jpg"

npx -y @talesofai/neta-skills@latest make_image \
  --prompt "参考图-<上传输出中的_UUID>，改为冬装外套，保持姿势与背景不变" \
  --aspect "3:4" \
  --model_series "8_image_edit"
```

（将 `参考图-` 换成 `ref_img-` 效果相同。）

### 本地图片 → 抠图

```bash
npx -y @talesofai/neta-skills@latest upload --file_path "./角色.png"

npx -y @talesofai/neta-skills@latest remove_background --input_image "<上传输出中的_UUID>"
```

---

## 相关文档

- [图片生成](./image-generation.md) — 参考图写法、模型、去背景。
- [视频生成](./video-generation.md) — `image_source` 与动作描述。
- [歌曲 MV](./song-mv.md) — 歌曲与画面组合。
- [内容创作思路](./collection-remix.md) — `read_collection` 与二创流程。

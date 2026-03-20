# 内容创作最佳实践

利用已有的信息、工具集和参考素材，精确执行指令，帮助用户生成高质量的幻想内容。

# Constraints (关键执行限制)

- 除非任务完成或必须确认关键信息，否则**坚持连续调用指令**直到任务结束，减少对用户的打扰。
- 指令调用不共享上下文，必须每次传入完整的参数信息。
- **严禁**使用未提供的指令。
- **失败重试**：若指令调用失败，最多重试一次，且必须使用**原参数**重试，禁止擅自修改参数逻辑。

# Reference Context (参考素材)

你需要使用 `read_collection` 指令获取参考信息进行 Remix（二创）、复现或改编，以满足用户需求

```bash
npx -y @talesofai/neta-skills@latest read_collection --uuid "作品-uuid"
```

**返回内容**
- 玩法信息
- 玩法内包含的素材
- 创作者信息
- Remix
  - preset_description 参考概要
  - reference_planning 参考的执行规划
  - launch_prompt
    - core_input 详细的改编描述信息
    - brief_input 简略的改编描述信息
    - ref_image 参考图

## 开始创作

适用 `make_image` `make_video` `make_song` 命令。

若用户提供的**图片或视频在本地**、不在合集返回的素材列表中，请先 **`upload`**，再在 `make_image` 中使用 **`参考图-<uuid>`** / **`ref_img-<uuid>`**，或在 `make_video` 中使用素材的 **`url`**。详见 [媒体上传](./media-upload.md)。

📖 - [生成图片](./image-generation.md)

📖 - [生成视频](./video-generation.md)

📖 - [生成歌曲](./song-creation.md)

📖 - [媒体上传](./media-upload.md)

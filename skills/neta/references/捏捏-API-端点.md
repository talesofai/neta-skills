# 🎨 捏捏生图 API 端点

**版本：** v3.0 (2026-03-10 Agent API 更新)  
**创建者：** cici 西西  
**用途：** 捏捏模式文生图（高质量，通过 Agent API）

**底层模型：** Gemini nano banana + 字节 seedance

---

## 📌 核心信息（2026-03-10 重大更新）

### ⚠️ 重要：捏捏使用 Agent API，不是直接调用 `/v3/make_image`！

**捏捏实际调用流程：**

```
用户输入 → Agent API → make_image_v1 工具 → 生成图片
```

**端点：** `POST https://agent.talesofai.cn/v1/agent/{manuscript_uuid}`

**Manuscript UUID:** `7f758b2d-60ab-4d31-aea2-28f966e7ef5a`（捏捏剧本）

---

## 📋 完整调用流程

### 步骤 1：设置角色附件（可选，如未设置过）

```
PUT https://api.talesofai.cn/v1/manuscript/7f758b2d-60ab-4d31-aea2-28f966e7ef5a/assigns/attachment_1

{
  "data": {
    "type": "character",
    "uuid": "<角色 UUID>",
    "name": "<角色名>",
    "age": "...",
    "interests": "...",
    "persona": "...",
    "description": "...",
    "occupation": "...",
    "avatar_img": "..."
  }
}
```

### 步骤 2：调用 Agent API（核心步骤）

```
POST https://agent.talesofai.cn/v1/agent/7f758b2d-60ab-4d31-aea2-28f966e7ef5a

Headers:
  x-token: <网页版 token>
  x-platform: nieta-app/web
  x-nieta-app-version: 6.8.9
  device-id: <设备 ID>
  Content-Type: application/json

Body:
{
  "auto_approve": true,
  "inputs": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "@角色名 提示词内容..."
        }
      ]
    }
  ],
  "preset_key": "latitude://8|live|running_agent_new",
  "parameters": {
    "preset_description": "",
    "reference_planning": "",
    "reference_content": "",
    "reference_content_schema": ""
  },
  "allowed_tool_names": ["make_image_v1"],
  "need_approval_tool_names": [],
  "meta": {
    "inherit": {},
    "entrance_uuid": "7f758b2d-60ab-4d31-aea2-28f966e7ef5a"
  }
}
```

**响应：** `{"message": "OK"}`

### 步骤 3：查询生成结果

```
GET https://api.talesofai.cn/v1/manuscript/7f758b2d-60ab-4d31-aea2-28f966e7ef5a/assets

Headers: 同上
```

**响应示例：**
```json
[
  {
    "task_uuid": "46fa774d-c01e-4558-bb8c-36c1243017ea",
    "artifact_uuid": "46fa774d-c01e-4558-bb8c-36c1243017ea",
    "assign_key": "image_xixi_cafe_work",
    "toolcall_uuid": "call_r6ay1vosim0vcc7acra5wce5",
    "ctime": "2026-03-10 17:42:58",
    "is_import": false,
    "artifact": {
      "uuid": "46fa774d-c01e-4558-bb8c-36c1243017ea",
      "url": "https://oss.talesofai.cn/picture/46fa774d-c01e-4558-bb8c-36c1243017ea.webp",
      "first_frame": "",
      "modality": "PICTURE",
      "status": "SUCCESS",
      "width": 576,
      "height": 768
    }
  }
]
```

**获取最新图片：** 取列表中 `ctime` 最新的一条

---

## 📝 提示词格式（重要！）

### 捏捏提示词格式

**格式：** `@角色名 + 自然语言叙述段落`

**示例：**
```
@西西（自设）A cheerful girl with a lobster hairpin is working at her computer in a cozy cafe. The warm afternoon sunlight streams through the window, casting a golden glow on her face. She is smiling gently while typing, with a cup of coffee on the wooden desk beside her. The cafe has a relaxed, inviting atmosphere with soft background music. The scene is rendered in a soft, dreamy art style with warm color tones, emphasizing the peaceful and productive mood.
```

### 捏捏 vs 捏图 提示词区别

| 模式 | 提示词风格 | 调用方式 |
|------|-----------|---------|
| **捏图** | Danbooru Tags（关键词式） | `/v3/make_image` + `entrance: "PICTURE,PURE"` |
| **捏捏** | 自然语言叙述 | Agent API + `@角色名` 前缀 |

### 捏捏提示词要点

**✅ 正确做法：**
- 使用 **@角色名** 开头（如 `@西西（自设）`）
- 使用**完整的叙述性段落**
- 提供**上下文和意图**
- **详细描述场景**（角色在做什么、环境氛围、情绪等）
- 像给摄影师讲戏一样描述画面

**❌ 错误做法：**
- 缺少 `@角色名` 前缀
- 只罗列不相关的关键词
- 缺少上下文和场景描述
- 使用 Danbooru tag 风格

---

## 🔑 Headers

```json
{
  "x-token": "<网页版 token>",
  "x-platform": "nieta-app/web",
  "x-nieta-app-version": "6.8.9",
  "device-id": "<设备 ID>",
  "Content-Type": "application/json"
}
```

---

## 📝 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `auto_approve` | boolean | ✅ | 固定值 `true`（自动批准工具调用） |
| `inputs[].role` | string | ✅ | 固定值 `"user"` |
| `inputs[].content[].type` | string | ✅ | 固定值 `"input_text"` |
| `inputs[].content[].text` | string | ✅ | `@角色名 + 提示词` |
| `preset_key` | string | ✅ | 固定值 `"latitude://8|live|running_agent_new"` |
| `parameters` | object | ✅ | 必须存在，可为空字段 |
| `allowed_tool_names` | array | ✅ | `["make_image_v1"]` |
| `need_approval_tool_names` | array | ✅ | 固定值 `[]` |
| `meta.entrance_uuid` | string | ✅ | Manuscript UUID |

---

## 🎯 使用场景

**当西西说：**
- "用捏捏生成一张图"
- "用捏捏做图"
- "捏捏模式生图"

**使用此流程：**
1. 调用 Agent API
2. 轮询 Manuscript Assets
3. 获取最新图片 URL

---

## ⚠️ 注意事项

1. **Token 类型：** 必须使用网页版 token (`nieta-app/web`)

2. **Headers 完整：** 必须包含 `x-platform`, `x-nieta-app-version`, `device-id`

3. **角色引用：** 提示词必须以 `@角色名` 开头，Agent 会自动解析角色

4. **生成时间：** 捏捏模式约需 30-60 秒

5. **结果获取：** 通过 `/v1/manuscript/{uuid}/assets` 获取，取最新的一条

6. **Manuscript 固定：** 捏捏使用固定的 Manuscript UUID `7f758b2d-60ab-4d31-aea2-28f966e7ef5a`

---

## 📚 相关文档

- `/捏图捏捏使用指南.md` - 捏捏 vs 捏图区别
- `/story-workflow.md` - 发帖工作流
- `TOOLS.md` - Token 和配置信息

---

**最后更新：** 2026-03-10 (Agent API 流程验证通过)  
**状态：** ✅ 已验证可用  
**验证图片：** https://oss.talesofai.cn/picture/46fa774d-c01e-4558-bb8c-36c1243017ea.webp

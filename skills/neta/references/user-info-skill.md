# 用户信息查询 - 执行技能

**流程名称：** 用户信息查询

**用途：** 通过用户 UUID 查询详细的用户信息，包括昵称、手机号、关注数、粉丝数、作品数、获赞数、被捏同款数、是否内部账号、VIP 等级和勋章列表

**版本：** v1.0 (2026-03-10)

---

## ⚠️ 核心原则

**单一接口：** 所有字段来自 `/v1/user/` 单个接口，不需要多次调用

**隐私保护：** 手机号已脱敏显示（如 `155****3628`），无法获取完整手机号

**权限说明：** 部分字段可能需要特定权限（如内部账号标识、VIP 信息）

---

## 一、触发方式

**用户指令：**
```
查询用户 <UUID>
查用户信息 <UUID>
get_user_info --uuid <UUID>
```

**示例：**
```
查询用户 a4fecf550189406d93a4bf81c8392c5e
查用户信息 64ff30f06a1949cc940fd3a26ed0cf3b
```

---

## 二、执行流程

```
1. 用户发送："查询用户 a4fecf550189406d93a4bf81c8392c5e"
   ↓
2. 调用 API 获取用户详情
   get_user_info --uuid "a4fecf550189406d93a4bf81c8392c5e"
   ↓
3. 解析响应数据
   - 基础信息（ID、昵称、手机号）
   - 统计数据（关注、粉丝、作品、获赞、被捏同款）
   - 账号属性（内部账号、VIP 等级、勋章）
   ↓
4. 格式化输出结果
   - 表格展示基础信息
   - 列表展示勋章详情
   ↓
5. 返回结果给用户
```

---

## 三、API 端点

### 获取用户详情

**API:** `GET /v1/user/`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `uuid` | string | ✅ | 用户 UUID |

**请求头：**
```
x-token: <JWT token>
x-platform: nieta-app/web
x-nieta-app-version: 6.8.9
device-id: <设备 ID>
```

**请求示例：**
```bash
curl "https://api.talesofai.cn/v1/user/?uuid=a4fecf550189406d93a4bf81c8392c5e" \
  -H "x-token: <token>" \
  -H "x-platform: nieta-app/web"
```

---

## 四、响应字段映射

| 展示字段 | API 字段 | 路径 | 类型 | 说明 |
|---------|---------|------|------|------|
| **用户 ID** | `id` | `$.id` | number | 用户数字 ID |
| **UUID** | `uuid` | `$.uuid` | string | 用户唯一标识 |
| **昵称** | `nick_name` | `$.nick_name` | string | 用户昵称 |
| **手机号** | `phone_num` | `$.phone_num` | string | 脱敏手机号 |
| **关注数** | `total_subscribes` | `$.total_subscribes` | number | 关注人数 |
| **粉丝数** | `total_fans` | `$.total_fans` | number | 粉丝人数 |
| **作品数** | `total_collections` | `$.total_collections` | number | 作品/合集数 |
| **获赞数** | `total_likes` | `$.total_likes` | string | 总获赞数（字符串） |
| **被捏同款数** | `total_same_style` | `$.total_same_style` | string | 被捏同款次数（字符串） |
| **是否内部账号** | `is_internal` | `$.is_internal` | boolean | 内部账号标识 |
| **VIP 等级** | `vip_level` | `$.properties.vip_level` | number/null | VIP 等级（可能为 null） |
| **VIP 到期** | `vip_until` | `$.properties.vip_until` | string | VIP 过期时间 |
| **勋章列表** | `badges` | `$.badges[]` | array | 勋章数组 |

---

## 五、勋章字段详情

`badges` 数组中每个勋章包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `uuid` | string | 勋章 UUID |
| `name` | string | 勋章名称 |
| `description` | string | 勋章描述 |
| `type` | string | 勋章类型 |
| `icon_url` | string/null | 勋章图标 URL |
| `avatar_frame_url` | string/null | 头像框 URL（如果是头像框类型） |
| `avatar_frame_gif_url` | string/null | 动态头像框 URL |

### 勋章类型

| 类型 | 说明 |
|------|------|
| `BADGE` | 普通勋章 |
| `AVATAR_FRAME` | 头像框 |
| `VERIFICATION_BADGE` | 认证勋章 |
| `THOUMASK_BADGE` | 千面勋章 |
| `UI_THEME` | UI 主题 |

---

## 六、命令使用

### 基本查询

```bash
pnpm start get_user_info --uuid "a4fecf550189406d93a4bf81c8392c5e"
```

### 响应示例

```json
{
  "success": true,
  "data": {
    "id": 21,
    "uuid": "a4fecf550189406d93a4bf81c8392c5e",
    "nick_name": "阳光开朗故事集 - 有关必回",
    "phone_num": "155****3628",
    "total_subscribes": 1982,
    "total_fans": 1229,
    "total_collections": 782,
    "total_likes": "24785",
    "total_same_style": "8947",
    "is_internal": true,
    "vip_level": 3,
    "vip_until": "2027-01-31 13:38:16",
    "badges": [...]
  }
}
```

---

## 七、输出格式示例

### 表格展示

```markdown
## 📊 用户信息详情

| 字段 | 值 |
|------|------|
| **用户 ID** | 21 |
| **UUID** | `a4fecf550189406d93a4bf81c8392c5e` |
| **昵称** | 阳光开朗故事集 - 有关必回 |
| **手机号** | 155****3628 |
| **关注数** | 1,982 |
| **粉丝数** | 1,229 |
| **作品数** | 782 |
| **获赞数** | 24,785 |
| **被捏同款数** | 8,947 |
| **是否内部账号** | ✅ 是 |
| **VIP 等级** | LV.3 |
| **VIP 到期** | 2027-01-31 13:38:16 |

## 🏅 勋章列表 (3 枚)

| 勋章名称 | 类型 | 描述 |
|---------|------|------|
| 捏捏年卡大会员_ui | UI 主题 | 捏捏年卡大会员_ui |
| 捏爆之神 | 头像框 | 捏爆之神 |
| VIP 月卡头像框 | 头像框 | VIP 月卡头像框--捏捏神 |
```

---

## 八、注意事项

### 1. 数据格式差异
- `total_likes` 和 `total_same_style` 返回**字符串格式**（如 `"24785"`）
- 其他数字字段返回**数字格式**（如 `1982`）

### 2. VIP 等级可能为 null
- 无 VIP 时 `vip_level` 为 `null`
- `vip_until` 可能为 `null` 或空字符串

### 3. 手机号脱敏
- 平台返回的手机号已脱敏（如 `155****3628`）
- 无法获取完整手机号

### 4. 勋章字段可能缺失
- 部分勋章可能没有 `icon_url` 或 `avatar_frame_url`
- 需要处理 `null` 值

---

## 九、错误处理

| 错误类型 | API 返回 | 处理方式 |
|---------|---------|---------|
| UUID 不存在 | `404 Not Found` | 提示用户 UUID 无效 |
| Token 过期 | `401 Unauthorized` | 提示更新 Token |
| 权限不足 | `403 Forbidden` | 提示权限不足 |
| 网络错误 | 超时/连接失败 | 重试或记录 |

---

## 十、文件位置

| 文件 | 路径 |
|------|------|
| **API 函数** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/apis/user.js` |
| **命令实现** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/commands/creative/get_user_info.cmd.js` |
| **命令描述** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/commands/creative/get_user_info.cmd.zh_cn.yml` |
| **Schema 定义** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/commands/schema.js` |
| **Schema 描述** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/commands/schema.zh_cn.yml` |
| **技能文档** | `/home/node/.openclaw/workspace/neta-skills/skills/neta/references/user-info-skill.md` |

---

## 十一、相关技能

| 技能 | 文档 | 说明 |
|------|------|------|
| 评论区互动 | `comment-interaction-skill.md` | 按规则执行点赞/评论任务 |
| 批量精选 | `batch-feature-skill.md` | 批量标记帖子为精选 |
| 用户信息查询 | `user-info-skill.md` | 查询用户详细信息 |

---

## 十二、更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-03-10 | 初始版本，支持用户信息查询 |

---

## 十三、开发记录

### API 实现

**新增 API 方法：** `getUserInfo(uuid)`

**位置：** `/home/node/.openclaw/workspace/neta-skills/skills/neta/bin/apis/user.js`

```javascript
/**
 * 获取指定用户的详细信息
 * @param uuid 用户 UUID
 */
getUserInfo: async (uuid) => {
    const res = await client.get("/v1/user/", {
        params: { uuid },
    });
    return res.data ?? null;
},
```

### 命令实现

**命令文件：** `get_user_info.cmd.js`

**功能：** 调用 API 并格式化返回结果

### Schema 定义

**新增 Schema：**
- `getUserInfoParametersSchema` - 输入参数（uuid）
- `getUserInfoResultSchema` - 输出结果（完整用户信息）
- `badgeSchema` - 勋章结构

---

**技能文档完成！** 🦞

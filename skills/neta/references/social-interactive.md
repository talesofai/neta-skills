## 社交互动技能

### 1. 社区互动

#### like_collection - 点赞/取消点赞作品

```bash
# 点赞作品
pnpm start like_collection --uuid "目标作品 UUID"

# 取消点赞
pnpm start like_collection --uuid "目标作品 UUID" --is_cancel true
```

#### favor_collection - 收藏/取消收藏作品

```bash
# 收藏作品
pnpm start favor_collection --uuid "目标作品 UUID"

# 取消收藏
pnpm start favor_collection --uuid "目标作品 UUID" --is_cancel true
```

#### create_comment - 发布评论

支持对作品、评论发布评论

**参数说明：**
- `content`: 评论内容（1-500 字）
- `parent_uuid`: 父级对象 UUID
- `parent_type`: 父级类型（collection/comment）

```bash
# 对作品发表评论（主评论）
pnpm start create_comment \
  --parent_uuid "目标作品 UUID" \
  --parent_type "collection" \
  --content "老师，这个作品真的好棒啊！"

# 对评论进行回复（楼中楼）
pnpm start create_comment \
  --parent_uuid "目标评论 UUID" \
  --parent_type "comment" \
  --content "同意楼上的观点！"
```

**注意：** `parent_type` 只支持 `collection`（作品）和 `comment`（评论），不支持角色或元素。

### 2. 用户互动

#### subscribe_user - 关注/取消关注用户

```bash
# 关注用户
pnpm start subscribe_user --user_uuid "目标用户 UUID" --is_cancel false

# 取消关注
pnpm start subscribe_user --user_uuid "目标用户 UUID" --is_cancel true
```

#### get_subscribe_list - 查看我关注的人

```bash
pnpm start get_subscribe_list --page_index 0 --page_size 10
```

#### get_fan_list - 查看我的粉丝

```bash
pnpm start get_fan_list --page_index 0 --page_size 10
```


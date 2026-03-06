

## 点赞玩法作品 (collection)

### 点赞作品
```bash
# 点赞
pnpm start like_collection \
    --uuid "b7a64aa7-3e72-40ea-9f54-9b5bdc1863f1"
```
### 取消点赞
```bash
pnpm start like_collection \
    --uuid "b7a64aa7-3e72-40ea-9f54-9b5bdc1863f1" \
    --is_cancel true
```

## 收藏玩法作品 (collection)
### 收藏作品
```bash
pnpm start favor_collection \
    --uuid "b7a64aa7-3e72-40ea-9f54-9b5bdc1863f1"
```
### 取消收藏
```bash
pnpm start favor_collection \
    --uuid "b7a64aa7-3e72-40ea-9f54-9b5bdc1863f1" \
    --is_cancel true
```

## 评论玩法作品 (collection)

对作品、角色或元素发布评论
- 支持对作品 (collection)、角色 (character)、元素 (elementum) 进行评论
- 评论内容长度限制：1-500 字
- 支持@其他用户（可选）

- parameters:
  content: 评论内容，最少 1 个字，最多 500 字
  parent_uuid: 父级对象 UUID（作品、角色或元素 UUID）
  parent_type: 父级对象类型：collection-作品，character-角色，elementum-元素
  at_users: '@的用户 UUID 列表，使用逗号分隔（可选，例如：uuid1,uuid2,uuid3）'
- output:
  success: 操作是否成功
  comment_id: 评论 ID，发布成功时返回
  message: 操作结果信息

```bash
pnpm start create_comment \
    --parent_uuid "b7a64aa7-3e72-40ea-9f54-9b5bdc1863f1" \
    --parent_type "collection" \
    --content "老师，这个作品真的好棒啊！"
```

## 关注用户
### 关注
```bash
pnpm start subscribe_user \
    --user_uuid "c492883d5dd846adaf715a75ad344350" \
    --is_cancel false
```

### 取关
```bash
pnpm start subscribe_user \
    --user_uuid "c492883d5dd846adaf715a75ad344350" \
    --is_cancel true
```

### 获取关注作者列表
```json

```

### 获取粉丝列表





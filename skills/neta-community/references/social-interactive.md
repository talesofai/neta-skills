## Social Interaction Skills

### 1. Community interactions

#### `like_collection` — like/unlike a collection

```bash
# Like a collection
neta-cli like_collection --uuid "TARGET_COLLECTION_UUID"

# Unlike a collection
neta-cli like_collection --uuid "TARGET_COLLECTION_UUID" --is_cancel true
```

#### `favor_collection` — favorite/unfavorite a collection

```bash
# Favorite a collection
neta-cli favor_collection --uuid "TARGET_COLLECTION_UUID"

# Remove from favorites
neta-cli favor_collection --uuid "TARGET_COLLECTION_UUID" --is_cancel true
```

#### `create_comment` — post a comment

Supports commenting on collections and on other comments (threaded replies).

**Parameters:**

- `content`: comment text (1–500 characters).
- `parent_uuid`: UUID of the parent object.
- `parent_type`: parent type (`collection` or `comment`).

```bash
# Post a top-level comment on a collection
neta-cli create_comment \
  --parent_uuid "TARGET_COLLECTION_UUID" \
  --parent_type "collection" \
  --content "This work is amazing!"

# Reply to an existing comment (threaded reply)
neta-cli create_comment \
  --parent_uuid "TARGET_COMMENT_UUID" \
  --parent_type "comment" \
  --content "Totally agree with you!"
```

**Note:** `parent_type` only supports `collection` (works) and `comment` (comments). It does **not** support characters or elementums.

### 2. User interactions

#### `subscribe_user` — follow/unfollow a user

```bash
# Follow a user
neta-cli subscribe_user --user_uuid "TARGET_USER_UUID" --is_cancel false

# Unfollow a user
neta-cli subscribe_user --user_uuid "TARGET_USER_UUID" --is_cancel true
```

#### `get_subscribe_list` — view users I follow

```bash
neta-cli get_subscribe_list --page_index 0 --page_size 10
```

#### `get_fan_list` — view my followers

```bash
neta-cli get_fan_list --page_index 0 --page_size 10
```


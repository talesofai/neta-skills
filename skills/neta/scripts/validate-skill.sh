#!/bin/bash

# Skill Validation Script
# 用于验证 SKILL.md 的 frontmatter 是否能正确触发技能

set -e

SKILL_FILE="SKILL.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Neta Skill Validation ==="
echo ""

# 检查 SKILL.md 是否存在
if [ ! -f "$SCRIPT_DIR/../$SKILL_FILE" ]; then
    echo "❌ Error: $SKILL_FILE not found"
    exit 1
fi

echo "✓ Found $SKILL_FILE"

# 提取 frontmatter
echo ""
echo "=== Frontmatter ==="
head -5 "$SCRIPT_DIR/../$SKILL_FILE"

# 检查 name 字段
NAME=$(grep "^name:" "$SCRIPT_DIR/../$SKILL_FILE" | cut -d' ' -f2 || true)
if [ -z "$NAME" ]; then
    echo "❌ Name field is missing"
    exit 1
fi
echo ""
echo "=== Validation Checks ==="

# 检查 name 格式 (1-64 字符，小写字母、数字、连字符)
if [[ $NAME =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] && [ ${#NAME} -le 64 ] && [ ${#NAME} -ge 1 ]; then
    echo "✓ Name format valid: $NAME"
else
    echo "❌ Name format invalid: $NAME"
    echo "   Must be 1-64 chars, lowercase letters, numbers, hyphens only"
    exit 1
fi

# 检查 name 与目录名匹配
DIR_NAME="$(basename "$(cd "$SCRIPT_DIR/.." && pwd)")"
if [ "$NAME" = "$DIR_NAME" ]; then
    echo "✓ Name matches directory: $DIR_NAME"
else
    echo "❌ Name '$NAME' does not match directory '$DIR_NAME'"
    exit 1
fi

# 检查 description 字段
DESC=$(grep "^description:" "$SCRIPT_DIR/../$SKILL_FILE" | cut -d':' -f2- || true)
if [ -z "$DESC" ]; then
    echo "❌ Description is empty"
    exit 1
fi
DESC_LENGTH=${#DESC}
if [ $DESC_LENGTH -le 1024 ]; then
    echo "✓ Description length valid: $DESC_LENGTH chars"
else
    echo "❌ Description too long: $DESC_LENGTH chars (max 1024)"
    exit 1
fi

# 检查 frontmatter 只包含标准字段 (name, description)
echo ""
echo "=== Frontmatter Fields ==="
FM_FIELDS=$(sed -n '2,/^---$/p' "$SCRIPT_DIR/../$SKILL_FILE" | grep -v "^---$" | cut -d':' -f1 | sort)
EXPECTED_FIELDS=$'description\nname'
# Compare by removing all whitespace for reliable comparison
FM_FIELDS_COMPACT=$(echo "$FM_FIELDS" | tr -d '\n ')
EXPECTED_FIELDS_COMPACT=$(echo "$EXPECTED_FIELDS" | tr -d '\n ')
if [ "$FM_FIELDS_COMPACT" = "$EXPECTED_FIELDS_COMPACT" ]; then
    echo "✓ Frontmatter contains only standard fields (name, description)"
else
    echo "⚠ Frontmatter contains non-standard fields:"
    echo "   Found: $(echo "$FM_FIELDS" | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')"
    echo "   Standard fields: name, description"
    echo "   Note: Non-standard fields are ignored by agents during triggering"
fi

# 检查是否包含负面触发器
if echo "$DESC" | grep -qi "不用于\|not for\|don't use\|exclude"; then
    echo "✓ Description includes negative triggers"
else
    echo "⚠ Description may benefit from negative triggers"
fi

# 检查 SKILL.md 行数
LINE_COUNT=$(wc -l < "$SCRIPT_DIR/../$SKILL_FILE")
if [ $LINE_COUNT -le 500 ]; then
    echo "✓ SKILL.md line count valid: $LINE_COUNT lines"
else
    echo "⚠ SKILL.md exceeds 500 lines: $LINE_COUNT lines"
fi

# 检查 references 目录
if [ -d "$SCRIPT_DIR/../references" ]; then
    REF_COUNT=$(find "$SCRIPT_DIR/../references" -type f -name "*.md" | wc -l)
    echo "✓ References directory found: $REF_COUNT files"
    
    # 检查引用深度（应为一层）
    DEEP_REFS=$(find "$SCRIPT_DIR/../references" -mindepth 2 -type f -name "*.md" | wc -l)
    if [ $DEEP_REFS -eq 0 ]; then
        echo "✓ References are flat (one level deep)"
    else
        echo "⚠ References have nested directories: $DEEP_REFS files"
    fi
else
    echo "⚠ References directory not found"
fi

# 检查 assets 目录
if [ -d "$SCRIPT_DIR/../assets" ]; then
    ASSET_COUNT=$(find "$SCRIPT_DIR/../assets" -type f | wc -l)
    echo "✓ Assets directory found: $ASSET_COUNT files"
else
    echo "⚠ Assets directory not found"
fi

echo ""
echo "=== Validation Complete ==="
echo ""

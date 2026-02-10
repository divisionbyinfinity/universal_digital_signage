#!/bin/bash

# =============================================
# Universal Digital Signage Backup Script
# =============================================
# Usage:
#   bash backup_signage.sh <mongo_user> <mongo_pass> <cdn_source_path> <backup_target_dir>
# Example:
#   bash backup_signage.sh root root /usr/share/nginx/your-domain.com/universal_signage ./new_backup
# =============================================

# --- Arguments ---
MONGO_USER="$1"
MONGO_PASS="$2"
CDN_SRC="$3"
TARGET_DIR="$4"

# --- Timestamp for backup files ---
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# --- Validate arguments ---
if [ -z "$MONGO_USER" ] || [ -z "$MONGO_PASS" ] || [ -z "$CDN_SRC" ] || [ -z "$TARGET_DIR" ]; then
    echo "Usage: bash $0 <mongo_user> <mongo_pass> <cdn_source_path> <backup_target_dir>"
    exit 1
fi

# --- Create backup directories ---
mkdir -p "$TARGET_DIR/mongodb"
mkdir -p "$TARGET_DIR/cdn"

echo "Backup target directories created:"
echo "  MongoDB: $TARGET_DIR/mongodb"
echo "  CDN: $TARGET_DIR/cdn"
echo ""

# --- MongoDB Backup ---
echo "Backing up MongoDB..."
docker exec -i mongodb \
    mongodump --db signage -u "$MONGO_USER" -p "$MONGO_PASS" \
    --authenticationDatabase admin --out /dump

# Copy dump to host
docker cp mongodb:/dump "$TARGET_DIR/mongodb"

# Compress MongoDB backup
cd "$TARGET_DIR/mongodb" || exit
zip -r "signage_backup_${TIMESTAMP}.zip" dump

echo "MongoDB backup completed:"
echo "  Uncompressed: $TARGET_DIR/mongodb/dump"
echo "  Compressed: $TARGET_DIR/mongodb/signage_backup_${TIMESTAMP}.zip"
echo ""

# --- CDN Backup ---
echo "Backing up CDN files from $CDN_SRC..."

# Ensure target directory exists

mkdir -p "$TARGET_DIR/cdn"
cd "$TARGET_DIR/cdn" || exit
# Copy CDN files
cp -r "$CDN_SRC"/* "$TARGET_DIR/cdn/"

# Compress CDN backup
cd "$TARGET_DIR/cdn" || exit
zip -r "cdn_backup_${TIMESTAMP}.zip" ./*

echo "CDN backup completed:"
echo "  Uncompressed: $TARGET_DIR/cdn"
echo "  Compressed: $TARGET_DIR/cdn/cdn_backup_${TIMESTAMP}.zip"
echo ""

echo "Backup finished successfully!"
echo "MongoDB backup: $TARGET_DIR/mongodb/signage_backup_${TIMESTAMP}.zip"
echo "CDN backup: $TARGET_DIR/cdn/cdn_backup_${TIMESTAMP}.zip"
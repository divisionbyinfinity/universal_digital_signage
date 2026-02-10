#!/bin/bash

# =============================================
# Universal Digital Signage Restore Script
# Production Safe Version
# =============================================
# Usage:
#   sudo bash restore_signage.sh <mongo_user> <mongo_pass> \
#        <mongodb_zip_path> <cdn_zip_path> <cdn_target_path>
#
# Example:
#   sudo bash restore_signage.sh root root \
#       ./new_backup/mongodb/signage_backup_20260210_120000.zip \
#       ./new_backup/cdn/cdn_backup_20260210_120000.zip \
#       /usr/share/nginx/your-domain.com/universal_signage
# =============================================

set -e

# ---------- Root Check ----------
if [ "$EUID" -ne 0 ]; then
  echo "ERROR: Please run this script as root (use sudo)."
  exit 1
fi

# ---------- Arguments ----------
MONGO_USER="$1"
MONGO_PASS="$2"
MONGO_ZIP="$3"
CDN_ZIP="$4"
CDN_TARGET="$5"

# ---------- Validate arguments ----------
if [ -z "$MONGO_USER" ] || [ -z "$MONGO_PASS" ] || \
   [ -z "$MONGO_ZIP" ] || [ -z "$CDN_ZIP" ] || \
   [ -z "$CDN_TARGET" ]; then
    echo "Usage: sudo bash $0 <mongo_user> <mongo_pass> <mongodb_zip> <cdn_zip> <cdn_target_path>"
    exit 1
fi

# ---------- Validate backup files ----------
if [ ! -f "$MONGO_ZIP" ]; then
    echo "ERROR: MongoDB backup file not found: $MONGO_ZIP"
    exit 1
fi

if [ ! -f "$CDN_ZIP" ]; then
    echo "ERROR: CDN backup file not found: $CDN_ZIP"
    exit 1
fi

echo "========================================="
echo " Starting Universal Signage Restore"
echo "========================================="
echo ""

# =============================================
# MongoDB Restore
# =============================================

echo "Checking MongoDB container..."

if ! docker ps --format '{{.Names}}' | grep -q "^mongodb$"; then
    echo "ERROR: MongoDB container 'mongodb' is not running."
    exit 1
fi

echo "Restoring MongoDB..."

TMP_MONGO_DIR="/tmp/mongo_restore_$(date +%s)"
mkdir -p "$TMP_MONGO_DIR"

# Unzip Mongo backup
unzip -oq "$MONGO_ZIP" -d "$TMP_MONGO_DIR"

# Validate dump exists
if [ ! -d "$TMP_MONGO_DIR/dump/signage" ]; then
    echo "ERROR: Invalid MongoDB backup structure."
    exit 1
fi

# Copy dump into container
docker cp "$TMP_MONGO_DIR/dump" mongodb:/dump_restore

# Restore database (drop existing signage DB)
docker exec -i mongodb \
    mongorestore --db signage \
    -u "$MONGO_USER" -p "$MONGO_PASS" \
    --authenticationDatabase admin \
    --drop /dump_restore/signage

echo "MongoDB restore completed successfully."
echo ""

# Cleanup temp
rm -rf "$TMP_MONGO_DIR"

# =============================================
# CDN Restore
# =============================================

echo "Restoring CDN files..."

if [ ! -d "$CDN_TARGET" ]; then
    echo "ERROR: CDN target directory does not exist: $CDN_TARGET"
    exit 1
fi

PARENT_DIR=$(dirname "$CDN_TARGET")
BASE_NAME=$(basename "$CDN_TARGET")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

BACKUP_OLD="${PARENT_DIR}/${BASE_NAME}_old_${TIMESTAMP}"

echo "Backing up existing CDN folder to:"
echo "  $BACKUP_OLD"

# Move old folder to sibling location
mv "$CDN_TARGET" "$BACKUP_OLD"

# Create fresh directory
mkdir -p "$CDN_TARGET"

# Restore new files (non-interactive)
unzip -oq "$CDN_ZIP" -d "$CDN_TARGET"

echo "CDN restore completed successfully."
echo ""

# =============================================
# Final Status
# =============================================

echo "========================================="
echo " Restore Completed Successfully"
echo "========================================="
echo "MongoDB restored from: $MONGO_ZIP"
echo "CDN restored from:      $CDN_ZIP"
echo "Old CDN backup saved:   $BACKUP_OLD"
echo ""
echo "System is now restored."
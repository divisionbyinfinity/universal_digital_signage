# Universal Digital Signage — Backup & Restore Guide

This guide provides step-by-step instructions to **backup, migrate, and restore** your Universal Digital Signage (UDS) system, including the **MongoDB database** and **CDN files**, using the provided scripts:

- [`backup_signage.sh`](#backup-script)
- [`restore_signage.sh`](#restore-script)

> ⚠️ Always ensure the server is **offline** or in maintenance mode during migration to prevent data loss.

---

## 1. Pre-Migration Preparation

1. **Stop the system** to prevent new data from being written:

```bash
docker compose down backend
```

2. **Verify server state**:

```bash
docker ps          # check running containers
```

3. **Create a backup directory** for temporary storage:

```bash
mkdir -p ~/signage-backup/mongodb
mkdir -p ~/signage-backup/cdn
```

---

## 2. Backup Script

The `backup_signage.sh` script automates MongoDB and CDN backups.

### Usage:
```bash
bash backup_signage.sh <mongo_user> <mongo_pass> <cdn_source_path> <backup_target_dir>
```

- `<mongo_user>` — MongoDB username
- `<mongo_pass>` — MongoDB password
- `<cdn_source_path>` — **Absolute path** to CDN files (mandatory!)
- `<backup_target_dir>` — Directory where backups will be stored

### Example:
```bash
bash backup_signage.sh root root /usr/share/nginx/<your domain>/universal_signage ~/signage-backup
```

> The script will create compressed backups for both MongoDB and CDN.

---

## 3. Restore Script

The `restore_signage.sh` script restores backups safely.

### Usage:
```bash
sudo bash restore_signage.sh <mongo_user> <mongo_pass> <mongodb_zip_path> <cdn_zip_path> <cdn_target_path>
```

- `<mongo_user>` — MongoDB username
- `<mongo_pass>` — MongoDB password
- `<mongodb_zip_path>` — Path to MongoDB backup zip
- `<cdn_zip_path>` — Path to CDN backup zip
- `<cdn_target_path>` — **Absolute path** to CDN directory (mandatory!)

### Example:
```bash
sudo bash restore_signage.sh root root \
~/signage-backup/mongodb/signage_backup_20260210_120000.zip \
~/signage-backup/cdn/cdn_backup_20260210_120000.zip \
/usr/share/nginx/<your cdn domain>/universal_signage
```

> The script will backup the existing CDN folder with a timestamp before restoring the new content.

---

## 4. Migration Steps

1. **Copy backups to the new server** (use `scp` or similar):

```bash
scp ~/signage-backup/mongodb/*.zip user@newserver:~/signage-backup/mongodb/
scp ~/signage-backup/cdn/*.zip user@newserver:~/signage-backup/cdn/
```

2. **Run restore on the new server** using the `restore_signage.sh` script (see usage above).

3. **Restart services**:

```bash
# Restart Docker stack
cd /path/to/uds_project
docker compose up --build -d

# Or start nginx
sudo systemctl start nginx
```

4. **Verify**:
- Check MongoDB database entries.
- Open UDS in browser.
- Confirm CDN images/videos load correctly.

---

## 5. Notes / Best Practices

- Always take backups **before migration**.
- Use **compressed backups** for faster transfer.
- Ensure **file permissions** match the original (CDN: `nginx:nginx` for example).
- SELinux may block files, check with `getenforce` and adjust policies if needed:

```bash
# Check SELinux status
getenforce

# Restore default SELinux context on files
sudo restorecon -R /usr/share/nginx/<your domain>/universal_signage
```
- Test on a staging server before production migration.
- **Always use absolute paths** for CDN source and target to avoid errors.
- Scripts require proper permissions: `backup_signage.sh` can be run as normal user, `restore_signage.sh` should be run with `sudo`.


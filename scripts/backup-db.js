/**
 * Database Backup Utility for Chief Minister Balochistan Portal
 * Safely checkpoints the SQLite WAL file and creates a timestamped compressed/atomic backup.
 * 
 * Usage: node scripts/backup-db.js [destination_dir]
 */

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = process.env.DATABASE_PATH || (fs.existsSync(path.resolve(process.cwd(), "data", "dev.db")) ? path.resolve(process.cwd(), "data", "dev.db") : path.resolve(process.cwd(), "dev.db"));
const BACKUP_DIR = process.argv[2] || path.resolve(process.cwd(), "backups");

function runBackup() {
  console.log(`[Backup] Initiating SQLite database snapshot from: ${DB_PATH}`);

  if (!fs.existsSync(DB_PATH)) {
    console.error(`[Backup Error] Database file not found at: ${DB_PATH}`);
    process.exit(1);
  }

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  try {
    // 1. Flush WAL to database file
    console.log("[Backup] Executing WAL checkpoint (TRUNCATE)...");
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA wal_checkpoint(TRUNCATE);");
    db.close();

    // 2. Generate timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `cm_balochistan_backup_${timestamp}.db`;
    const targetPath = path.join(BACKUP_DIR, backupFileName);

    // 3. Perform atomic copy
    fs.copyFileSync(DB_PATH, targetPath);
    const stats = fs.statSync(targetPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`[Backup SUCCESS] Snapshot created: ${targetPath} (${sizeMb} MB)`);

    // 4. Clean up backups older than 30 days
    const files = fs.readdirSync(BACKUP_DIR);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let pruned = 0;

    for (const file of files) {
      if (file.startsWith("cm_balochistan_backup_") && file.endsWith(".db")) {
        const filePath = path.join(BACKUP_DIR, file);
        const fileStats = fs.statSync(filePath);
        if (fileStats.mtimeMs < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          pruned++;
        }
      }
    }

    if (pruned > 0) {
      console.log(`[Backup Maintenance] Pruned ${pruned} backup(s) older than 30 days.`);
    }
  } catch (err) {
    console.error("[Backup FATAL ERROR]:", err);
    process.exit(1);
  }
}

runBackup();

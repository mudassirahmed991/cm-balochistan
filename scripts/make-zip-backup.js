const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

console.log('=== Starting Website ZIP Backup Creation ===');

const projectDir = path.resolve(__dirname, '..');
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;

const zipName = `CM_WEBSITE_Backup_${dateStr}.zip`;
const standardZipName = 'CM_WEBSITE_Backup.zip';

const targetZipPath = path.join('D:\\', zipName);
const standardZipPath = path.join('D:\\', standardZipName);
const stagingDir = path.join('D:\\', 'temp_cm_backup_staging');

console.log('Source Directory:', projectDir);
console.log('Target ZIP File:', targetZipPath);

// Excluded folder & file names
const EXCLUDED_DIRS = new Set(['node_modules', '.next', '.git', 'temp_cm_backup_staging', 'backups']);
const EXCLUDED_FILES = new Set(['dev.db-shm', 'dev.db-wal', 'dev.db-journal', zipName, standardZipName]);

// Clean staging directory if already exists
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name) || entry.name.endsWith('.log')) continue;
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.warn(`[Warning] Could not copy ${srcPath}: ${err.message}`);
      }
    }
  }
}

console.log('Copying files to staging directory (excluding node_modules and .next)...');
copyRecursive(projectDir, stagingDir);
console.log('[OK] Files copied to staging.');

// Remove existing zip if any
if (fs.existsSync(targetZipPath)) fs.unlinkSync(targetZipPath);
if (fs.existsSync(standardZipPath)) fs.unlinkSync(standardZipPath);

console.log('Creating ZIP archive with tar.exe...');
const cmd = `tar.exe -a -cf "${targetZipPath}" *`;
execSync(cmd, { cwd: stagingDir, stdio: 'inherit' });

// Clean up staging folder
fs.rmSync(stagingDir, { recursive: true, force: true });
console.log('[OK] Staging directory cleaned up.');

if (fs.existsSync(targetZipPath)) {
  const stat = fs.statSync(targetZipPath);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Backup ZIP created successfully!`);
  console.log(`1. Timestamped File: ${targetZipPath} (${sizeMb} MB)`);

  // Also make standard name copy D:\CM_WEBSITE_Backup.zip
  fs.copyFileSync(targetZipPath, standardZipPath);
  console.log(`2. Main Copy:        ${standardZipPath} (${sizeMb} MB)`);
} else {
  console.error('ERROR: Zip file was not created!');
  process.exit(1);
}

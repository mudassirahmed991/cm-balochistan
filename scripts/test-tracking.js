const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('dev.db');
const cleanCode = 'CMB-2026-1001';
const stmt = db.prepare('SELECT * FROM Complaint WHERE trackingCode = ? LIMIT 1');
const complaint = stmt.get(cleanCode);
console.log('Result for CMB-2026-1001:', complaint);

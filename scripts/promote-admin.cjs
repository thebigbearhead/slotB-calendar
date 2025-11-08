#!/usr/bin/env node
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const identifier = process.argv[2];

if (!identifier) {
  console.error('Usage: node scripts/promote-admin.cjs <username-or-email>');
  process.exit(1);
}

const resolveDbPath = () => {
  const envPath = process.env.DATABASE_PATH;
  if (envPath) {
    return path.resolve(envPath);
  }
  return path.join(__dirname, '../server/slotb.db');
};

const dbPath = resolveDbPath();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Unable to open database:', err.message);
    process.exit(1);
  }
});

const promoteSql = `
  UPDATE users
  SET role = 'admin'
  WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
`;

db.run(promoteSql, [identifier, identifier], function(err) {
  if (err) {
    console.error('Failed to update user:', err.message);
    process.exit(1);
  }

  if (this.changes === 0) {
    console.error(`No user found with username/email "${identifier}".`);
    process.exit(1);
  }

  console.log(`User "${identifier}" promoted to admin.`);
  db.close();
});

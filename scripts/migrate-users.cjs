#!/usr/bin/env node
const path = require('path');
const Database = require('../server/database.cjs');

if (process.env.DATABASE_PATH) {
  console.log(`Using database at ${path.resolve(process.env.DATABASE_PATH)}`);
}

const db = new Database();

const finish = () => {
  console.log('Ensured user columns exist.');
  db.close();
  process.exit(0);
};

setTimeout(finish, 1500);

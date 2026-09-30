// ============================================================
//  PROG2002 Assessment 2 — event_db.js
//  MySQL connection for the charity events website.
//  Uses a connection pool; credentials come from environment
//  variables (with local-dev defaults) so the file is safe to
//  commit to GitHub.
// ============================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Query helper — returns rows for a SELECT.
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query };

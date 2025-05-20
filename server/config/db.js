// /server/config/db.js
const mysql = require('mysql2/promise'); // 使用 promise 版本
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'xiaofendui',
  password: process.env.DB_PASS || 'qwer1234',
  database: process.env.DB_NAME || 'character_rating_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
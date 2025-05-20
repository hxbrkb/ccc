// test-db.js
const pool = require('./server/config/db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('数据库连接成功! 测试结果:', rows[0].solution);
  } catch (error) {
    console.error('数据库连接失败:', error);
  } finally {
    pool.end(); // 关闭连接池
  }
}

testConnection();
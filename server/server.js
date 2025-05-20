require('dotenv').config(); // 必须放在最顶部
const express = require('express');
const cors = require('cors');
const path = require('path');
const charactersRouter = require('./routes/characters');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server running`);
});

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client')));

// API路由
app.use('/api/characters', charactersRouter);

// 前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
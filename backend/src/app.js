import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';
import graphRoutes from './routes/graph.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 基础路由
app.get('/', (req, res) => {
  res.json({
    message: '🏥 灵枢AI后端服务正在运行！',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      chat: '/api/chat'
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: '灵枢AI后端',
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api/chat', chatRoutes);

app.use('/api/graph', graphRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : error.message,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在端口 ${PORT}`);
  console.log(`🌍 前端地址: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 API文档: http://localhost:${PORT}`);
  console.log(`❤️  健康检查: http://localhost:${PORT}/api/health`);
});

export default app;

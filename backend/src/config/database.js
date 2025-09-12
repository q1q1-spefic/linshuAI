import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// MongoDB连接配置
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // 最大连接池大小
  serverSelectionTimeoutMS: 5000, // 服务器选择超时
  socketTimeoutMS: 45000, // Socket超时
  family: 4, // 使用IPv4
  bufferCommands: false,
  bufferMaxEntries: 0
};

// 连接状态跟踪
let isConnected = false;

/**
 * 连接MongoDB数据库
 */
export const connectDB = async () => {
  try {
    if (isConnected) {
      logger.info('📊 MongoDB已连接，跳过重复连接');
      return;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lingsu_ai';
    
    logger.info(`📊 正在连接MongoDB: ${mongoURI.replace(/\/\/.*@/, '//*****@')}`);
    
    await mongoose.connect(mongoURI, mongoConfig);
    
    isConnected = true;
    logger.info('📊 MongoDB连接成功');
    
  } catch (error) {
    logger.error('❌ MongoDB连接失败:', error);
    process.exit(1);
  }
};

/**
 * 断开数据库连接
 */
export const disconnectDB = async () => {
  try {
    if (!isConnected) {
      return;
    }
    
    await mongoose.disconnect();
    isConnected = false;
    logger.info('📊 MongoDB连接已断开');
    
  } catch (error) {
    logger.error('❌ MongoDB断开连接失败:', error);
  }
};

// 监听连接事件
mongoose.connection.on('connected', () => {
  logger.info('📊 Mongoose连接已建立');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  logger.error('❌ Mongoose连接错误:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ Mongoose连接已断开');
  isConnected = false;
});

// 优雅关闭处理
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('📊 MongoDB连接已通过SIGINT关闭');
    process.exit(0);
  } catch (error) {
    logger.error('❌ MongoDB关闭过程中出错:', error);
    process.exit(1);
  }
});

// 导出连接状态检查函数
export const isDBConnected = () => isConnected;

// 健康检查函数
export const checkDBHealth = async () => {
  try {
    if (!isConnected) {
      return { status: 'disconnected', message: '数据库未连接' };
    }
    
    // 简单的ping测试
    await mongoose.connection.db.admin().ping();
    
    return { 
      status: 'healthy', 
      message: '数据库连接正常',
      details: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    };
    
  } catch (error) {
    logger.error('❌ 数据库健康检查失败:', error);
    return { 
      status: 'unhealthy', 
      message: '数据库健康检查失败',
      error: error.message 
    };
  }
};

export default {
  connectDB,
  disconnectDB,
  isDBConnected,
  checkDBHealth
};
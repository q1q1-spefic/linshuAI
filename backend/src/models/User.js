import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// 学习档案子模式
const LearningProfileSchema = new Schema({
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  interests: [{
    type: String,
    trim: true
  }],
  weakAreas: [{
    type: String,
    trim: true
  }],
  strengths: [{
    type: String,
    trim: true
  }],
  goals: [{
    target: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  recentActivity: [{
    type: {
      type: String,
      enum: ['question', 'study', 'review', 'test']
    },
    topic: String,
    difficulty: String,
    timestamp: Date,
    confidence: Number,
    timeSpent: Number // 分钟
  }],
  learningStyle: {
    visual: { type: Number, min: 0, max: 10, default: 5 },
    auditory: { type: Number, min: 0, max: 10, default: 5 },
    kinesthetic: { type: Number, min: 0, max: 10, default: 5 },
    readingWriting: { type: Number, min: 0, max: 10, default: 5 }
  },
  lastAssessment: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// 用户统计子模式
const UserStatsSchema = new Schema({
  totalMessages: {
    type: Number,
    default: 0
  },
  totalConversations: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number,
    default: 0 // 分钟
  },
  loginCount: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastLoginDate: Date,
  achievementsUnlocked: [{
    id: String,
    name: String,
    description: String,
    unlockedAt: Date
  }],
  weeklyGoal: {
    target: { type: Number, default: 300 }, // 分钟
    achieved: { type: Number, default: 0 },
    week: String // YYYY-WW格式
  }
}, { _id: false });

// 用户偏好设置子模式
const UserPreferencesSchema = new Schema({
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  language: {
    type: String,
    enum: ['zh-CN', 'en-US'],
    default: 'zh-CN'
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    studyReminders: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true }
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'private'
    },
    shareProgress: { type: Boolean, default: false },
    dataCollection: { type: Boolean, default: true }
  },
  ui: {
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    graphAnimation: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true }
  }
}, { _id: false });

// 主用户模式
const UserSchema = new Schema({
  // 基本信息
  username: {
    type: String,
    required: [true, '用户名是必需的'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [30, '用户名最多30个字符'],
    match: [/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文']
  },
  email: {
    type: String,
    required: [true, '邮箱是必需的'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码是必需的'],
    minlength: [6, '密码至少6个字符'],
    select: false // 默认不返回密码字段
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, '姓名最多50个字符']
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, '简介最多500个字符'],
    trim: true
  },
  
  // 账户状态
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  
  // 学习相关
  learningProfile: LearningProfileSchema,
  
  // 统计数据
  stats: UserStatsSchema,
  
  // 用户偏好
  preferences: UserPreferencesSchema,
  
  // 订阅信息
  subscription: {
    type: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: false },
    features: [{
      name: String,
      enabled: Boolean
    }]
  },
  
  // 时间戳
  lastActive: {
    type: Date,
    default: Date.now
  },
  lastLoginIP: String,
  
  // 验证和重置令牌
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // 社交功能
  friends: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 标签和分类
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ 'learningProfile.level': 1 });
UserSchema.index({ 'subscription.type': 1 });
UserSchema.index({ tags: 1 });

// 虚拟字段
UserSchema.virtual('displayName').get(function() {
  return this.name || this.username;
});

UserSchema.virtual('isOnline').get(function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastActive > fiveMinutesAgo;
});

UserSchema.virtual('membershipDays').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// 密码加密中间件
UserSchema.pre('save', async function(next) {
  // 只在密码被修改时才加密
  if (!this.isModified('password')) return next();
  
  try {
    // 生成盐并加密密码
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 更新lastActive中间件
UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('lastActive')) {
    this.lastActive = new Date();
  }
  next();
});

// 实例方法：验证密码
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('密码比较失败');
  }
};

// 实例方法：生成公开档案
UserSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  
  // 移除敏感信息
  delete user.password;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.lastLoginIP;
  
  // 根据隐私设置过滤信息
  if (user.preferences?.privacy?.profileVisibility === 'private') {
    return {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      membershipDays: this.membershipDays
    };
  }
  
  return user;
};

// 实例方法：更新学习统计
UserSchema.methods.updateLearningStats = function(activity) {
  if (!this.stats) this.stats = {};
  if (!this.learningProfile) this.learningProfile = {};
  
  // 更新总学习时间
  if (activity.timeSpent) {
    this.stats.totalStudyTime = (this.stats.totalStudyTime || 0) + activity.timeSpent;
  }
  
  // 添加最近活动
  if (!this.learningProfile.recentActivity) {
    this.learningProfile.recentActivity = [];
  }
  
  this.learningProfile.recentActivity.push({
    ...activity,
    timestamp: new Date()
  });
  
  // 只保留最近50个活动
  if (this.learningProfile.recentActivity.length > 50) {
    this.learningProfile.recentActivity = this.learningProfile.recentActivity.slice(-50);
  }
  
  this.learningProfile.lastUpdated = new Date();
};

// 静态方法：查找活跃用户
UserSchema.statics.findActiveUsers = function(days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    lastActive: { $gte: cutoffDate },
    isActive: true
  }).select('username name avatar lastActive stats.totalStudyTime');
};

// 静态方法：获取学习排行榜
UserSchema.statics.getLeaderboard = function(type = 'studyTime', limit = 10) {
  const sortField = type === 'studyTime' ? 'stats.totalStudyTime' : 'stats.totalMessages';
  
  return this.find({ isActive: true })
    .select('username name avatar stats')
    .sort({ [sortField]: -1 })
    .limit(limit);
};

// 导出模型
export const User = mongoose.model('User', UserSchema);
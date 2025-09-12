import mongoose from 'mongoose';

const { Schema } = mongoose;

// 消息子模式
const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [10000, '消息内容不能超过10000字符']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    // AI响应的元数据
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    sources: [{
      title: String,
      source: String,
      type: String,
      url: String
    }],
    relatedConcepts: [{
      name: String,
      relevance: Number,
      type: String
    }],
    processingTime: Number, // 毫秒
    model: String,
    
    // 用户消息的元数据
    userAgent: String,
    ip: String,
    location: {
      country: String,
      city: String
    },
    
    // 消息状态
    isEdited: { type: Boolean, default: false },
    editHistory: [{
      content: String,
      editedAt: Date
    }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    
    // 用户反馈
    feedback: {
      helpful: Boolean,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      feedbackAt: Date
    }
  }
}, { _id: true });

// 对话上下文子模式
const ConversationContextSchema = new Schema({
  // 学习上下文
  currentTopic: String,
  learningObjectives: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  
  // 知识图谱上下文
  focusedConcepts: [{
    name: String,
    type: String,
    relevance: Number
  }],
  exploredPaths: [{
    from: String,
    to: String,
    relationship: String,
    exploredAt: Date
  }],
  
  // 用户状态
  userMood: {
    type: String,
    enum: ['curious', 'confused', 'frustrated', 'engaged', 'satisfied']
  },
  comprehensionLevel: {
    type: Number,
    min: 0,
    max: 1
  },
  
  // 会话模式
  mode: {
    type: String,
    enum: ['chat', 'study', 'test', 'explore'],
    default: 'chat'
  }
}, { _id: false });

// 对话分析子模式
const ConversationAnalysisSchema = new Schema({
  // 自动分析结果
  topics: [{
    name: String,
    frequency: Number,
    importance: Number
  }],
  sentiment: {
    overall: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    confidence: Number
  },
  complexity: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  
  // 学习指标
  learningProgress: {
    conceptsIntroduced: [String],
    conceptsMastered: [String],
    skillsImproved: [String],
    knowledgeGaps: [String]
  },
  
  // 质量指标
  responseQuality: {
    averageConfidence: Number,
    sourceCoverage: Number,
    userSatisfaction: Number
  },
  
  // 最后分析时间
  lastAnalyzed: Date,
  analysisVersion: {
    type: String,
    default: '1.0'
  }
}, { _id: false });

// 主对话模式
const ConversationSchema = new Schema({
  // 基本信息
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, '对话标题不能超过200字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, '对话描述不能超过1000字符']
  },
  
  // 消息列表
  messages: [MessageSchema],
  
  // 对话状态
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // 统计信息
  messageCount: {
    type: Number,
    default: 0
  },
  userMessageCount: {
    type: Number,
    default: 0
  },
  assistantMessageCount: {
    type: Number,
    default: 0
  },
  
  // 时间追踪
  startTime: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  totalDuration: {
    type: Number,
    default: 0 // 秒
  },
  
  // 上下文和分析
  context: ConversationContextSchema,
  analysis: ConversationAnalysisSchema,
  
  // 分类和标签
  category: {
    type: String,
    enum: ['theory', 'clinical', 'prescription', 'diagnosis', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // 分享和协作
  sharedWith: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'comment', 'edit'],
      default: 'read'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 评分和反馈
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  userFeedback: {
    overall: String,
    improvements: [String],
    highlights: [String],
    submittedAt: Date
  },
  
  // 元数据
  metadata: {
    version: {
      type: String,
      default: '1.0'
    },
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    features: [{
      name: String,
      enabled: Boolean,
      usedAt: Date
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引优化
ConversationSchema.index({ userId: 1, updatedAt: -1 });
ConversationSchema.index({ userId: 1, status: 1 });
ConversationSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });
ConversationSchema.index({ tags: 1 });
ConversationSchema.index({ category: 1 });
ConversationSchema.index({ 'context.currentTopic': 1 });
ConversationSchema.index({ createdAt: -1 });

// 文本搜索索引
ConversationSchema.index({
  title: 'text',
  description: 'text',
  'messages.content': 'text'
}, {
  weights: {
    title: 10,
    description: 5,
    'messages.content': 1
  }
});

// 虚拟字段
ConversationSchema.virtual('duration').get(function() {
  if (this.messages.length < 2) return 0;
  
  const start = this.messages[0].timestamp;
  const end = this.messages[this.messages.length - 1].timestamp;
  return Math.floor((end - start) / 1000); // 秒
});

ConversationSchema.virtual('averageResponseTime').get(function() {
  if (this.messages.length < 2) return 0;
  
  const responseTimes = [];
  for (let i = 1; i < this.messages.length; i++) {
    if (this.messages[i].role === 'assistant' && this.messages[i-1].role === 'user') {
      const responseTime = this.messages[i].timestamp - this.messages[i-1].timestamp;
      responseTimes.push(responseTime);
    }
  }
  
  if (responseTimes.length === 0) return 0;
  return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 1000; // 秒
});

ConversationSchema.virtual('lastUserMessage').get(function() {
  return this.messages.filter(msg => msg.role === 'user').pop();
});

ConversationSchema.virtual('lastAssistantMessage').get(function() {
  return this.messages.filter(msg => msg.role === 'assistant').pop();
});

// 中间件：更新统计信息
ConversationSchema.pre('save', function(next) {
  // 更新消息计数
  this.messageCount = this.messages.length;
  this.userMessageCount = this.messages.filter(msg => msg.role === 'user').length;
  this.assistantMessageCount = this.messages.filter(msg => msg.role === 'assistant').length;
  
  // 更新最后活动时间
  if (this.messages.length > 0) {
    this.lastActivity = this.messages[this.messages.length - 1].timestamp;
  }
  
  next();
});

// 实例方法：添加消息
ConversationSchema.methods.addMessage = function(role, content, metadata = {}) {
  const message = {
    role,
    content,
    timestamp: new Date(),
    metadata
  };
  
  this.messages.push(message);
  return message;
};

// 实例方法：获取最近的消息
ConversationSchema.methods.getRecentMessages = function(count = 10) {
  return this.messages.slice(-count);
};

// 实例方法：搜索消息
ConversationSchema.methods.searchMessages = function(query) {
  const regex = new RegExp(query, 'i');
  return this.messages.filter(msg => regex.test(msg.content));
};

// 实例方法：获取对话摘要
ConversationSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    messageCount: this.messageCount,
    duration: this.duration,
    lastActivity: this.lastActivity,
    category: this.category,
    tags: this.tags,
    rating: this.rating
  };
};

// 实例方法：分析对话内容
ConversationSchema.methods.analyzeContent = async function() {
  // 这里可以调用AI服务进行内容分析
  // 暂时返回基本分析
  const topics = new Set();
  const concepts = new Set();
  
  this.messages.forEach(msg => {
    if (msg.metadata?.relatedConcepts) {
      msg.metadata.relatedConcepts.forEach(concept => {
        concepts.add(concept.name);
      });
    }
  });
  
  this.analysis = {
    topics: Array.from(topics).map(topic => ({
      name: topic,
      frequency: 1,
      importance: 0.5
    })),
    conceptsIntroduced: Array.from(concepts),
    lastAnalyzed: new Date()
  };
  
  return this.analysis;
};

// 静态方法：按用户和状态查找
ConversationSchema.statics.findByUserAndStatus = function(userId, status = 'active') {
  return this.find({ userId, status })
    .sort({ isPinned: -1, updatedAt: -1 });
};

// 静态方法：搜索对话
ConversationSchema.statics.searchConversations = function(userId, query, options = {}) {
  const {
    category,
    tags,
    dateRange,
    limit = 20,
    skip = 0
  } = options;
  
  const searchQuery = {
    userId,
    status: { $ne: 'deleted' }
  };
  
  // 文本搜索
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // 分类过滤
  if (category) {
    searchQuery.category = category;
  }
  
  // 标签过滤
  if (tags && tags.length > 0) {
    searchQuery.tags = { $in: tags };
  }
  
  // 日期范围过滤
  if (dateRange) {
    searchQuery.createdAt = {};
    if (dateRange.start) {
      searchQuery.createdAt.$gte = new Date(dateRange.start);
    }
    if (dateRange.end) {
      searchQuery.createdAt.$lte = new Date(dateRange.end);
    }
  }
  
  return this.find(searchQuery)
    .select('title description messageCount lastActivity category tags rating')
    .sort({ score: { $meta: 'textScore' }, updatedAt: -1 })
    .limit(limit)
    .skip(skip);
};

// 静态方法：获取用户统计
ConversationSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'active' } },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        totalMessages: { $sum: '$messageCount' },
        averageMessagesPerConversation: { $avg: '$messageCount' },
        totalDuration: { $sum: '$totalDuration' },
        categoryCounts: {
          $push: '$category'
        },
        tagCounts: {
          $push: '$tags'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalConversations: 1,
        totalMessages: 1,
        averageMessagesPerConversation: { $round: ['$averageMessagesPerConversation', 1] },
        totalDuration: 1,
        categoryCounts: 1,
        tagCounts: { $reduce: { input: '$tagCounts', initialValue: [], in: { $concatArrays: ['$value', '$this'] } } }
      }
    }
  ]);
};

// 导出模型
export const Conversation = mongoose.model('Conversation', ConversationSchema);
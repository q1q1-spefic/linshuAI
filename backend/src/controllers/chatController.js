import { aiService } from '../services/aiService.js';
import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';
import logger from '../utils/logger.js';
import { validateChatInput } from '../utils/validators.js';
import { getCachedResponse, setCachedResponse } from '../services/cacheService.js';

/**
 * 发送聊天消息
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;
    const userId = req.user.id;

    // 输入验证
    const validation = validateChatInput({ message, conversationId, context });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    // 查找或创建对话
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: userId
      });
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: '对话不存在'
        });
      }
    } else {
      // 创建新对话
      conversation = new Conversation({
        userId: userId,
        title: message.length > 50 ? message.substring(0, 50) + '...' : message,
        messages: [],
        context: context || {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      metadata: {
        userAgent: req.get('User-Agent'),
        ip: req.ip
      }
    };

    conversation.messages.push(userMessage);

    // 检查缓存（对于常见问题）
    const cacheKey = `chat:${message.toLowerCase().trim()}`;
    let cachedResponse = await getCachedResponse(cacheKey);

    let aiResponse;
    if (cachedResponse && process.env.NODE_ENV === 'production') {
      aiResponse = cachedResponse;
      logger.info(`使用缓存响应: ${cacheKey}`);
    } else {
      // 准备上下文
      const chatContext = {
        conversationHistory: conversation.messages.slice(-10), // 最近10条消息
        userProfile: {
          id: user._id,
          name: user.name,
          learningLevel: user.learningProfile?.level || 'beginner',
          interests: user.learningProfile?.interests || [],
          weakAreas: user.learningProfile?.weakAreas || []
        },
        conversationContext: conversation.context || {}
      };

      // 调用AI服务
      try {
        aiResponse = await aiService.generateResponse(message, chatContext);
        
        // 缓存常见问题的响应
        if (aiResponse.confidence > 0.8) {
          await setCachedResponse(cacheKey, aiResponse, 3600); // 缓存1小时
        }
        
      } catch (aiError) {
        logger.error('AI服务调用失败:', aiError);
        
        // 使用默认响应
        aiResponse = {
          content: '抱歉，我暂时无法处理您的问题。请稍后再试，或者尝试重新表述您的问题。',
          confidence: 0.1,
          sources: [],
          relatedConcepts: [],
          metadata: {
            error: true,
            fallback: true
          }
        };
      }
    }

    // 添加AI响应
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        confidence: aiResponse.confidence,
        sources: aiResponse.sources || [],
        relatedConcepts: aiResponse.relatedConcepts || [],
        processingTime: aiResponse.processingTime,
        model: aiResponse.model || 'default'
      }
    };

    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date();

    // 更新对话统计
    conversation.messageCount = conversation.messages.length;
    conversation.lastActivity = new Date();

    // 保存对话
    await conversation.save();

    // 更新用户统计
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'stats.totalMessages': 1,
        'stats.totalConversations': conversationId ? 0 : 1
      },
      $set: { 
        'lastActive': new Date() 
      }
    });

    // 响应数据
    const responseData = {
      success: true,
      data: {
        conversationId: conversation._id,
        message: assistantMessage,
        relatedConcepts: aiResponse.relatedConcepts || [],
        sources: aiResponse.sources || [],
        confidence: aiResponse.confidence
      }
    };

    res.json(responseData);

    // 异步更新学习档案
    updateLearningProfile(userId, message, aiResponse).catch(error => {
      logger.error('更新学习档案失败:', error);
    });

  } catch (error) {
    logger.error('聊天消息处理失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 获取对话历史
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, search } = req.query;

    const query = { userId };
    
    // 搜索功能
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } }
      ];
    }

    const conversations = await Conversation
      .find(query)
      .select('_id title messageCount lastActivity createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Conversation.countDocuments(query);

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('获取对话列表失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 获取特定对话详情
 */
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      });
    }

    res.json({
      success: true,
      data: conversation
    });

  } catch (error) {
    logger.error('获取对话详情失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 删除对话
 */
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      });
    }

    // 更新用户统计
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'stats.totalConversations': -1,
        'stats.totalMessages': -conversation.messageCount
      }
    });

    res.json({
      success: true,
      message: '对话已删除'
    });

  } catch (error) {
    logger.error('删除对话失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 更新对话标题
 */
export const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '标题不能为空'
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        userId: userId
      },
      {
        title: title.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: '对话不存在'
      });
    }

    res.json({
      success: true,
      data: conversation
    });

  } catch (error) {
    logger.error('更新对话标题失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 获取快速问题建议
 */
export const getQuickQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('learningProfile');

    // 基于用户学习档案生成快速问题
    const questions = await aiService.generateQuickQuestions(user.learningProfile);

    res.json({
      success: true,
      data: {
        questions: questions || [
          "请解释什么是'肝主疏泄'的含义？",
          "麻黄汤和桂枝汤的区别是什么？",
          "中医的'望闻问切'四诊法具体是怎样的？",
          "什么是六经辨证？",
          "请介绍一下脾胃的生理功能"
        ]
      }
    });

  } catch (error) {
    logger.error('获取快速问题失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 异步更新学习档案
 */
async function updateLearningProfile(userId, userMessage, aiResponse) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 分析用户问题类型
    const questionType = await aiService.analyzeQuestionType(userMessage);
    
    // 更新兴趣领域
    if (questionType.topics && questionType.topics.length > 0) {
      const interests = user.learningProfile?.interests || [];
      const newInterests = [...new Set([...interests, ...questionType.topics])];
      
      await User.findByIdAndUpdate(userId, {
        $set: {
          'learningProfile.interests': newInterests,
          'learningProfile.lastUpdated': new Date()
        }
      });
    }

    // 记录学习活动
    const activity = {
      type: 'question',
      topic: questionType.mainTopic,
      difficulty: questionType.difficulty,
      timestamp: new Date(),
      confidence: aiResponse.confidence
    };

    await User.findByIdAndUpdate(userId, {
      $push: {
        'learningProfile.recentActivity': {
          $each: [activity],
          $slice: -50 // 只保留最近50个活动
        }
      }
    });

  } catch (error) {
    logger.error('更新学习档案失败:', error);
  }
}
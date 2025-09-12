import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url, config.data);
    // 添加认证token（如果存在）
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // 不自动跳转登录页，因为现在是开发阶段
    }
    return Promise.reject(error);
  }
);

// 聊天服务类
class ChatService {
  // 发送消息
  async sendMessage(message, conversationId = null) {
    console.log('ChatService.sendMessage 调用:', { message, conversationId });
    
    try {
      const requestData = {
        message,
        conversationId,
        timestamp: new Date().toISOString()
      };
      
      console.log('发送请求数据:', requestData);
      
      const response = await apiClient.post('/api/chat/send', requestData);
      
      console.log('API响应:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 详细的错误处理
      if (error.response) {
        // 服务器返回了错误响应
        console.error('服务器错误响应:', error.response.status, error.response.data);
        throw new Error(`服务器错误: ${error.response.data?.error || '未知错误'}`);
      } else if (error.request) {
        // 请求发出但没有收到响应
        console.error('网络错误:', error.request);
        return this.getMockResponse(message);
      } else {
        // 请求配置错误
        console.error('请求配置错误:', error.message);
        throw new Error(`请求错误: ${error.message}`);
      }
    }
  }

  // 获取对话列表
  async getConversations(page = 1, limit = 20) {
    try {
      const response = await apiClient.get('/api/chat/conversations', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('获取对话列表失败:', error);
      return {
        success: true,
        data: {
          conversations: [],
          pagination: { current: 1, total: 0, pages: 0 }
        }
      };
    }
  }

  // 获取特定对话详情
  async getConversation(conversationId) {
    try {
      const response = await apiClient.get(`/api/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('获取对话详情失败:', error);
      throw error;
    }
  }

  // 删除对话
  async deleteConversation(conversationId) {
    try {
      const response = await apiClient.delete(`/api/chat/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('删除对话失败:', error);
      throw error;
    }
  }

  // 获取快速问题建议
  async getQuickQuestions() {
    try {
      const response = await apiClient.get('/api/chat/quick-questions');
      console.log('快速问题响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取快速问题失败:', error);
      return {
        success: true,
        data: {
          questions: [
            "请解释什么是'肝主疏泄'的含义？",
            "麻黄汤和桂枝汤的区别是什么？",
            "中医的'望闻问切'四诊法具体是怎样的？",
            "什么是六经辨证？",
            "请介绍一下脾胃的生理功能"
          ]
        }
      };
    }
  }

  // 模拟AI响应（当后端不可用时）
  getMockResponse(message) {
    console.log('使用模拟响应:', message);
    
    const responses = this.getMockResponses();
    
    // 简单的关键词匹配
    const lowerMessage = message.toLowerCase();
    
    for (const [keywords, response] of responses) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          success: true,
          data: {
            conversationId: this.generateId(),
            message: {
              role: 'assistant',
              content: response.content,
              timestamp: new Date().toISOString(),
              metadata: {
                confidence: response.confidence,
                sources: response.sources,
                relatedConcepts: response.relatedConcepts,
                model: 'mock',
                isFallback: true
              }
            },
            relatedConcepts: response.relatedConcepts,
            sources: response.sources,
            confidence: response.confidence
          }
        };
      }
    }
    
    // 默认响应
    return {
      success: true,
      data: {
        conversationId: this.generateId(),
        message: {
          role: 'assistant',
          content: `感谢您的问题："${message}"。\n\n由于网络连接问题，我无法访问完整的知识库。建议您：\n\n1. 检查网络连接\n2. 刷新页面重试\n3. 查阅相关中医文献\n\n请稍后再试。`,
          timestamp: new Date().toISOString(),
          metadata: {
            confidence: 0.3,
            sources: [],
            relatedConcepts: [],
            model: 'fallback',
            isFallback: true
          }
        },
        relatedConcepts: [],
        sources: [],
        confidence: 0.3
      }
    };
  }

  // 预定义的模拟响应
  getMockResponses() {
    return [
      [
        ['肝主疏泄', '肝疏泄', '疏泄'],
        {
          content: `肝主疏泄是中医基础理论中的重要概念，指肝脏具有疏通、调畅全身气机的功能。

**主要体现：**
🔹 调节情志：情绪稳定与肝气疏泄相关
🔹 促进消化：助脾胃运化，胆汁分泌  
🔹 调节月经：女性月经与肝疏泄功能相关
🔹 维持气血：推动全身气血正常运行

**临床意义：**
肝疏泄失常常见肝郁气滞，表现为胸胁胀痛、情绪抑郁等。`,
          confidence: 0.85,
          sources: [{ title: '中医基础理论', type: '教材' }],
          relatedConcepts: ['肝郁气滞', '气机调畅', '情志调节']
        }
      ]
    ];
  }

  // 生成随机ID
  generateId() {
    return 'conv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // 检查服务状态
  async checkServiceStatus() {
    try {
      const response = await apiClient.get('/api/health');
      return {
        status: 'connected',
        data: response.data
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message
      };
    }
  }
}

// 导出单例
export const chatService = new ChatService();
export default chatService;

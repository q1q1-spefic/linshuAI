import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// 模拟的中医知识库响应
const tcmResponses = [
  {
    keywords: ['肝主疏泄', '肝疏泄', '疏泄'],
    response: {
      content: `肝主疏泄是中医基础理论中的重要概念，指肝脏具有疏通、调畅全身气机的功能。

**主要体现在以下几个方面：**

🔹 **调节情志**：肝主疏泄与情绪调节密切相关，肝气疏泄正常则情绪稳定，若肝郁气滞则容易出现抑郁、烦躁等情绪问题。

🔹 **促进消化**：肝气疏泄有助于脾胃的运化功能，协助胆汁分泌，促进食物的消化吸收。

🔹 **调节月经**：女性月经的正常来潮与肝主疏泄功能密切相关，肝郁气滞常导致月经不调。

🔹 **维持气血运行**：肝主疏泄能够推动全身气血的正常运行，防止气滞血瘀。

**临床意义：**
当肝疏泄功能失常时，常见肝郁气滞证，表现为胸胁胀痛、善太息、情绪抑郁等症状。治疗多采用疏肝理气的方法。`,
      confidence: 0.85,
      sources: [
        { title: '中医基础理论', type: '教材' },
        { title: '黄帝内经·素问', type: '经典' }
      ],
      relatedConcepts: ['肝郁气滞', '气机调畅', '情志调节', '脾胃运化']
    }
  },
  {
    keywords: ['麻黄汤', '桂枝汤', '区别', '对比'],
    response: {
      content: `麻黄汤和桂枝汤是《伤寒论》中的两个重要方剂，都用于治疗外感病，但适应证和功效有明显区别：

**麻黄汤：**
📋 **组成**：麻黄、桂枝、杏仁、甘草
🎯 **功效**：发汗解表，宣肺平喘
🔸 **适应证**：太阳表实证（恶寒重、发热轻、无汗、头痛、身疼、脉浮紧）

**桂枝汤：**
📋 **组成**：桂枝、芍药、生姜、大枣、甘草  
🎯 **功效**：解肌发表，调和营卫
🔸 **适应证**：太阳表虚证（发热恶风、汗出、头痛、脉浮缓）

**主要区别：**
1. **有汗vs无汗**：桂枝汤用于有汗出，麻黄汤用于无汗
2. **表虚vs表实**：桂枝汤治表虚，麻黄汤治表实  
3. **发汗力度**：麻黄汤发汗力强，桂枝汤发汗力缓
4. **治疗机理**：麻黄汤开毛窍发汗，桂枝汤调和营卫

**用法注意：**
麻黄汤服后需避风寒，桂枝汤服后宜热粥助药力。`,
      confidence: 0.9,
      sources: [
        { title: '伤寒论', type: '经典' },
        { title: '方剂学', type: '教材' }
      ],
      relatedConcepts: ['太阳病', '表实证', '表虚证', '营卫理论']
    }
  },
  {
    keywords: ['望闻问切', '四诊', '诊法'],
    response: {
      content: `望闻问切是中医诊断疾病的四种基本方法，简称"四诊"，是中医独特的诊断体系：

**🔍 望诊**
观察病人的神、色、形、态，包括：
- 望神：观察精神状态
- 望色：面部气色变化  
- 望形：体型胖瘦强弱
- 望态：动静姿态
- 望舌：舌质舌苔变化

**👂 闻诊**  
用听觉和嗅觉收集信息：
- 听声音：语言、呼吸、咳嗽等
- 嗅气味：口气、体味等

**💬 问诊**
通过询问了解病情：
- 十问歌：一问寒热二问汗，三问头身四问便...
- 主诉、现病史、既往史等

**✋ 切诊**
用手触摸检查：
- 切脉：寸关尺三部，浮中沉三候
- 按诊：触摸身体各部位

**四诊合参**
四种诊法相互配合，综合分析，得出准确诊断。这体现了中医整体观念和辨证论治的特色。`,
      confidence: 0.88,
      sources: [
        { title: '中医诊断学', type: '教材' },
        { title: '难经', type: '经典' }
      ],
      relatedConcepts: ['辨证论治', '整体观念', '脉诊', '舌诊']
    }
  }
];

// 通用的中医响应生成器
function generateTCMResponse(message) {
  console.log('🔍 处理消息:', message);
  
  const lowerMessage = message.toLowerCase();
  
  // 检查关键词匹配
  for (const item of tcmResponses) {
    const hasMatch = item.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      console.log('✅ 找到匹配关键词:', item.keywords);
      return {
        success: true,
        data: {
          conversationId: generateId(),
          message: {
            role: 'assistant',
            content: item.response.content,
            timestamp: new Date().toISOString(),
            metadata: {
              confidence: item.response.confidence,
              sources: item.response.sources,
              relatedConcepts: item.response.relatedConcepts,
              model: 'tcm-knowledge-base'
            }
          },
          relatedConcepts: item.response.relatedConcepts,
          sources: item.response.sources,
          confidence: item.response.confidence
        }
      };
    }
  }
  
  console.log('⚠️ 未找到匹配关键词，使用默认响应');
  
  // 默认响应
  return {
    success: true,
    data: {
      conversationId: generateId(),
      message: {
        role: 'assistant',
        content: `Thank you for your question: "${message}"

This is a valuable Traditional Chinese Medicine question. While I am still learning, I can provide you with some basic guidance:

**I suggest you:**
1. Consult relevant TCM classical literature (such as "Huangdi Neijing", "Treatise on Cold Damage", etc.)
2. Reference authoritative TCM textbooks and professional books
3. Consult experienced TCM practitioners for in-depth discussion

**If you want to learn about specific content, you can try asking me:**
- TCM Basic Theory (such as Liver governs free flow of Qi, Spleen governs transportation and transformation, etc.)
- Classical Formulas (such as Ephedra Decoction, Cinnamon Twig Decoction, etc.)
- Diagnostic Methods (such as four diagnostic methods, pattern differentiation and treatment, etc.)

I will continue learning to provide you with more accurate answers.`,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.6,
          sources: [],
          relatedConcepts: ['TCM Theory', 'Pattern Differentiation and Treatment', 'Formula Studies'],
          model: 'general-tcm'
        }
      },
      relatedConcepts: ['TCM Theory', 'Pattern Differentiation and Treatment', 'Formula Studies'],
      sources: [],
      confidence: 0.6
    }
  };
}

// 生成随机ID
function generateId() {
  return 'conv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// 发送消息接口
router.post('/send', [
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('消息长度必须在1-2000字符之间'),
  body('conversationId').optional({ nullable: true }).isString()
], async (req, res) => {
  console.log('📨 收到聊天请求:', req.body);
  
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ 输入验证失败:', errors.array());
      return res.status(400).json({
        success: false,
        error: '输入验证失败',
        details: errors.array()
      });
    }

    const { message, conversationId } = req.body;
    
    console.log('⏳ 开始处理消息...');
    
    // 模拟处理延迟（真实AI调用的延迟）
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 生成响应
    const response = generateTCMResponse(message);
    
    // 如果有conversationId，使用它
    if (conversationId) {
      response.data.conversationId = conversationId;
    }
    
    console.log('✅ 响应生成成功');
    res.json(response);
    
  } catch (error) {
    console.error('❌ 发送消息失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取快速问题建议
router.get('/quick-questions', (req, res) => {
  console.log('📋 获取快速问题请求');
  
  try {
    const questions = [
      "请解释什么是'肝主疏泄'的含义？",
      "麻黄汤和桂枝汤的区别是什么？",
      "中医的'望闻问切'四诊法具体是怎样的？",
      "什么是六经辨证？",
      "请介绍一下脾胃的生理功能",
      "中医如何理解'气血津液'？",
      "五行学说在中医中的应用",
      "什么是阴阳理论？"
    ];
    
    console.log('✅ 快速问题返回成功');
    res.json({
      success: true,
      data: {
        questions: questions.slice(0, 6) // 返回6个问题
      }
    });
    
  } catch (error) {
    console.error('❌ 获取快速问题失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 获取对话列表（占位接口）
router.get('/conversations', (req, res) => {
  console.log('📂 获取对话列表请求');
  
  try {
    res.json({
      success: true,
      data: {
        conversations: [],
        pagination: {
          current: 1,
          pageSize: 20,
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('❌ 获取对话列表失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 获取特定对话详情（占位接口）
router.get('/conversations/:id', (req, res) => {
  console.log('📄 获取对话详情请求:', req.params.id);
  
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      data: {
        _id: id,
        title: '中医学习对话',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ 获取对话详情失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 删除对话（占位接口）
router.delete('/conversations/:id', (req, res) => {
  console.log('🗑️ 删除对话请求:', req.params.id);
  
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: '对话已删除'
    });
  } catch (error) {
    console.error('❌ 删除对话失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

export default router;

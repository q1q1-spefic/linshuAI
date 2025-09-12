import axios from 'axios';
import { OpenAI } from 'openai';
import { ChromaClient } from 'chromadb';
import logger from '../utils/logger.js';
import { TCM_PROMPTS } from '../utils/prompts.js';

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.chroma = new ChromaClient({
      path: process.env.CHROMA_HOST || 'http://localhost:8001'
    });
    
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.collection = null;
    
    this.init();
  }

  async init() {
    try {
      // 初始化Chroma集合
      this.collection = await this.chroma.getOrCreateCollection({
        name: "tcm_knowledge",
        metadata: { "hnsw:space": "cosine" }
      });
      
      logger.info('✅ AI服务初始化成功');
    } catch (error) {
      logger.error('❌ AI服务初始化失败:', error);
    }
  }

  /**
   * 生成聊天响应
   */
  async generateResponse(message, context = {}) {
    const startTime = Date.now();
    
    try {
      // 1. 检索相关知识
      const relevantKnowledge = await this.retrieveKnowledge(message, context);
      
      // 2. 构建提示词
      const prompt = this.buildPrompt(message, context, relevantKnowledge);
      
      // 3. 调用LLM生成响应
      const response = await this.callLLM(prompt, context);
      
      // 4. 后处理和增强
      const enhancedResponse = await this.enhanceResponse(response, relevantKnowledge);
      
      const processingTime = Date.now() - startTime;
      
      return {
        content: enhancedResponse.content,
        confidence: enhancedResponse.confidence,
        sources: relevantKnowledge.sources,
        relatedConcepts: enhancedResponse.relatedConcepts,
        processingTime,
        model: 'gpt-4'
      };
      
    } catch (error) {
      logger.error('AI响应生成失败:', error);
      throw error;
    }
  }

  /**
   * 检索相关知识
   */
  async retrieveKnowledge(query, context = {}) {
    try {
      // 1. 向量搜索
      const embeddings = await this.generateEmbeddings(query);
      const vectorResults = await this.collection.query({
        queryEmbeddings: embeddings,
        nResults: 10,
        include: ['documents', 'metadatas', 'distances']
      });

      // 2. 关键词搜索（通过外部AI服务）
      let keywordResults = [];
      try {
        const keywordResponse = await axios.post(`${this.aiServiceUrl}/search/keyword`, {
          query,
          limit: 5,
          context
        });
        keywordResults = keywordResponse.data.results || [];
      } catch (error) {
        logger.warn('关键词搜索失败:', error.message);
      }

      // 3. 合并和排序结果
      const combinedResults = this.combineSearchResults(vectorResults, keywordResults);
      
      // 4. 根据用户档案过滤和排序
      const filteredResults = this.filterByUserProfile(combinedResults, context.userProfile);
      
      return {
        documents: filteredResults.slice(0, 5), // 取前5个最相关的文档
        sources: this.extractSources(filteredResults),
        concepts: this.extractConcepts(filteredResults)
      };
      
    } catch (error) {
      logger.error('知识检索失败:', error);
      return {
        documents: [],
        sources: [],
        concepts: []
      };
    }
  }

  /**
   * 生成文本嵌入
   */
  async generateEmbeddings(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      logger.error('嵌入生成失败:', error);
      throw error;
    }
  }

  /**
   * 构建提示词
   */
  buildPrompt(message, context, knowledge) {
    const { conversationHistory = [], userProfile = {} } = context;
    
    // 基础系统提示
    let systemPrompt = TCM_PROMPTS.SYSTEM_BASE;
    
    // 根据用户水平调整提示
    if (userProfile.learningLevel === 'beginner') {
      systemPrompt += TCM_PROMPTS.BEGINNER_GUIDANCE;
    } else if (userProfile.learningLevel === 'advanced') {
      systemPrompt += TCM_PROMPTS.ADVANCED_GUIDANCE;
    }
    
    // 构建知识上下文
    const knowledgeContext = knowledge.documents
      .map(doc => `来源: ${doc.source}\n内容: ${doc.content}`)
      .join('\n\n');
    
    // 构建对话历史
    const historyContext = conversationHistory
      .slice(-6) // 最近3轮对话
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    const prompt = `${systemPrompt}

相关知识:
${knowledgeContext}

对话历史:
${historyContext}

用户问题: ${message}

请根据中医理论和相关知识，为用户提供准确、易懂的回答。回答应该：
1. 基于传统中医理论
2. 结合现代理解
3. 适合用户的学习水平（${userProfile.learningLevel || '初学者'}）
4. 提供具体例子和实际应用
5. 如果涉及治疗建议，请提醒用户咨询专业医师`;

    return prompt;
  }

  /**
   * 调用大语言模型
   */
  async callLLM(prompt, context = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model
      };
      
    } catch (error) {
      logger.error('LLM调用失败:', error);
      throw error;
    }
  }

  /**
   * 增强响应
   */
  async enhanceResponse(response, knowledge) {
    try {
      // 提取相关概念
      const relatedConcepts = await this.extractRelatedConcepts(response.content, knowledge);
      
      // 计算置信度
      const confidence = this.calculateConfidence(response, knowledge);
      
      // 添加引用标记
      const enhancedContent = this.addCitations(response.content, knowledge.sources);
      
      return {
        content: enhancedContent,
        relatedConcepts,
        confidence
      };
      
    } catch (error) {
      logger.error('响应增强失败:', error);
      return {
        content: response.content,
        relatedConcepts: [],
        confidence: 0.5
      };
    }
  }

  /**
   * 提取相关概念
   */
  async extractRelatedConcepts(content, knowledge) {
    try {
      // 使用AI服务提取概念
      const conceptResponse = await axios.post(`${this.aiServiceUrl}/extract/concepts`, {
        text: content,
        context: knowledge.concepts
      });
      
      return conceptResponse.data.concepts || [];
    } catch (error) {
      logger.warn('概念提取失败:', error.message);
      return [];
    }
  }

  /**
   * 计算置信度
   */
  calculateConfidence(response, knowledge) {
    let confidence = 0.5; // 基础置信度
    
    // 基于知识匹配度
    if (knowledge.documents.length > 3) {
      confidence += 0.2;
    }
    
    // 基于响应长度和结构
    if (response.content.length > 200 && response.content.includes('。')) {
      confidence += 0.1;
    }
    
    // 基于专业术语密度
    const tcmTerms = ['气血', '阴阳', '五行', '脏腑', '经络', '辨证', '治法'];
    const termCount = tcmTerms.filter(term => response.content.includes(term)).length;
    confidence += Math.min(termCount * 0.05, 0.2);
    
    return Math.min(confidence, 1.0);
  }

  /**
   * 添加引用
   */
  addCitations(content, sources) {
    // 简单的引用添加逻辑
    if (sources.length > 0) {
      const citations = sources.slice(0, 3).map((source, index) => 
        `[${index + 1}] ${source.title}`
      ).join('\n');
      
      return `${content}\n\n参考文献:\n${citations}`;
    }
    
    return content;
  }

  /**
   * 合并搜索结果
   */
  combineSearchResults(vectorResults, keywordResults) {
    const combined = [];
    
    // 处理向量搜索结果
    if (vectorResults.documents && vectorResults.documents[0]) {
      vectorResults.documents[0].forEach((doc, index) => {
        combined.push({
          content: doc,
          metadata: vectorResults.metadatas[0][index],
          score: 1 - vectorResults.distances[0][index], // 距离转换为相似度
          source: 'vector'
        });
      });
    }
    
    // 处理关键词搜索结果
    keywordResults.forEach(result => {
      combined.push({
        content: result.content,
        metadata: result.metadata,
        score: result.score,
        source: 'keyword'
      });
    });
    
    // 按分数排序并去重
    return combined
      .sort((a, b) => b.score - a.score)
      .filter((item, index, self) => 
        index === self.findIndex(t => t.content === item.content)
      );
  }

  /**
   * 根据用户档案过滤
   */
  filterByUserProfile(results, userProfile = {}) {
    if (!userProfile.learningLevel) {
      return results;
    }
    
    // 根据学习水平过滤内容难度
    return results.filter(result => {
      const difficulty = result.metadata?.difficulty || 'medium';
      
      if (userProfile.learningLevel === 'beginner') {
        return difficulty === 'easy' || difficulty === 'medium';
      } else if (userProfile.learningLevel === 'advanced') {
        return difficulty === 'medium' || difficulty === 'hard';
      }
      
      return true;
    });
  }

  /**
   * 提取文档来源
   */
  extractSources(results) {
    return results
      .filter(result => result.metadata?.source)
      .map(result => ({
        title: result.metadata.title || '未知文档',
        source: result.metadata.source,
        type: result.metadata.type || 'text',
        url: result.metadata.url
      }))
      .slice(0, 5);
  }

  /**
   * 提取概念
   */
  extractConcepts(results) {
    const concepts = new Set();
    
    results.forEach(result => {
      if (result.metadata?.concepts) {
        result.metadata.concepts.forEach(concept => concepts.add(concept));
      }
    });
    
    return Array.from(concepts).slice(0, 10);
  }

  /**
   * 生成快速问题
   */
  async generateQuickQuestions(userProfile = {}) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/generate/questions`, {
        userProfile,
        count: 5
      });
      
      return response.data.questions;
    } catch (error) {
      logger.warn('快速问题生成失败:', error.message);
      return null;
    }
  }

  /**
   * 分析问题类型
   */
  async analyzeQuestionType(question) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/analyze/question`, {
        question
      });
      
      return response.data;
    } catch (error) {
      logger.warn('问题分析失败:', error.message);
      return {
        mainTopic: 'general',
        topics: [],
        difficulty: 'medium'
      };
    }
  }
}

// 单例模式
export const aiService = new AIService();
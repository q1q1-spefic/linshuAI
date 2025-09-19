import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Card,
  Typography,
  Space,
  Avatar,
  Spin,
  message,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { chatService } from '../../services/chatService';
import { useLanguage } from '../../hooks/useLanguage';
import './ChatBox.css';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const ChatBox = () => {
  const { t, isEn } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 从语言包获取快速问题
  useEffect(() => {
    const questions = t('chat.quickQuestions') || [];
    setQuickQuestions(questions);
  }, [t]);

  // 发送消息
  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    // 添加用户消息到界面
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 调用聊天服务
      const response = await chatService.sendMessage(text.trim(), conversationId);
      
      if (response.success) {
        // 添加AI响应
        setMessages(prev => [...prev, response.data.message]);
        
        // 设置对话ID（如果是新对话）
        if (!conversationId && response.data.conversationId) {
          setConversationId(response.data.conversationId);
        }
      } else {
        throw new Error(response.error || t('chat.error.sendFailed'));
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error(t('chat.error.sendFailed'));
      
      // 添加错误消息
      const errorMessage = {
        role: 'assistant',
        content: t('chat.error.noResponse'),
        timestamp: new Date().toISOString(),
        metadata: { error: true }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter 换行
        return;
      } else {
        // Enter 发送
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  // 点击快速问题
  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 渲染消息
  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    const isError = msg.metadata?.error;
    const isFallback = msg.metadata?.isFallback;
    
    return (
      <div 
        key={index} 
        className={`message-container ${isUser ? 'user-message' : 'assistant-message'}`}
      >
        <div className="message-wrapper">
          <Avatar
            size="small"
            icon={isUser ? <UserOutlined /> : undefined}
            style={{
              backgroundColor: isUser ? '#2c3e50' : '#2c3e50',
              marginRight: isUser ? 0 : 8,
              marginLeft: isUser ? 8 : 0,
              color: '#ffffff',
              fontSize: isUser ? undefined : '12px'
            }}
          >
            {isUser ? undefined : (isEn ? 'L' : '灵')}
          </Avatar>
          
          <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
            {isError && (
              <div className="message-error-indicator">
                <ThunderboltOutlined style={{ color: '#ff4d4f' }} />
                <Text type="secondary" style={{ fontSize: '12px', marginLeft: '4px' }}>
                  {t('chat.error.service')}
                </Text>
              </div>
            )}
            
            {isFallback && (
              <div className="message-fallback-indicator">
                <BookOutlined style={{ color: '#faad14' }} />
                <Text type="secondary" style={{ fontSize: '12px', marginLeft: '4px' }}>
                  {t('chat.error.offline')}
                </Text>
              </div>
            )}
            
            <div className="message-content">
              {msg.content.split('\n').map((line, i) => (
                <div key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </div>
              ))}
            </div>
            
            <div className="message-meta">
              <Text type="secondary" style={{ fontSize: '11px' }}>
                <ClockCircleOutlined style={{ marginRight: '4px' }} />
                {formatTime(msg.timestamp)}
              </Text>
              
              {msg.metadata?.confidence && (
                <Tooltip title={`置信度: ${(msg.metadata.confidence * 100).toFixed(0)}%`}>
                  <Badge 
                    color={msg.metadata.confidence > 0.7 ? 'green' : 'orange'} 
                    style={{ marginLeft: '8px' }}
                  />
                </Tooltip>
              )}
            </div>
            
            {/* 相关概念 */}
            {msg.metadata?.relatedConcepts?.length > 0 && (
              <div className="related-concepts">
                <Divider style={{ margin: '8px 0' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.relatedConcepts')}
                </Text>
                <div style={{ marginTop: '4px' }}>
                  {msg.metadata.relatedConcepts.slice(0, 3).map((concept, i) => (
                    <span 
                      key={i}
                      className="concept-tag"
                      onClick={() => handleSendMessage(isEn ? `Please explain ${concept} in detail` : `请详细解释一下${concept}`)}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-box">
      {/* 消息区域 */}
      <div className="messages-container">
        {messages.length === 0 ? (
          // 欢迎界面
          <div className="welcome-container">
            <div className="welcome-avatar">
              <Avatar
                size={80}
                style={{
                  background: 'linear-gradient(135deg, #2c3e50, #34495e)',
                  fontSize: '24px'
                }}
              >
                {isEn ? 'L' : '灵'}
              </Avatar>
            </div>
            
            <Typography.Title level={3} style={{ marginTop: '16px' }}>
              {t('chat.welcome')}
            </Typography.Title>
            
            <Paragraph style={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>
              {t('chat.welcomeDesc')}
            </Paragraph>
            
            {/* 快速问题 */}
            {quickQuestions.length > 0 && (
              <div className="quick-questions">
                <Text strong style={{ display: 'block', marginBottom: '12px' }}>
                  {t('chat.tryQuestions')}
                </Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {quickQuestions.slice(0, 4).map((question, index) => (
                    <Card 
                      key={index}
                      size="small" 
                      hoverable
                      className="quick-question-card"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Card>
                  ))}
                </Space>
              </div>
            )}
          </div>
        ) : (
          // 消息列表
          <div className="messages-list">
            {messages.map((msg, index) => renderMessage(msg, index))}
            {isLoading && (
              <div className="loading-message">
                <Avatar
                  size="small"
                  style={{
                    backgroundColor: '#2c3e50',
                    marginRight: '8px',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                >
                  {isEn ? 'L' : '灵'}
                </Avatar>
                <div className="message-bubble assistant">
                  <Spin size="small" />
                  <span style={{ marginLeft: '8px' }}>{t('chat.thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* 输入区域 */}
      <div className="input-container">
        <div className="input-wrapper">
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleKeyPress}
            placeholder={t('chat.placeholder')}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ 
              resize: 'none',
              borderRadius: '12px 0 0 12px',
              border: '1px solid #d9d9d9'
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSendMessage()}
            loading={isLoading}
            disabled={!inputValue.trim()}
            style={{ 
              height: '40px',
              borderRadius: '0 12px 12px 0'
            }}
          />
        </div>
        
        <div className="input-hint">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {t('chat.sendHint')}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

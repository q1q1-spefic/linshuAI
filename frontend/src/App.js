import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Card, Row, Col, Button, Typography, Space, Badge, Input } from 'antd';
import { 
  MessageOutlined, 
  ShareAltOutlined, 
  BookOutlined,
  RocketOutlined,
  UserOutlined,
  SettingOutlined,
  SendOutlined,
  HomeOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import axios from 'axios';
import ChatBox from './components/chat/ChatBox';
import KnowledgeGraph from './components/knowledge-graph/KnowledgeGraph';
import LearningMain from './components/learning/LearningMain';
import './App.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

// 主题配置 - 参考设计稿的配色
const theme = {
  token: {
    colorPrimary: '#52c41a',
    colorSuccess: '#52c41a',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif'
  }
};

// 快速问题数据
const quickQuestions = [
  "请解释肝主疏泄的含义",
  "麻黄汤和桂枝汤的区别",
  "什么是天人相应理论",
  "脾胃虚弱的症状表现"
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendInfo, setBackendInfo] = useState(null);

  // 检查后端连接状态
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/health');
        setBackendInfo(response.data);
        setBackendStatus('connected');
      } catch (error) {
        console.log('后端连接检查:', error.message);
        setBackendStatus('disconnected');
      }
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 30000); // 每30秒检查一次
    return () => clearInterval(interval);
  }, []);

  // 顶部导航栏组件
  const TopHeader = () => (
    <Header style={{ 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    }}>
      <div 
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer'
        }}
        onClick={() => setCurrentView('home')}
        >
        <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #52c41a, #73d13d)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold'
        }}>
            灵
        </div>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
            灵枢AI
        </span>
        </div>
      
      <Space>
        <Button 
            type={currentView === 'home' ? 'primary' : 'text'}
            icon={<HomeOutlined />}
            onClick={() => setCurrentView('home')}
        >
            首页
        </Button>
        <Button 
            type={currentView === 'chat' ? 'primary' : 'text'}
            icon={<MessageOutlined />}
            onClick={() => setCurrentView('chat')}
        >
            开始对话
        </Button>
        <Button 
          type={currentView === 'graph' ? 'primary' : 'text'}
          icon={<ShareAltOutlined />}
          onClick={() => setCurrentView('graph')}
        >
          知识图谱
        </Button>
        <Button 
          type={currentView === 'learning' ? 'primary' : 'text'}
          icon={<BookOutlined />}
          onClick={() => setCurrentView('learning')}
        >
          学习路径
        </Button>
        <Button type="text" icon={<SettingOutlined />} />
        <Button type="primary">登录</Button>
      </Space>
    </Header>
  );

  // 首页内容
  const HomePage = () => (
    <div style={{ background: '#fff' }}>
      {/* Hero Section - 参考设计稿的主标题区域 */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)'
      }}>
        <Title level={1} style={{ 
          fontSize: '3rem', 
          fontWeight: '700',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #52c41a, #1677ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          中医智慧的 AI 学习伙伴
        </Title>
        <Paragraph style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          marginBottom: '40px',
          maxWidth: '800px',
          margin: '0 auto 40px'
        }}>
          探索传统中医的深度智慧，通过AI驱动的知识图谱、智能问答和个性化学习路径，
          让古老的医学经典焕发现代活力
        </Paragraph>
        
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<RocketOutlined />}
            onClick={() => setCurrentView('chat')}
            style={{ 
              height: '48px', 
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px'
            }}
          >
            开始探索
          </Button>
          <Button 
            size="large"
            icon={<BookOutlined />}
            onClick={() => setCurrentView('learning')}
            style={{ 
              height: '48px', 
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px'
            }}
          >
            学习路径
          </Button>
        </Space>
      </div>

      {/* 核心功能区域 - 参考设计稿的卡片布局 */}
      <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
          核心功能
        </Title>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '16px',
                border: '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('chat')}
            >
              <MessageOutlined style={{ 
                fontSize: '3rem', 
                color: '#52c41a',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                AI 智能问答
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                基于RAG模型的中医知识库，像与真人老师对话一样学习
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '4px 0', color: '#52c41a' }}>• 经典古籍深度解读</li>
                <li style={{ padding: '4px 0', color: '#52c41a' }}>• 现代临床指南对比</li>
                <li style={{ padding: '4px 0', color: '#52c41a' }}>• 名家医案分析</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '16px',
                border: '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('graph')}
            >
              <ShareAltOutlined style={{ 
                fontSize: '3rem', 
                color: '#1677ff',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                知识图谱
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                可视化的中医知识网络，探索概念间的深层关联
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '4px 0', color: '#1677ff' }}>• 动态关联径发现</li>
                <li style={{ padding: '4px 0', color: '#1677ff' }}>• 病机传变可视化</li>
                <li style={{ padding: '4px 0', color: '#1677ff' }}>• 整体观念体现</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '16px',
                border: '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('learning')}
            >
              <BookOutlined style={{ 
                fontSize: '3rem', 
                color: '#faad14',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                个性化学习
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                智能导师为您规划最适合的学习路径和复习计划
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '4px 0', color: '#faad14' }}>• 能力画像评估</li>
                <li style={{ padding: '4px 0', color: '#faad14' }}>• 动态路径生成</li>
                <li style={{ padding: '4px 0', color: '#faad14' }}>• 遗忘曲线优化</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 系统状态 */}
      <div style={{ padding: '40px 24px', background: '#fafafa', textAlign: 'center' }}>
        <Space align="center">
          <Badge status={backendStatus === 'connected' ? 'success' : 'error'} />
          <span>后端服务: </span>
          {backendStatus === 'connected' && (
            <span style={{ color: '#52c41a' }}>已连接 ✓</span>
          )}
          {backendStatus === 'disconnected' && (
            <span style={{ color: '#ff4d4f' }}>连接失败</span>
          )}
          {backendInfo && (
            <span style={{ color: '#666', marginLeft: '16px' }}>
              运行时间: {Math.floor(backendInfo.uptime)}秒
            </span>
          )}
        </Space>
      </div>
    </div>
  );

  // AI 问答页面 - 使用新的ChatBox组件
  const ChatPage = () => (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* 左侧边栏 - 参考设计稿 */}
      <div style={{ 
        width: '300px', 
        background: '#fafafa', 
        borderRight: '1px solid #f0f0f0',
        padding: '20px'
      }}>
        <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            快速问题
          </Title>
          {quickQuestions.map((question, index) => (
            <div 
              key={index}
              style={{
                padding: '12px',
                background: '#f8f8f8',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e6f7ff';
                e.target.style.borderColor = '#91d5ff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f8f8f8';
                e.target.style.borderColor = 'transparent';
              }}
            >
              {question}
            </div>
          ))}
        </Card>
        
        <Card style={{ borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            学习提示
          </Title>
          <Paragraph style={{ fontSize: '14px', color: '#666' }}>
            您可以询问中医理论、经典条文、方剂配伍、病机分析等各种问题，我会基于丰富的中医知识库为您提供详细解答。
          </Paragraph>
        </Card>
      </div>
      
      {/* 主对话区域 - 使用ChatBox组件 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#fff'
        }}>
          <Title level={3} style={{ margin: 0 }}>
            AI 智能问答
          </Title>
          <Paragraph style={{ margin: '8px 0 0', color: '#666' }}>
            中医学习伙伴
          </Paragraph>
        </div>
        
        <div style={{ flex: 1 }}>
          <ChatBox />
        </div>
      </div>
    </div>
  );

  // 知识图谱页面占位
  const GraphPage = () => (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <KnowledgeGraph />
    </div>
  );

  // 学习路径页面占位  
  const LearningPage = () => (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      <LearningMain />
    </div>
  );

  // 渲染当前页面
  const renderCurrentView = () => {
    switch(currentView) {
      case 'chat': return <ChatPage />;
      case 'graph': return <GraphPage />;
      case 'learning': return <LearningPage />;
      default: return <HomePage />;
    }
  };

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <Layout style={{ minHeight: '100vh' }}>
        <TopHeader />
        {renderCurrentView()}
      </Layout>
    </ConfigProvider>
  );
}

export default App;

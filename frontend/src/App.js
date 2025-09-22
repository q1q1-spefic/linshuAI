import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Card, Row, Col, Button, Typography, Space, Badge, Dropdown, Modal, Form, Input, message } from 'antd';
import {
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
  RocketOutlined,
  SettingOutlined,
  HomeOutlined,
  GlobalOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import axios from 'axios';
import ChatBox from './components/chat/ChatBox';
import KnowledgeGraph from './components/knowledge-graph/KnowledgeGraph';
import LearningMain from './components/learning/LearningMain';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import './App.css';

const { Header } = Layout;
const { Title, Paragraph } = Typography;

// 获取主题配置 - 根据语言调整字体
const getTheme = (isEn) => ({
  token: {
    colorPrimary: '#2c3e50',        // 深青墨
    colorSuccess: '#16a085',        // 翡翠绿
    colorInfo: '#5d6d7e',           // 淡墨灰
    colorWarning: '#d68910',        // 琴柏黄
    colorError: '#cb4335',          // 朱砂红
    colorBgLayout: '#f8f9fa',       // 米白
    colorBgContainer: '#ffffff',    // 纯白
    colorText: '#212529',           // 墨黑
    colorTextSecondary: '#5d6d7e',  // 淡墨
    borderRadius: 6,
    fontSize: 14,
    fontFamily: isEn
      ? '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'
      : '"SimSun", "宋体", "STSong", serif'
  },
  components: {
    Layout: {
      colorBgHeader: '#f8f9fa',
      colorBgBody: '#f8f9fa'
    },
    Card: {
      colorBgContainer: '#ffffff',
      boxShadow: '0 2px 12px rgba(44, 62, 80, 0.08)'
    },
    Button: {
      colorPrimary: '#2c3e50',
      colorPrimaryHover: '#34495e',
      colorPrimaryActive: '#1b2631'
    },
    Typography: {
      fontFamily: isEn
        ? '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'
        : '"SimSun", "宋体", "STSong", serif'
    }
  }
});

// 快速问题数据现在从语言包获取

// 主应用组件内容
const AppContent = () => {
  const { t, currentLanguage, changeLanguage, isEn } = useLanguage();
  const [currentView, setCurrentView] = useState('home');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendInfo, setBackendInfo] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loginForm] = Form.useForm();

  // 语言切换菜单
  const languageMenuItems = [
    {
      key: 'zh',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇨🇳</span>
          <span>中文</span>
        </div>
      ),
      onClick: () => changeLanguage('zh')
    },
    {
      key: 'en',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇺🇸</span>
          <span>English</span>
        </div>
      ),
      onClick: () => changeLanguage('en')
    }
  ];

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

  // 检查登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('lingshui_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUserInfo(userData);
      } catch (error) {
        localStorage.removeItem('lingshui_user');
      }
    }
  }, []);

  // 登录处理
  const handleLogin = async (values) => {
    try {
      // 这里可以调用实际的登录API
      // const response = await axios.post('http://localhost:3001/api/auth/login', values);

      // 模拟登录成功
      const mockUser = {
        id: 1,
        username: values.username,
        email: values.email || `${values.username}@example.com`,
        avatar: null,
        loginTime: new Date().toISOString()
      };

      setIsLoggedIn(true);
      setUserInfo(mockUser);
      localStorage.setItem('lingshui_user', JSON.stringify(mockUser));
      setLoginModalVisible(false);
      loginForm.resetFields();

      message.success(t('auth.loginSuccess') || '登录成功！');
    } catch (error) {
      message.error(t('auth.loginFailed') || '登录失败，请重试');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('lingshui_user');
    message.success(t('auth.logoutSuccess') || '已退出登录');
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      label: t('auth.profile') || '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: t('auth.settings') || '设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('auth.logout') || '退出登录',
      onClick: handleLogout,
    },
  ];

  // 顶部导航栏组件
  const TopHeader = () => (
    <Header style={{ 
      background: '#f8f9fa', 
      borderBottom: '1px solid #d5d8dc',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px',
      boxShadow: '0 1px 6px rgba(44, 62, 80, 0.1)'
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
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #2c3e50, #34495e)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
            {isEn ? 'L' : '灵'}
        </div>
        <span style={{
            fontSize: '22px',
            fontWeight: isEn ? '600' : '500',
            color: '#212529',
            fontFamily: isEn
              ? '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'
              : '"SimSun", "宋体", "STSong", serif',
            letterSpacing: isEn ? '0.5px' : '1px'
        }}>
            {isEn ? 'LingShu AI' : '灵枢AI'}
        </span>
        </div>
      
      <Space>
        <Button
            type={currentView === 'home' ? 'primary' : 'text'}
            icon={<HomeOutlined />}
            onClick={() => setCurrentView('home')}
        >
            {t('nav.home')}
        </Button>
        <Button
            type={currentView === 'chat' ? 'primary' : 'text'}
            icon={<MessageOutlined />}
            onClick={() => setCurrentView('chat')}
        >
            {t('nav.chat')}
        </Button>
        <Button
          type={currentView === 'graph' ? 'primary' : 'text'}
          icon={<ShareAltOutlined />}
          onClick={() => setCurrentView('graph')}
        >
          {t('nav.graph')}
        </Button>
        <Button
          type={currentView === 'learning' ? 'primary' : 'text'}
          icon={<BookOutlined />}
          onClick={() => setCurrentView('learning')}
        >
          {t('nav.learning')}
        </Button>
        <Dropdown
          menu={{ items: languageMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<GlobalOutlined />}>
            {currentLanguage === 'zh' ? '🇨🇳' : '🇺🇸'}
          </Button>
        </Dropdown>
        <Button type="text" icon={<SettingOutlined />} />
        {isLoggedIn ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" style={{ padding: '0 8px' }}>
              <Space>
                <UserOutlined />
                <span>{userInfo?.username || 'User'}</span>
              </Space>
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => setLoginModalVisible(true)}>
            {t('nav.login')}
          </Button>
        )}
      </Space>
    </Header>
  );

  // 首页内容
  const HomePage = () => (
    <div style={{ background: '#f8f9fa' }}>
      {/* Hero Section - 水墨风格主标题区域 */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Title
          level={1}
          className={isEn ? 'home-title-en' : ''}
          style={{
            fontSize: '3rem',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#212529',
            fontFamily: isEn
              ? '"Cambria", "Times New Roman", serif'
              : '"SimSun", "宋体", "STSong", serif',
            letterSpacing: '2px'
          }}
        >
          {t('home.title')}
        </Title>
        <Paragraph style={{
          fontSize: '1.2rem',
          color: isEn ? '#6c757d' : '#212529',
          fontWeight: isEn ? '500' : '400',
          marginBottom: '40px',
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.8',
          fontFamily: isEn
            ? '"Cambria", "Times New Roman", serif'
            : '"SimSun", "宋体", "STSong", serif'
        }}>
          {t('home.subtitle')}
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
              borderRadius: '4px',
              fontFamily: isEn
                ? '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'
                : '"SimSun", "宋体", "STSong", serif'
            }}
          >
            {t('home.startExploring')}
          </Button>
          <Button
            size="large"
            icon={<BookOutlined />}
            onClick={() => setCurrentView('learning')}
            style={{
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '4px',
              fontFamily: isEn
                ? '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'
                : '"SimSun", "宋体", "STSong", serif'
            }}
          >
            {t('home.learningPath')}
          </Button>
        </Space>
      </div>

      {/* 核心功能区域 - 参考设计稿的卡片布局 */}
      <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
          {t('home.coreFeatures')}
        </Title>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('chat')}
            >
              <MessageOutlined style={{ 
                fontSize: '3rem', 
                color: '#2c3e50',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                {t('home.features.chat.title')}
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                {t('home.features.chat.description')}
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {(t('home.features.chat.features') || []).map((feature, index) => (
                  <li key={index} style={{ padding: '4px 0', color: '#5d6d7e' }}>• {feature}</li>
                ))}
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('graph')}
            >
              <ShareAltOutlined style={{ 
                fontSize: '3rem', 
                color: '#5d6d7e',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                {t('home.features.graph.title')}
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                {t('home.features.graph.description')}
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {(t('home.features.graph.features') || []).map((feature, index) => (
                  <li key={index} style={{ padding: '4px 0', color: '#5d6d7e' }}>• {feature}</li>
                ))}
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
              onClick={() => setCurrentView('learning')}
            >
              <BookOutlined style={{ 
                fontSize: '3rem', 
                color: '#85929e',
                marginBottom: '16px',
                display: 'block'
              }} />
              <Title level={3} style={{ marginBottom: '16px' }}>
                {t('home.features.learning.title')}
              </Title>
              <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
                {t('home.features.learning.description')}
              </Paragraph>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {(t('home.features.learning.features') || []).map((feature, index) => (
                  <li key={index} style={{ padding: '4px 0', color: '#5d6d7e' }}>• {feature}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 系统状态 */}
      <div style={{ padding: '40px 24px', background: '#f1f3f4', textAlign: 'center' }}>
        <Space align="center">
          <Badge status={backendStatus === 'connected' ? 'success' : 'error'} />
          <span style={{ color: '#5d6d7e' }}>{t('home.status.backend')}: </span>
          {backendStatus === 'connected' && (
            <span style={{ color: '#16a085' }}>{t('home.status.connected')} ✓</span>
          )}
          {backendStatus === 'disconnected' && (
            <span style={{ color: '#cb4335' }}>{t('home.status.disconnected')}</span>
          )}
          {backendInfo && (
            <span style={{ color: '#85929e', marginLeft: '16px' }}>
              {t('home.status.uptime')}: {Math.floor(backendInfo.uptime)}{isEn ? 's' : '秒'}
            </span>
          )}
        </Space>
      </div>
    </div>
  );

  // AI 问答页面 - 使用新的ChatBox组件
  const ChatPage = () => (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* 左侧边栏 - 水墨风格 */}
      <div style={{ 
        width: '300px', 
        background: '#f1f3f4', 
        borderRight: '1px solid #e8e8e8',
        padding: '20px'
      }}>
        <Card style={{ marginBottom: '16px', borderRadius: '8px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {t('chat.quickQuestionsTitle')}
          </Title>
          {(t('chat.quickQuestions') || []).map((question, index) => (
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
                e.target.style.background = '#e8e8e8';
                e.target.style.borderColor = '#d0d0d0';
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
        
        <Card style={{ borderRadius: '8px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {t('chat.learningTips')}
          </Title>
          <Paragraph style={{ fontSize: '14px', color: '#5d6d7e' }}>
            {t('chat.tipContent')}
          </Paragraph>
        </Card>
      </div>
      
      {/* 主对话区域 - 使用ChatBox组件 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e8e8e8',
          background: '#f8f9fa'
        }}>
          <Title level={3} style={{ margin: 0 }}>
            {t('chat.title')}
          </Title>
          <Paragraph style={{ margin: '8px 0 0', color: '#5d6d7e' }}>
            {t('chat.subtitle')}
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
    <ConfigProvider locale={currentLanguage === 'zh' ? zhCN : enUS} theme={getTheme(isEn)}>
      <Layout style={{ minHeight: '100vh' }} className={`lang-${currentLanguage}`}>
        <TopHeader />
        {renderCurrentView()}

        {/* 登录模态框 */}
        <Modal
          title={t('auth.loginTitle') || '登录'}
          open={loginModalVisible}
          onCancel={() => {
            setLoginModalVisible(false);
            loginForm.resetFields();
          }}
          footer={null}
          width={400}
        >
          <Form
            form={loginForm}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label={t('auth.username') || '用户名'}
              name="username"
              rules={[
                {
                  required: true,
                  message: t('auth.usernameRequired') || '请输入用户名',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('auth.usernamePlaceholder') || '请输入用户名'}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={t('auth.password') || '密码'}
              name="password"
              rules={[
                {
                  required: true,
                  message: t('auth.passwordRequired') || '请输入密码',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.passwordPlaceholder') || '请输入密码'}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: '100%' }}
              >
                {t('auth.loginButton') || '登录'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button type="link" size="small">
                {t('auth.forgotPassword') || '忘记密码？'}
              </Button>
              <span style={{ color: '#d9d9d9' }}>|</span>
              <Button type="link" size="small">
                {t('auth.register') || '注册账号'}
              </Button>
            </div>
          </Form>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

// 主App组件
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

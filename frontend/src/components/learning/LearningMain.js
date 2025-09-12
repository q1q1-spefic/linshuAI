import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Tabs, Alert, Result } from 'antd';
import { 
  BookOutlined,
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import LearningAssessment from './LearningAssessment';
import LearningPath from './LearningPath';
import './LearningMain.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const LearningMain = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [userLevel, setUserLevel] = useState('beginner');

  // 检查本地存储的评估结果
  useEffect(() => {
    const savedResult = localStorage.getItem('tcm_assessment_result');
    if (savedResult) {
      try {
        const result = JSON.parse(savedResult);
        setAssessmentResult(result);
        setAssessmentCompleted(true);
        setUserLevel(result.level);
        setCurrentTab('path');
      } catch (error) {
        console.error('解析评估结果失败:', error);
      }
    }
  }, []);

  // 处理评估完成
  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
    setAssessmentCompleted(true);
    setUserLevel(result.level);
    
    // 保存到本地存储
    localStorage.setItem('tcm_assessment_result', JSON.stringify(result));
    
    // 自动切换到学习路径
    setTimeout(() => {
      setCurrentTab('path');
    }, 2000);
  };

  // 重新开始评估
  const handleRetakeAssessment = () => {
    setAssessmentCompleted(false);
    setAssessmentResult(null);
    localStorage.removeItem('tcm_assessment_result');
    setCurrentTab('assessment');
  };

  // 开始学习之旅
  const handleStartLearning = () => {
    setCurrentTab('assessment');
  };

  // 概览页面
  const OverviewPage = () => (
    <div className="learning-overview">
      <Card className="welcome-card">
        <div className="welcome-content">
          <Title level={2}>开启您的中医学习之旅</Title>
          <Paragraph>
            通过科学的评估和个性化的学习路径，让中医学习变得更加高效和有趣。
            我们将根据您的基础水平，为您制定专属的学习计划。
          </Paragraph>
          
          <div className="learning-features">
            <div className="feature-item">
              <TrophyOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>能力评估</Title>
                <Paragraph>
                  6道精心设计的题目，快速了解您的中医知识水平
                </Paragraph>
              </div>
            </div>
            
            <div className="feature-item">
              <BookOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>个性化路径</Title>
                <Paragraph>
                  根据评估结果，为您推荐最适合的学习内容和进度
                </Paragraph>
              </div>
            </div>
            
            <div className="feature-item">
              <CheckCircleOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>进度跟踪</Title>
                <Paragraph>
                  清晰的学习进度展示，让您随时了解学习成果
                </Paragraph>
              </div>
            </div>
          </div>
          
          {!assessmentCompleted ? (
            <Button 
              type="primary" 
              size="large"
              icon={<RocketOutlined />}
              onClick={handleStartLearning}
              className="start-button"
            >
              开始学习评估
            </Button>
          ) : (
            <div className="completed-actions">
              <Alert
                message="您已完成能力评估"
                description={`当前水平：${getLevelText(userLevel)} | 得分：${assessmentResult?.scorePercentage}分`}
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Space>
                <Button 
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={() => setCurrentTab('path')}
                >
                  查看学习路径
                </Button>
                <Button 
                  onClick={handleRetakeAssessment}
                >
                  重新评估
                </Button>
              </Space>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  // 获取水平文本
  const getLevelText = (level) => {
    const levelMap = {
      beginner: '入门级',
      basic: '基础级',
      intermediate: '进阶级',
      advanced: '高级'
    };
    return levelMap[level] || level;
  };

  return (
    <div className="learning-main-container">
      <div className="learning-header">
        <Title level={1}>个性化学习</Title>
        <Paragraph>
          智能导师为您规划最适合的学习路径和复习计划
        </Paragraph>
      </div>
      
      <Tabs 
        activeKey={currentTab} 
        onChange={setCurrentTab}
        className="learning-tabs"
        size="large"
      >
        <TabPane 
          tab={
            <span>
              <RocketOutlined />
              学习概览
            </span>
          } 
          key="overview"
        >
          <OverviewPage />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              能力评估
            </span>
          } 
          key="assessment"
        >
          <LearningAssessment onComplete={handleAssessmentComplete} />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BookOutlined />
              学习路径
            </span>
          } 
          key="path"
          disabled={!assessmentCompleted}
        >
          {assessmentCompleted ? (
            <LearningPath 
              userLevel={userLevel} 
              assessmentResult={assessmentResult}
            />
          ) : (
            <Result
              icon={<TrophyOutlined />}
              title="请先完成能力评估"
              subTitle="评估帮助我们了解您的学习水平，为您制定个性化的学习路径"
              extra={
                <Button 
                  type="primary" 
                  onClick={() => setCurrentTab('assessment')}
                >
                  开始评估
                </Button>
              }
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default LearningMain;
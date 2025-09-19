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
import { useLanguage } from '../../hooks/useLanguage';
import './LearningMain.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const LearningMain = () => {
  const { t } = useLanguage();
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
          <Title level={2}>{t('learning.overview.title')}</Title>
          <Paragraph>
            {t('learning.overview.description')}
          </Paragraph>
          
          <div className="learning-features">
            <div className="feature-item">
              <TrophyOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>{t('learning.overview.featureCards.assessment.title')}</Title>
                <Paragraph>
                  {t('learning.overview.featureCards.assessment.description')}
                </Paragraph>
              </div>
            </div>
            
            <div className="feature-item">
              <BookOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>{t('learning.overview.featureCards.personalized.title')}</Title>
                <Paragraph>
                  {t('learning.overview.featureCards.personalized.description')}
                </Paragraph>
              </div>
            </div>
            
            <div className="feature-item">
              <CheckCircleOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4}>{t('learning.overview.featureCards.tracking.title')}</Title>
                <Paragraph>
                  {t('learning.overview.featureCards.tracking.description')}
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
              {t('learning.overview.startLearningAssessment')}
            </Button>
          ) : (
            <div className="completed-actions">
              <Alert
                message={t('learning.overview.completedAssessment')}
                description={`${t('learning.overview.currentLevel')}：${getLevelText(userLevel)} | ${t('learning.overview.score')}：${assessmentResult?.scorePercentage}分`}
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
                  {t('learning.overview.viewLearningPath')}
                </Button>
                <Button 
                  onClick={handleRetakeAssessment}
                >
                  {t('learning.overview.retakeAssessment')}
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
    return t(`learning.overview.levels.${level}`) || level;
  };

  return (
    <div className="learning-main-container">
      <div className="learning-header">
        <Title level={1}>{t('learning.title')}</Title>
        <Paragraph>
          {t('learning.subtitle')}
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
              {t('learning.tabs.overview')}
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
              {t('learning.tabs.assessment')}
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
              {t('learning.tabs.path')}
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
              title={t('learning.path.pleaseCompleteAssessment')}
              subTitle={t('learning.path.assessmentHelpText')}
              extra={
                <Button
                  type="primary"
                  onClick={() => setCurrentTab('assessment')}
                >
                  {t('learning.overview.startAssessment')}
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
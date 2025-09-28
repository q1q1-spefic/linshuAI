/**
 * 个性化中医学习评估系统
 * 基于用户健康需求的智能评估问卷
 *
 * @author 刘自强Lucian
 * @date 2025-09-28
 * @copyright All rights reserved by 刘自强Lucian
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Radio,
  Button,
  Progress,
  Typography,
  Space,
  Alert,
  Divider,
  Tag,
  Result,
  Checkbox,
  Input
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './LearningAssessment.css';

const { Title, Paragraph, Text } = Typography;

// 个性化需求评估问题库 - 刘自强Lucian 2025-09-28
const assessmentQuestions = [
  {
    id: 1,
    category: '健康需求',
    type: 'multiple_choice',
    question: '您最希望通过学习中医改善哪方面的健康问题？（可多选）',
    options: [
      { value: 'sleep', text: '睡眠质量改善（失眠、多梦、睡眠不深）', category: 'sleep_health', icon: '🌙' },
      { value: 'immunity', text: '增强体质抵抗力（容易感冒、体质虚弱）', category: 'immunity_health', icon: '💪' },
      { value: 'digestion', text: '消化系统调理（胃痛、便秘、食欲不振）', category: 'digestive_health', icon: '🥗' },
      { value: 'emotion', text: '情绪调节管理（焦虑、抑郁、压力大）', category: 'mental_health', icon: '😌' },
      { value: 'beauty', text: '美容养颜抗衰（皮肤问题、延缓衰老）', category: 'beauty_health', icon: '✨' },
      { value: 'pain', text: '疼痛缓解改善（颈椎、腰椎、关节疼痛）', category: 'pain_management', icon: '🦴' },
      { value: 'weight', text: '体重管理塑身（减肥、体型调整）', category: 'weight_management', icon: '⚖️' },
      { value: 'women', text: '女性健康调理（月经不调、更年期症状）', category: 'womens_health', icon: '🌸' }
    ],
    multiSelect: true,
    description: '请选择您最关心的健康问题，我们将为您定制相应的学习内容'
  },
  {
    id: 2,
    category: '基础水平',
    question: '您对中医的了解程度如何？',
    options: [
      { value: 'A', text: '完全不了解，第一次接触中医知识', level: 'beginner' },
      { value: 'B', text: '听说过一些，但没有系统学习过', level: 'basic' },
      { value: 'C', text: '读过相关书籍，有一定基础了解', level: 'intermediate' },
      { value: 'D', text: '有较深入的学习或实践经验', level: 'advanced' }
    ],
    description: '帮助我们了解您的中医知识基础，制定合适的学习起点'
  },
  {
    id: 3,
    category: '学习目标',
    question: '您希望学习中医知识主要用于？',
    options: [
      { value: 'A', text: '个人日常保健，了解基本养生方法', level: 'basic', focus: 'self_care' },
      { value: 'B', text: '家庭健康管理，帮助家人调理身体', level: 'intermediate', focus: 'family_care' },
      { value: 'C', text: '深入理解中医理论，提升专业能力', level: 'advanced', focus: 'professional' },
      { value: 'D', text: '结合现代医学，综合健康管理', level: 'advanced', focus: 'integrated' }
    ],
    description: '明确学习目标有助于我们推荐最适合的内容深度'
  },
  {
    id: 4,
    category: '学习偏好',
    question: '您更喜欢哪种学习方式？',
    options: [
      { value: 'A', text: '实用技巧为主，快速上手应用', style: 'practical' },
      { value: 'B', text: '理论基础扎实，系统性学习', style: 'theoretical' },
      { value: 'C', text: '案例分析结合，理论实践并重', style: 'balanced' },
      { value: 'D', text: '互动体验式，边学边练', style: 'interactive' }
    ],
    description: '我们将根据您的偏好调整内容呈现方式'
  },
  {
    id: 5,
    category: '时间规划',
    question: '您计划每周投入多少时间学习中医？',
    options: [
      { value: 'A', text: '1-2小时，业余时间了解', intensity: 'light' },
      { value: 'B', text: '3-5小时，认真系统学习', intensity: 'moderate' },
      { value: 'C', text: '6-10小时，深入研究学习', intensity: 'intensive' },
      { value: 'D', text: '10小时以上，专业深度学习', intensity: 'professional' }
    ],
    description: '合理的时间规划能让学习更高效'
  },
  {
    id: 6,
    category: '个人情况',
    type: 'text_input',
    question: '请简单描述您的身体状况或特别关心的健康问题（可选）',
    placeholder: '例如：经常熬夜导致睡眠不好，工作压力大容易焦虑，希望学习一些中医调理方法...',
    optional: true,
    description: '这将帮助我们提供更个性化的学习建议'
  }
];

const LearningAssessment = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(assessmentQuestions[0]?.multiSelect ? [] : null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5分钟
  const [isStarted, setIsStarted] = useState(false);

  // 计时器
  useEffect(() => {
    let timer;
    if (isStarted && timeRemaining > 0 && !isCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleCompleteAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isStarted, timeRemaining, isCompleted]);

  // 开始评估
  const handleStartAssessment = () => {
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(assessmentQuestions[0]?.multiSelect ? [] : null);
    setTimeRemaining(300);
  };

  // 选择答案 - 刘自强Lucian 2025-09-28
  const handleAnswerSelect = (value) => {
    const question = assessmentQuestions[currentQuestion];

    if (question.multiSelect) {
      // 多选题处理
      const currentAnswers = selectedOption || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(item => item !== value)
        : [...currentAnswers, value];
      setSelectedOption(newAnswers);
    } else {
      // 单选题处理
      setSelectedOption(value);
    }
  };

  // 处理文本输入 - 刘自强Lucian 2025-09-28
  const handleTextInput = (e) => {
    setSelectedOption(e.target.value);
  };

  // 下一题 - 刘自强Lucian 2025-09-28
  const handleNextQuestion = () => {
    const question = assessmentQuestions[currentQuestion];
    const canProceed = question.optional ||
                      (question.multiSelect && selectedOption?.length > 0) ||
                      (!question.multiSelect && selectedOption);

    if (canProceed) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));

      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        // 设置下一题的初始值
        const nextQuestion = assessmentQuestions[currentQuestion + 1];
        if (nextQuestion.multiSelect) {
          setSelectedOption([]);
        } else {
          setSelectedOption(null);
        }
      } else {
        handleCompleteAssessment();
      }
    }
  };

  // 上一题
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    }
  };

  // 完成评估
  const handleCompleteAssessment = () => {
    const finalAnswers = selectedOption 
      ? { ...answers, [currentQuestion]: selectedOption }
      : answers;
    
    const result = calculateAssessmentResult(finalAnswers);
    setAssessmentResult(result);
    setIsCompleted(true);
    
    if (onComplete) {
      onComplete(result);
    }
  };

  // 计算评估结果 - 个性化需求分析算法 - 刘自强Lucian 2025-09-28
  const calculateAssessmentResult = (userAnswers) => {
    // 分析健康需求
    const healthNeeds = userAnswers[0] || [];

    // 分析基础水平
    const basicLevelAnswer = userAnswers[1];
    const basicLevelOption = assessmentQuestions[1].options.find(opt => opt.value === basicLevelAnswer);
    const level = basicLevelOption?.level || 'beginner';

    // 分析学习目标
    const learningGoalAnswer = userAnswers[2];
    const learningGoalOption = assessmentQuestions[2].options.find(opt => opt.value === learningGoalAnswer);

    // 分析学习偏好
    const learningStyleAnswer = userAnswers[3];
    const learningStyleOption = assessmentQuestions[3].options.find(opt => opt.value === learningStyleAnswer);

    // 分析时间投入
    const timeIntensityAnswer = userAnswers[4];
    const timeIntensityOption = assessmentQuestions[4].options.find(opt => opt.value === timeIntensityAnswer);

    // 个人描述
    const personalDescription = userAnswers[5] || '';

    // 根据健康需求生成个性化推荐 - 刘自强Lucian 2025-09-28
    const generateHealthRecommendations = (needs) => {
      const needsMap = {
        'sleep': '学习心神调理、安神方剂和睡前养生法',
        'immunity': '重点学习脾胃调理、肾气充实和体质辨识',
        'digestion': '专注脾胃理论、消化系统调理和食疗方法',
        'emotion': '学习肝气疏泄、情志调节和心理调理技法',
        'beauty': '学习气血调理、美容养颜方剂和抗衰老方法',
        'pain': '重点学习经络理论、穴位按摩和疼痛管理',
        'weight': '学习脾胃运化、湿痰调理和体重管理方法',
        'women': '专注女性生理特点、月经调理和妇科保健'
      };

      return needs.map(need => needsMap[need] || '').filter(Boolean);
    };

    const recommendations = [
      ...generateHealthRecommendations(healthNeeds),
      `根据您的基础水平，建议从${getLevelStartPoint(level)}开始`,
      `采用${getStyleDescription(learningStyleOption?.style)}的学习方式`,
      `每周${getTimeDescription(timeIntensityOption?.intensity)}的学习安排`
    ].filter(Boolean);

    // 生成个性化学习路径建议 - 刘自强Lucian 2025-09-28
    const personalizedPath = generatePersonalizedPath(healthNeeds, level, learningGoalOption?.focus);

    return {
      healthNeeds,
      level,
      learningGoal: learningGoalOption?.focus,
      learningStyle: learningStyleOption?.style,
      timeIntensity: timeIntensityOption?.intensity,
      personalDescription,
      recommendations,
      personalizedPath,
      completionTime: 300 - timeRemaining,
      answers: userAnswers,
      // 为了兼容现有组件，保留这些字段
      score: Math.round(Math.random() * 20 + 80), // 模拟分数
      totalQuestions: assessmentQuestions.length,
      scorePercentage: Math.round(Math.random() * 20 + 80),
    };
  };

  // 获取水平起点描述 - 刘自强Lucian 2025-09-28
  const getLevelStartPoint = (level) => {
    const levelMap = {
      beginner: '中医基础理论和哲学思想',
      basic: '脏腑经络理论的系统学习',
      intermediate: '辨证论治和方剂应用',
      advanced: '经典研读和临床应用'
    };
    return levelMap[level] || '基础理论';
  };

  // 获取学习方式描述 - 刘自强Lucian 2025-09-28
  const getStyleDescription = (style) => {
    const styleMap = {
      practical: '重实践应用',
      theoretical: '重理论基础',
      balanced: '理论实践并重',
      interactive: '互动体验式'
    };
    return styleMap[style] || '综合性';
  };

  // 获取时间强度描述 - 刘自强Lucian 2025-09-28
  const getTimeDescription = (intensity) => {
    const intensityMap = {
      light: '轻松学习',
      moderate: '稳步推进',
      intensive: '深入学习',
      professional: '专业深度学习'
    };
    return intensityMap[intensity] || '适度学习';
  };

  // 生成个性化学习路径 - 核心推荐算法 - 刘自强Lucian 2025-09-28
  const generatePersonalizedPath = (healthNeeds, level, focus) => {
    const pathModules = [];

    // 根据健康需求添加专题模块 - 刘自强Lucian 2025-09-28
    if (healthNeeds.includes('sleep')) {
      pathModules.push('睡眠调理专题');
    }
    if (healthNeeds.includes('immunity')) {
      pathModules.push('体质增强专题');
    }
    if (healthNeeds.includes('digestion')) {
      pathModules.push('脾胃调理专题');
    }
    if (healthNeeds.includes('emotion')) {
      pathModules.push('情志调节专题');
    }

    // 根据基础水平添加基础模块
    if (level === 'beginner') {
      pathModules.unshift('中医哲学基础', '基础理论入门');
    } else if (level === 'basic') {
      pathModules.unshift('脏腑经络理论');
    }

    return pathModules;
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 未开始状态
  if (!isStarted) {
    return (
      <div className="assessment-intro">
        <Card className="intro-card">
          <div className="intro-content">
            <Title level={2}>个性化中医学习评估</Title>
            <Paragraph>
              通过这个全面的个性化评估，我们将了解您的健康需求、学习基础和偏好，
              为您量身定制最适合的中医学习计划。
            </Paragraph>

            <div className="assessment-info">
              <Space direction="vertical" size="middle">
                <div>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                  <Text>评估时间：5分钟</Text>
                </div>
                <div>
                  <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  <Text>题目数量：{assessmentQuestions.length}题</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  <Text>涵盖：健康需求、基础水平、学习偏好、时间规划</Text>
                </div>
              </Space>
            </div>
            
            <Button 
              type="primary" 
              size="large"
              onClick={handleStartAssessment}
              style={{ marginTop: '24px' }}
            >
              开始评估
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 已完成状态
  if (isCompleted && assessmentResult) {
    return (
      <div className="assessment-result">
        <Card>
          <Result
            icon={<TrophyOutlined style={{ color: '#faad14' }} />}
            title="个性化评估完成！"
            subTitle={`学习水平：${getLevelText(assessmentResult.level)} | 已为您制定专属学习计划`}
          />

          <div className="result-details">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 健康需求分析 */}
              <Card size="small" title="您关注的健康领域">
                <Space wrap>
                  {(assessmentResult.healthNeeds || []).map((need) => {
                    const option = assessmentQuestions[0].options.find(opt => opt.value === need);
                    return option ? (
                      <Tag key={need} color="blue" style={{ padding: '4px 8px' }}>
                        <span style={{ marginRight: 4 }}>{option.icon}</span>
                        {option.text.split('（')[0]}
                      </Tag>
                    ) : null;
                  })}
                </Space>
                {(!assessmentResult.healthNeeds || assessmentResult.healthNeeds.length === 0) && (
                  <Text type="secondary">未选择特定健康关注领域</Text>
                )}
              </Card>

              {/* 学习特征分析 */}
              <Card size="small" title="学习特征分析">
                <div className="learning-profile">
                  <div className="profile-item" style={{ marginBottom: 8 }}>
                    <Text strong>基础水平：</Text>
                    <Tag color="green">{getLevelText(assessmentResult.level)}</Tag>
                  </div>
                  {assessmentResult.learningGoal && (
                    <div className="profile-item" style={{ marginBottom: 8 }}>
                      <Text strong>学习目标：</Text>
                      <Tag color="blue">{getGoalText(assessmentResult.learningGoal)}</Tag>
                    </div>
                  )}
                  {assessmentResult.learningStyle && (
                    <div className="profile-item" style={{ marginBottom: 8 }}>
                      <Text strong>学习偏好：</Text>
                      <Tag color="orange">{getStyleText(assessmentResult.learningStyle)}</Tag>
                    </div>
                  )}
                  {assessmentResult.timeIntensity && (
                    <div className="profile-item" style={{ marginBottom: 8 }}>
                      <Text strong>时间投入：</Text>
                      <Tag color="purple">{getIntensityText(assessmentResult.timeIntensity)}</Tag>
                    </div>
                  )}
                </div>
              </Card>

              {/* 个性化学习路径 */}
              {assessmentResult.personalizedPath && assessmentResult.personalizedPath.length > 0 && (
                <Card size="small" title="为您推荐的学习路径">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {assessmentResult.personalizedPath.map((module, index) => (
                      <div key={index} className="path-module">
                        <Text>
                          <span style={{
                            color: '#1677ff',
                            fontWeight: 'bold',
                            marginRight: 8
                          }}>
                            {index + 1}.
                          </span>
                          {module}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              )}

              {/* 个人描述 */}
              {assessmentResult.personalDescription && (
                <Card size="small" title="您的个人情况">
                  <Paragraph>{assessmentResult.personalDescription}</Paragraph>
                </Card>
              )}

              {/* 学习建议 */}
              <Card size="small" title="个性化学习建议">
                <ul className="recommendations">
                  {assessmentResult.recommendations.map((rec, index) => (
                    <li key={index}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  // 评估进行中
  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <div className="assessment-container">
      {/* 进度头部 */}
      <Card className="assessment-header" size="small">
        <div className="header-content">
          <div className="progress-info">
            <Text strong>
              第 {currentQuestion + 1} 题 / 共 {assessmentQuestions.length} 题
            </Text>
            <Progress 
              percent={progress} 
              showInfo={false} 
              size="small"
              style={{ marginTop: 8 }}
            />
          </div>
          <div className="time-info">
            <Text type={timeRemaining < 60 ? 'danger' : 'secondary'}>
              剩余时间：{formatTime(timeRemaining)}
            </Text>
          </div>
        </div>
      </Card>

      {/* 题目内容 */}
      <Card className="question-card">
        <div className="question-header">
          <Tag color="blue">{question.category}</Tag>
        </div>
        
        <Title level={3} className="question-text">
          {question.question}
        </Title>

        {question.description && (
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            {question.description}
          </Paragraph>
        )}

        {question.type === 'text_input' ? (
          <Input.TextArea
            value={selectedOption || ''}
            onChange={handleTextInput}
            placeholder={question.placeholder}
            rows={4}
            style={{ marginBottom: 16 }}
          />
        ) : question.multiSelect ? (
          <Checkbox.Group
            value={selectedOption || []}
            onChange={(values) => setSelectedOption(values)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {question.options.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  className="option-checkbox"
                >
                  <div className="option-content">
                    <Text>
                      {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
                      {option.text}
                    </Text>
                  </div>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        ) : (
          <Radio.Group
            value={selectedOption}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {question.options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className="option-radio"
                >
                  <div className="option-content">
                    <Text>{option.text}</Text>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Card>

      {/* 操作按钮 */}
      <Card className="assessment-actions" size="small">
        <div className="action-buttons">
          <Button 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          
          <Space>
            <Button onClick={handleCompleteAssessment}>
              提交评估
            </Button>
            <Button
              type="primary"
              onClick={handleNextQuestion}
              disabled={
                !assessmentQuestions[currentQuestion].optional &&
                (!selectedOption ||
                 (assessmentQuestions[currentQuestion].multiSelect && selectedOption.length === 0))
              }
            >
              {currentQuestion === assessmentQuestions.length - 1 ? '完成评估' : '下一题'}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

// 获取水平文本 - 刘自强Lucian 2025-09-28
const getLevelText = (level) => {
  const levelMap = {
    beginner: '入门级',
    basic: '基础级',
    intermediate: '进阶级',
    advanced: '高级'
  };
  return levelMap[level] || level;
};

// 获取学习目标文本 - 刘自强Lucian 2025-09-28
const getGoalText = (goal) => {
  const goalMap = {
    self_care: '个人保健',
    family_care: '家庭健康',
    professional: '专业能力',
    integrated: '综合管理'
  };
  return goalMap[goal] || goal;
};

// 获取学习方式文本 - 刘自强Lucian 2025-09-28
const getStyleText = (style) => {
  const styleMap = {
    practical: '实用应用',
    theoretical: '理论基础',
    balanced: '理论实践并重',
    interactive: '互动体验'
  };
  return styleMap[style] || style;
};

// 获取时间强度文本 - 刘自强Lucian 2025-09-28
const getIntensityText = (intensity) => {
  const intensityMap = {
    light: '轻松学习（1-2小时/周）',
    moderate: '稳步推进（3-5小时/周）',
    intensive: '深入学习（6-10小时/周）',
    professional: '专业学习（10+小时/周）'
  };
  return intensityMap[intensity] || intensity;
};

export default LearningAssessment;
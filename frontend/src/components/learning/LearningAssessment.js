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
  Result
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../hooks/useLanguage';
import './LearningAssessment.css';

const { Title, Paragraph, Text } = Typography;

// 评估问题库
const assessmentQuestions = [
  {
    id: 1,
    category: '基础理论',
    question: '中医学的哲学基础主要包括哪些内容？',
    options: [
      { value: 'A', text: '阴阳学说、五行学说', level: 'basic' },
      { value: 'B', text: '阴阳学说、五行学说、藏象学说', level: 'intermediate' },
      { value: 'C', text: '阴阳学说、五行学说、藏象学说、经络学说、病因病机学说', level: 'advanced' },
      { value: 'D', text: '只有阴阳学说', level: 'beginner' }
    ],
    correctAnswer: 'C',
    explanation: '中医学的哲学基础包括阴阳学说、五行学说等，同时藏象、经络、病因病机等也是重要的理论基础。'
  },
  {
    id: 2,
    category: '脏腑理论',
    question: '"肝主疏泄"的主要功能表现在哪些方面？',
    options: [
      { value: 'A', text: '只调节情志', level: 'beginner' },
      { value: 'B', text: '调节情志、促进消化', level: 'basic' },
      { value: 'C', text: '调节情志、促进消化、调节生殖', level: 'intermediate' },
      { value: 'D', text: '调节情志、促进消化、调节生殖、维持气血运行', level: 'advanced' }
    ],
    correctAnswer: 'D',
    explanation: '肝主疏泄功能广泛，包括调节情志、促进脾胃消化、调节生殖功能、维持全身气血运行等。'
  },
  {
    id: 3,
    category: '诊断学',
    question: '中医四诊中最重要的诊法是？',
    options: [
      { value: 'A', text: '望诊', level: 'basic' },
      { value: 'B', text: '切诊', level: 'basic' },
      { value: 'C', text: '问诊', level: 'basic' },
      { value: 'D', text: '四诊合参，各有重要性', level: 'advanced' }
    ],
    correctAnswer: 'D',
    explanation: '中医强调四诊合参，每种诊法都有其独特价值，需要综合运用才能得出准确诊断。'
  },
  {
    id: 4,
    category: '方剂学',
    question: '四君子汤的主要功效是？',
    options: [
      { value: 'A', text: '疏肝理气', level: 'basic' },
      { value: 'B', text: '健脾益气', level: 'intermediate' },
      { value: 'C', text: '滋阴润燥', level: 'basic' },
      { value: 'D', text: '活血化瘀', level: 'basic' }
    ],
    correctAnswer: 'B',
    explanation: '四君子汤由人参、白术、茯苓、甘草组成，是健脾益气的代表方剂。'
  },
  {
    id: 5,
    category: '病因病机',
    question: '中医认为疾病发生的根本原因是？',
    options: [
      { value: 'A', text: '外邪入侵', level: 'beginner' },
      { value: 'B', text: '情志内伤', level: 'beginner' },
      { value: 'C', text: '正气不足', level: 'basic' },
      { value: 'D', text: '正气与邪气的相对关系失衡', level: 'advanced' }
    ],
    correctAnswer: 'D',
    explanation: '中医认为"正气存内，邪不可干"，疾病的发生是正气与邪气相互作用的结果。'
  },
  {
    id: 6,
    category: '经络学说',
    question: '十二经脉的流注顺序是？',
    options: [
      { value: 'A', text: '手三阴→足三阴→手三阳→足三阳', level: 'basic' },
      { value: 'B', text: '手三阴→手三阳→足三阳→足三阴', level: 'intermediate' },
      { value: 'C', text: '随机流注，无固定顺序', level: 'beginner' },
      { value: 'D', text: '足三阳→足三阴→手三阳→手三阴', level: 'basic' }
    ],
    correctAnswer: 'B',
    explanation: '十二经脉按照"手三阴→手三阳→足三阳→足三阴"的顺序循环流注。'
  }
];

const LearningAssessment = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
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
    setSelectedOption(null);
    setTimeRemaining(300);
  };

  // 选择答案
  const handleAnswerSelect = (value) => {
    setSelectedOption(value);
  };

  // 下一题
  const handleNextQuestion = () => {
    if (selectedOption) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));
      
      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
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

  // 计算评估结果
  const calculateAssessmentResult = (userAnswers) => {
    let score = 0;
    let categoryScores = {};
    let levelDistribution = { beginner: 0, basic: 0, intermediate: 0, advanced: 0 };
    
    assessmentQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += 1;
      }
      
      // 计算分类得分
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 };
      }
      categoryScores[question.category].total += 1;
      if (isCorrect) {
        categoryScores[question.category].correct += 1;
      }
      
      // 分析选择的选项级别
      if (userAnswer) {
        const selectedOption = question.options.find(opt => opt.value === userAnswer);
        if (selectedOption) {
          levelDistribution[selectedOption.level] += 1;
        }
      }
    });
    
    // 判断整体水平
    const scorePercentage = (score / assessmentQuestions.length) * 100;
    let level;
    let recommendations = [];
    
    if (scorePercentage >= 80) {
      level = 'advanced';
      recommendations = [
        t('learning.assessment.recommendations.advanced.deepStudy'),
        t('learning.assessment.recommendations.advanced.clinicalCases'),
        t('learning.assessment.recommendations.advanced.complexAnalysis')
      ];
    } else if (scorePercentage >= 60) {
      level = 'intermediate';
      recommendations = [
        t('learning.assessment.recommendations.intermediate.consolidate'),
        t('learning.assessment.recommendations.intermediate.strengthen'),
        t('learning.assessment.recommendations.intermediate.practice')
      ];
    } else if (scorePercentage >= 40) {
      level = 'basic';
      recommendations = [
        t('learning.assessment.recommendations.basic.focusBasics'),
        t('learning.assessment.recommendations.basic.systematicStudy'),
        t('learning.assessment.recommendations.basic.readMaterials')
      ];
    } else {
      level = 'beginner';
      recommendations = [
        t('learning.assessment.recommendations.beginner.startPhilosophy'),
        t('learning.assessment.recommendations.beginner.chooseBooks'),
        t('learning.assessment.recommendations.beginner.watchVideos')
      ];
    }
    
    return {
      score,
      totalQuestions: assessmentQuestions.length,
      scorePercentage: Math.round(scorePercentage),
      level,
      categoryScores,
      recommendations,
      completionTime: 300 - timeRemaining,
      answers: userAnswers
    };
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
            <Title level={2}>{t('learning.assessment.title')}</Title>
            <Paragraph>
              {t('learning.assessment.description')}
            </Paragraph>
            
            <div className="assessment-info">
              <Space direction="vertical" size="middle">
                <div>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                  <Text>{t('learning.assessment.timeEstimate')}</Text>
                </div>
                <div>
                  <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  <Text>{t('learning.assessment.questionCount')}: {assessmentQuestions.length}</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  <Text>{t('learning.assessment.coverage')}</Text>
                </div>
              </Space>
            </div>
            
            <Button 
              type="primary" 
              size="large"
              onClick={handleStartAssessment}
              style={{ marginTop: '24px' }}
            >
              {t('learning.assessment.startButton')}
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
            title={t('learning.assessment.completed')}
            subTitle={`${t('learning.assessment.yourLevel')}: ${getLevelText(assessmentResult.level, t)}`}
          />
          
          <div className="result-details">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 总体得分 */}
              <Card size="small" title={t('learning.assessment.overallScore')}>
                <div className="score-display">
                  <Progress
                    type="circle"
                    percent={assessmentResult.scorePercentage}
                    format={() => `${assessmentResult.score}/${assessmentResult.totalQuestions}`}
                    size={120}
                  />
                  <div className="score-info">
                    <Title level={3}>{assessmentResult.scorePercentage}分</Title>
                    <Text type="secondary">
                      {t('learning.assessment.timeUsed')}: {formatTime(assessmentResult.completionTime)}
                    </Text>
                  </div>
                </div>
              </Card>
              
              {/* 分类得分 */}
              <Card size="small" title={t('learning.assessment.moduleScores')}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {Object.entries(assessmentResult.categoryScores).map(([category, scores]) => (
                    <div key={category} className="category-score">
                      <div className="category-header">
                        <Text strong>{category}</Text>
                        <Tag color={scores.correct / scores.total >= 0.8 ? 'green' : 
                               scores.correct / scores.total >= 0.6 ? 'orange' : 'red'}>
                          {scores.correct}/{scores.total}
                        </Tag>
                      </div>
                      <Progress
                        percent={Math.round((scores.correct / scores.total) * 100)}
                        size="small"
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
              
              {/* 学习建议 */}
              <Card size="small" title={t('learning.assessment.suggestions')}>
                <ul className="recommendations">
                  {getLocalizedRecommendations(assessmentResult.level, t).map((rec, index) => (
                    <li key={index}>{rec}</li>
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
              {t('learning.assessment.questionProgress').replace('{current}', currentQuestion + 1).replace('{total}', assessmentQuestions.length)}
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
              {t('learning.assessment.timeRemaining')}: {formatTime(timeRemaining)}
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
      </Card>

      {/* 操作按钮 */}
      <Card className="assessment-actions" size="small">
        <div className="action-buttons">
          <Button 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            {t('learning.assessment.previousQuestion')}
          </Button>
          
          <Space>
            <Button onClick={handleCompleteAssessment}>
              {t('learning.assessment.submitAssessment')}
            </Button>
            <Button 
              type="primary"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              {currentQuestion === assessmentQuestions.length - 1 ? t('learning.assessment.completeAssessment') : t('learning.assessment.nextQuestion')}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

// 获取水平文本
const getLevelText = (level, t) => {
  return t(`learning.overview.levels.${level}`) || level;
};

// 获取多语言学习建议
const getLocalizedRecommendations = (level, t) => {
  switch (level) {
    case 'advanced':
      return [
        t('learning.assessment.recommendations.advanced.deepStudy'),
        t('learning.assessment.recommendations.advanced.clinicalCases'),
        t('learning.assessment.recommendations.advanced.complexAnalysis')
      ];
    case 'intermediate':
      return [
        t('learning.assessment.recommendations.intermediate.consolidate'),
        t('learning.assessment.recommendations.intermediate.strengthen'),
        t('learning.assessment.recommendations.intermediate.practice')
      ];
    case 'basic':
      return [
        t('learning.assessment.recommendations.basic.focusBasics'),
        t('learning.assessment.recommendations.basic.systematicStudy'),
        t('learning.assessment.recommendations.basic.readMaterials')
      ];
    case 'beginner':
      return [
        t('learning.assessment.recommendations.beginner.startPhilosophy'),
        t('learning.assessment.recommendations.beginner.chooseBooks'),
        t('learning.assessment.recommendations.beginner.watchVideos')
      ];
    default:
      return [];
  }
};

export default LearningAssessment;
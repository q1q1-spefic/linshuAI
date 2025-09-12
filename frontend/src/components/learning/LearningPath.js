import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Steps, 
  Button, 
  Progress, 
  Typography, 
  Space, 
  Tag,
  Timeline,
  Checkbox,
  Collapse,
  Divider,
  Tooltip,
  Badge,
  Modal,
  List
} from 'antd';
import { 
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  LockOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import './LearningPath.css';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

// 完整的学习路径数据
const learningPaths = {
  beginner: {
    title: '中医入门学习路径',
    description: '从零开始，系统学习中医基础知识',
    duration: '3-6个月',
    totalModules: 5,
    modules: [
      {
        id: 1,
        title: '中医哲学基础',
        description: '了解中医的思维方式和理论基础',
        duration: '2周',
        difficulty: 'easy',
        status: 'available',
        estimatedHours: 20,
        topics: [
          { 
            id: 't1_1',
            name: '阴阳学说', 
            completed: false, 
            duration: '3天',
            description: '学习阴阳的基本概念、特性及在中医中的应用'
          },
          { 
            id: 't1_2',
            name: '五行学说', 
            completed: false, 
            duration: '3天',
            description: '理解五行的相生相克关系及其临床意义'
          },
          { 
            id: 't1_3',
            name: '精气神理论', 
            completed: false, 
            duration: '2天',
            description: '掌握精气神的概念和相互关系'
          },
          { 
            id: 't1_4',
            name: '天人相应', 
            completed: false, 
            duration: '2天',
            description: '理解人体与自然环境的统一性'
          },
          { 
            id: 't1_5',
            name: '整体观念', 
            completed: false, 
            duration: '2天',
            description: '掌握中医整体观念的核心思想'
          }
        ],
        resources: [
          { 
            id: 'r1_1',
            type: 'video', 
            title: '中医哲学基础视频课程', 
            duration: '2小时',
            url: '#',
            completed: false
          },
          { 
            id: 'r1_2',
            type: 'text', 
            title: '中医基础理论教材第一章', 
            pages: '30页',
            url: '#',
            completed: false
          },
          { 
            id: 'r1_3',
            type: 'quiz', 
            title: '阴阳五行理论测试', 
            questions: 10,
            url: '#',
            completed: false
          }
        ],
        prerequisites: [],
        learningObjectives: [
          '理解阴阳五行的基本概念',
          '掌握精气神理论',
          '建立中医整体观念思维'
        ]
      },
      {
        id: 2,
        title: '藏象学说',
        description: '学习五脏六腑的生理功能和相互关系',
        duration: '4周',
        difficulty: 'medium',
        status: 'locked',
        estimatedHours: 35,
        topics: [
          { 
            id: 't2_1',
            name: '心的生理功能', 
            completed: false, 
            duration: '3天',
            description: '学习心主血脉、藏神等功能'
          },
          { 
            id: 't2_2',
            name: '肝的生理功能', 
            completed: false, 
            duration: '3天',
            description: '掌握肝主疏泄、藏血等功能'
          },
          { 
            id: 't2_3',
            name: '脾的生理功能', 
            completed: false, 
            duration: '3天',
            description: '理解脾主运化、统血等功能'
          },
          { 
            id: 't2_4',
            name: '肺的生理功能', 
            completed: false, 
            duration: '3天',
            description: '学习肺主气、司呼吸等功能'
          },
          { 
            id: 't2_5',
            name: '肾的生理功能', 
            completed: false, 
            duration: '3天',
            description: '掌握肾主藏精、主水等功能'
          },
          { 
            id: 't2_6',
            name: '六腑功能', 
            completed: false, 
            duration: '4天',
            description: '了解六腑的生理特点和功能'
          },
          { 
            id: 't2_7',
            name: '脏腑相关理论', 
            completed: false, 
            duration: '3天',
            description: '理解脏腑间的相互关系'
          }
        ],
        resources: [
          { 
            id: 'r2_1',
            type: 'video', 
            title: '脏腑学说详解', 
            duration: '4小时',
            url: '#',
            completed: false
          },
          { 
            id: 'r2_2',
            type: 'text', 
            title: '藏象学说专题', 
            pages: '80页',
            url: '#',
            completed: false
          },
          { 
            id: 'r2_3',
            type: 'practice', 
            title: '脏腑功能配对练习', 
            exercises: 20,
            url: '#',
            completed: false
          }
        ],
        prerequisites: ['中医哲学基础'],
        learningObjectives: [
          '掌握五脏六腑的基本功能',
          '理解脏腑间的相互关系',
          '建立藏象学说思维框架'
        ]
      },
      {
        id: 3,
        title: '经络学说',
        description: '了解经络系统和穴位基础',
        duration: '3周',
        difficulty: 'medium',
        status: 'locked',
        estimatedHours: 30,
        topics: [
          { 
            id: 't3_1',
            name: '经络系统概述', 
            completed: false, 
            duration: '2天',
            description: '了解经络的概念和分类'
          },
          { 
            id: 't3_2',
            name: '十二经脉', 
            completed: false, 
            duration: '5天',
            description: '学习十二经脉的循行和功能'
          },
          { 
            id: 't3_3',
            name: '奇经八脉', 
            completed: false, 
            duration: '3天',
            description: '掌握奇经八脉的特点'
          },
          { 
            id: 't3_4',
            name: '经络循行', 
            completed: false, 
            duration: '4天',
            description: '理解经络的循行规律'
          },
          { 
            id: 't3_5',
            name: '常用穴位', 
            completed: false, 
            duration: '7天',
            description: '掌握常用穴位的定位和功能'
          }
        ],
        resources: [
          { 
            id: 'r3_1',
            type: 'video', 
            title: '经络学说基础', 
            duration: '3小时',
            url: '#',
            completed: false
          },
          { 
            id: 'r3_2',
            type: 'interactive', 
            title: '穴位定位练习', 
            exercises: 50,
            url: '#',
            completed: false
          }
        ],
        prerequisites: ['藏象学说'],
        learningObjectives: [
          '理解经络系统的组成',
          '掌握主要经络的循行',
          '熟悉常用穴位'
        ]
      },
      {
        id: 4,
        title: '病因病机',
        description: '学习疾病的发生发展规律',
        duration: '3周',
        difficulty: 'medium',
        status: 'locked',
        estimatedHours: 28,
        topics: [
          { 
            id: 't4_1',
            name: '外感病因', 
            completed: false, 
            duration: '3天',
            description: '学习六淫、疫疠等外感病因'
          },
          { 
            id: 't4_2',
            name: '内伤病因', 
            completed: false, 
            duration: '3天',
            description: '掌握七情内伤、饮食劳倦等'
          },
          { 
            id: 't4_3',
            name: '病理产物', 
            completed: false, 
            duration: '3天',
            description: '理解痰饮、瘀血等病理产物'
          },
          { 
            id: 't4_4',
            name: '发病机理', 
            completed: false, 
            duration: '4天',
            description: '掌握正邪相争的发病机理'
          },
          { 
            id: 't4_5',
            name: '病机变化', 
            completed: false, 
            duration: '8天',
            description: '理解疾病的传变规律'
          }
        ],
        resources: [
          { 
            id: 'r4_1',
            type: 'text', 
            title: '病因病机学专论', 
            pages: '60页',
            url: '#',
            completed: false
          },
          { 
            id: 'r4_2',
            type: 'case', 
            title: '病机分析案例', 
            cases: 15,
            url: '#',
            completed: false
          }
        ],
        prerequisites: ['经络学说'],
        learningObjectives: [
          '掌握中医病因分类',
          '理解发病机理',
          '学会病机分析方法'
        ]
      },
      {
        id: 5,
        title: '诊断基础',
        description: '掌握中医四诊方法',
        duration: '4周',
        difficulty: 'hard',
        status: 'locked',
        estimatedHours: 40,
        topics: [
          { 
            id: 't5_1',
            name: '望诊基础', 
            completed: false, 
            duration: '4天',
            description: '学习望神、色、形、态的方法'
          },
          { 
            id: 't5_2',
            name: '舌诊详解', 
            completed: false, 
            duration: '5天',
            description: '掌握舌质舌苔的诊察要点'
          },
          { 
            id: 't5_3',
            name: '闻诊要点', 
            completed: false, 
            duration: '2天',
            description: '学习听声音、嗅气味的方法'
          },
          { 
            id: 't5_4',
            name: '问诊技巧', 
            completed: false, 
            duration: '3天',
            description: '掌握问诊的内容和技巧'
          },
          { 
            id: 't5_5',
            name: '脉诊入门', 
            completed: false, 
            duration: '8天',
            description: '学习脉象的诊察方法'
          },
          { 
            id: 't5_6',
            name: '按诊方法', 
            completed: false, 
            duration: '3天',
            description: '掌握按诊的手法和要点'
          },
          { 
            id: 't5_7',
            name: '四诊合参', 
            completed: false, 
            duration: '3天',
            description: '学习综合运用四诊的方法'
          }
        ],
        resources: [
          { 
            id: 'r5_1',
            type: 'video', 
            title: '四诊法实操演示', 
            duration: '5小时',
            url: '#',
            completed: false
          },
          { 
            id: 'r5_2',
            type: 'simulation', 
            title: '诊断模拟练习', 
            cases: 30,
            url: '#',
            completed: false
          }
        ],
        prerequisites: ['病因病机'],
        learningObjectives: [
          '掌握四诊的基本方法',
          '学会四诊合参',
          '具备基本诊断能力'
        ]
      }
    ]
  },
  
  intermediate: {
    title: '中医进阶学习路径',
    description: '深入学习中医理论和实践应用',
    duration: '6-12个月',
    totalModules: 6,
    modules: [
      {
        id: 1,
        title: '辨证论治',
        description: '掌握中医核心思维方法',
        duration: '6周',
        difficulty: 'hard',
        status: 'available',
        estimatedHours: 50,
        topics: [
          { 
            id: 't1_1',
            name: '八纲辨证', 
            completed: false, 
            duration: '5天',
            description: '掌握表里、寒热、虚实、阴阳辨证'
          },
          { 
            id: 't1_2',
            name: '脏腑辨证', 
            completed: false, 
            duration: '10天',
            description: '学习各脏腑的病证辨别'
          },
          { 
            id: 't1_3',
            name: '六经辨证', 
            completed: false, 
            duration: '8天',
            description: '理解《伤寒论》六经辨证体系'
          },
          { 
            id: 't1_4',
            name: '卫气营血辨证', 
            completed: false, 
            duration: '5天',
            description: '掌握温病辨证方法'
          }
        ],
        prerequisites: ['诊断基础'],
        learningObjectives: [
          '掌握各种辨证方法',
          '建立辨证思维',
          '能够进行综合辨证'
        ]
      },
      {
        id: 2,
        title: '方剂学基础',
        description: '学习常用方剂的组成和应用',
        duration: '8周',
        difficulty: 'hard',
        status: 'locked',
        estimatedHours: 60,
        topics: [
          { 
            id: 't2_1',
            name: '方剂学总论', 
            completed: false, 
            duration: '3天',
            description: '了解方剂的组成原则'
          },
          { 
            id: 't2_2',
            name: '解表剂', 
            completed: false, 
            duration: '5天',
            description: '学习麻黄汤、桂枝汤等'
          },
          { 
            id: 't2_3',
            name: '泻下剂', 
            completed: false, 
            duration: '4天',
            description: '掌握大承气汤等方剂'
          },
          { 
            id: 't2_4',
            name: '补益剂', 
            completed: false, 
            duration: '6天',
            description: '学习四君子汤、四物汤等'
          }
        ],
        prerequisites: ['辨证论治'],
        learningObjectives: [
          '掌握方剂组成规律',
          '熟悉常用方剂',
          '学会方剂加减化裁'
        ]
      }
    ]
  },

  advanced: {
    title: '中医高级学习路径',
    description: '深入研究中医经典和临床应用',
    duration: '12-18个月',
    totalModules: 8,
    modules: [
      {
        id: 1,
        title: '经典研读',
        description: '深入学习《黄帝内经》、《伤寒论》等经典',
        duration: '12周',
        difficulty: 'expert',
        status: 'available',
        estimatedHours: 120,
        topics: [
          { 
            id: 't1_1',
            name: '《黄帝内经》研读', 
            completed: false, 
            duration: '4周',
            description: '深入理解中医理论源头'
          },
          { 
            id: 't1_2',
            name: '《伤寒论》研读', 
            completed: false, 
            duration: '4周',
            description: '掌握辨证论治精髓'
          },
          { 
            id: 't1_3',
            name: '《金匮要略》研读', 
            completed: false, 
            duration: '4周',
            description: '学习杂病治疗方法'
          }
        ],
        prerequisites: ['方剂学基础'],
        learningObjectives: [
          '深入理解中医经典',
          '掌握经典理论精髓',
          '提升理论水平'
        ]
      }
    ]
  }
};

const LearningPath = ({ userLevel = 'beginner', assessmentResult }) => {
  const [currentPath, setCurrentPath] = useState(learningPaths[userLevel]);
  const [activeModule, setActiveModule] = useState(0);
  const [userProgress, setUserProgress] = useState({});
  const [expandedPanels, setExpandedPanels] = useState(['1']);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    if (userLevel && learningPaths[userLevel]) {
      setCurrentPath(learningPaths[userLevel]);
      // 加载用户进度
      loadUserProgress();
    }
  }, [userLevel]);

  // 加载用户进度
  const loadUserProgress = () => {
    const savedProgress = localStorage.getItem(`tcm_learning_progress_${userLevel}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        // 更新路径数据
        updatePathWithProgress(progress);
      } catch (error) {
        console.error('加载学习进度失败:', error);
      }
    }
  };

  // 更新路径数据
  const updatePathWithProgress = (progress) => {
    const updatedPath = { ...currentPath };
    updatedPath.modules.forEach((module, moduleIndex) => {
      if (module.topics) {
        module.topics.forEach((topic, topicIndex) => {
          const progressKey = `${moduleIndex}_${topicIndex}`;
          if (progress.topics && progress.topics[progressKey]) {
            topic.completed = progress.topics[progressKey];
          }
        });
      }
      if (module.resources) {
        module.resources.forEach((resource, resourceIndex) => {
          const progressKey = `${moduleIndex}_${resourceIndex}`;
          if (progress.resources && progress.resources[progressKey]) {
            resource.completed = progress.resources[progressKey];
          }
        });
      }
    });
    setCurrentPath(updatedPath);
  };

  // 保存用户进度
  const saveUserProgress = (newProgress) => {
    const mergedProgress = { ...userProgress, ...newProgress };
    setUserProgress(mergedProgress);
    localStorage.setItem(`tcm_learning_progress_${userLevel}`, JSON.stringify(mergedProgress));
  };

  // 计算总体进度
  const calculateOverallProgress = () => {
    const totalTopics = currentPath.modules.reduce((sum, module) => 
      sum + (module.topics ? module.topics.length : 0), 0
    );
    const completedTopics = currentPath.modules.reduce((sum, module) => 
      sum + (module.topics ? module.topics.filter(topic => topic.completed).length : 0), 0
    );
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  // 计算模块进度
  const calculateModuleProgress = (module) => {
    if (!module.topics) return 0;
    const completed = module.topics.filter(topic => topic.completed).length;
    return Math.round((completed / module.topics.length) * 100);
  };

  // 获取模块状态
  const getModuleStatus = (moduleIndex) => {
    if (moduleIndex === 0) return 'available';
    const prevModule = currentPath.modules[moduleIndex - 1];
    const prevProgress = calculateModuleProgress(prevModule);
    return prevProgress >= 80 ? 'available' : 'locked';
  };

  // 切换话题完成状态
  const toggleTopicCompletion = (moduleIndex, topicIndex) => {
    const newPath = { ...currentPath };
    const topic = newPath.modules[moduleIndex].topics[topicIndex];
    topic.completed = !topic.completed;
    setCurrentPath(newPath);
    
    // 保存进度
    const progressKey = `${moduleIndex}_${topicIndex}`;
    const newProgress = {
      topics: {
        ...userProgress.topics,
        [progressKey]: topic.completed
      }
    };
    saveUserProgress(newProgress);
  };

  // 切换资源完成状态
  const toggleResourceCompletion = (moduleIndex, resourceIndex) => {
    const newPath = { ...currentPath };
    const resource = newPath.modules[moduleIndex].resources[resourceIndex];
    resource.completed = !resource.completed;
    setCurrentPath(newPath);
    
    // 保存进度
    const progressKey = `${moduleIndex}_${resourceIndex}`;
    const newProgress = {
      resources: {
        ...userProgress.resources,
        [progressKey]: resource.completed
      }
    };
    saveUserProgress(newProgress);
  };

  // 开始学习模块
  const startModule = (moduleIndex) => {
    setActiveModule(moduleIndex);
  };

  // 查看资源详情
  const viewResource = (resource) => {
    setSelectedResource(resource);
    setModalVisible(true);
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'green',
      medium: 'orange',
      hard: 'red',
      expert: 'purple'
    };
    return colors[difficulty] || 'blue';
  };

  // 获取难度文本
  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: '简单',
      medium: '中等',
      hard: '困难',
      expert: '专家级'
    };
    return texts[difficulty] || difficulty;
  };

  // 获取资源图标
  const getResourceIcon = (type) => {
    const icons = {
      video: <VideoCameraOutlined />,
      text: <FileTextOutlined />,
      quiz: <QuestionCircleOutlined />,
      practice: <ExperimentOutlined />,
      case: <BookOutlined />,
      interactive: <PlayCircleOutlined />,
      simulation: <ExperimentOutlined />
    };
    return icons[type] || <FileTextOutlined />;
  };

  return (
    <div className="learning-path-container">
      {/* 路径概览 */}
      <Card className="path-overview">
        <div className="overview-header">
          <div className="path-info">
            <Title level={2}>{currentPath.title}</Title>
            <Paragraph>{currentPath.description}</Paragraph>
            <Space>
              <Tag icon={<ClockCircleOutlined />} color="blue">
                预计用时：{currentPath.duration}
              </Tag>
              <Tag icon={<BookOutlined />} color="green">
                {currentPath.modules.length} 个模块
              </Tag>
              <Tag icon={<TrophyOutlined />} color="gold">
                {calculateOverallProgress()}% 完成
              </Tag>
            </Space>
          </div>
          <div className="progress-circle">
            <Progress
              type="circle"
              percent={calculateOverallProgress()}
              format={percent => `${percent}%`}
              size={100}
            />
            <Text type="secondary" style={{ textAlign: 'center', marginTop: 8 }}>
              总体进度
            </Text>
          </div>
        </div>
      </Card>

      {/* 学习路径步骤 */}
      <Card title="学习路径" className="path-steps">
        <Steps
          direction="vertical"
          current={activeModule}
          onChange={setActiveModule}
        >
          {currentPath.modules.map((module, index) => {
            const progress = calculateModuleProgress(module);
            const status = getModuleStatus(index);
            const isLocked = status === 'locked';
            
            return (
              <Step
                key={module.id}
                title={
                  <div className="step-title">
                    <span>{module.title}</span>
                    {isLocked && <LockOutlined style={{ marginLeft: 8, color: '#999' }} />}
                  </div>
                }
                description={
                  <div className="step-description">
                    <Paragraph>{module.description}</Paragraph>
                    <Space wrap>
                      <Tag color={getDifficultyColor(module.difficulty)}>
                        {getDifficultyText(module.difficulty)}
                      </Tag>
                      <Tag icon={<ClockCircleOutlined />}>
                        {module.duration}
                      </Tag>
                      <Tag>
                        预计 {module.estimatedHours} 小时
                      </Tag>
                      {progress > 0 && (
                        <Tag icon={<TrophyOutlined />} color="gold">
                          {progress}% 完成
                        </Tag>
                      )}
                    </Space>
                    <Progress percent={progress} size="small" style={{ marginTop: 8 }} />
                    <div style={{ marginTop: 12 }}>
                      <Button
                        type={index === activeModule ? 'primary' : 'default'}
                        size="small"
                        disabled={isLocked}
                        onClick={() => startModule(index)}
                        icon={<PlayCircleOutlined />}
                      >
                        {progress > 0 ? '继续学习' : '开始学习'}
                      </Button>
                    </div>
                  </div>
                }
                status={isLocked ? 'wait' : progress === 100 ? 'finish' : 'process'}
                icon={isLocked ? <LockOutlined /> : progress === 100 ? <CheckCircleOutlined /> : <BookOutlined />}
              />
            );
          })}
        </Steps>
      </Card>

      {/* 当前模块详情 */}
      {currentPath.modules[activeModule] && (
        <Card title={`模块详情：${currentPath.modules[activeModule].title}`} className="module-details">
          <Collapse 
            activeKey={expandedPanels}
            onChange={setExpandedPanels}
          >
            <Panel header="学习目标" key="0">
              <List
                dataSource={currentPath.modules[activeModule].learningObjectives || []}
                renderItem={(objective, index) => (
                  <List.Item>
                    <Text>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {objective}
                    </Text>
                  </List.Item>
                )}
              />
            </Panel>

            <Panel header="学习内容" key="1">
              {currentPath.modules[activeModule].topics && (
                <div className="topics-list">
                  {currentPath.modules[activeModule].topics.map((topic, index) => (
                    <div key={topic.id} className="topic-item">
                      <Checkbox
                        checked={topic.completed}
                        onChange={() => toggleTopicCompletion(activeModule, index)}
                      >
                        <div className="topic-content">
                          <div>
                            <Text strong={!topic.completed}>{topic.name}</Text>
                            <Text type="secondary" style={{ marginLeft: 16 }}>
                              {topic.duration}
                            </Text>
                          </div>
                          {topic.description && (
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {topic.description}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
            
            <Panel header="学习资源" key="2">
              {currentPath.modules[activeModule].resources && (
                <div className="resources-list">
                  {currentPath.modules[activeModule].resources.map((resource, index) => (
                    <div key={resource.id} className="resource-item">
                      <div className="resource-icon">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="resource-content">
                        <div className="resource-header">
                          <Text strong>{resource.title}</Text>
                          <Checkbox
                            checked={resource.completed}
                            onChange={() => toggleResourceCompletion(activeModule, index)}
                          />
                        </div>
                        <div className="resource-meta">
                          {resource.duration && <Text type="secondary">时长：{resource.duration}</Text>}
                          {resource.pages && <Text type="secondary">页数：{resource.pages}</Text>}
                          {resource.questions && <Text type="secondary">题数：{resource.questions}</Text>}
                          {resource.exercises && <Text type="secondary">练习：{resource.exercises}</Text>}
                          {resource.cases && <Text type="secondary">案例：{resource.cases}</Text>}
                        </div>
                      </div>
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => viewResource(resource)}
                      >
                        查看详情
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {currentPath.modules[activeModule].prerequisites && 
             currentPath.modules[activeModule].prerequisites.length > 0 && (
              <Panel header="前置要求" key="3">
                <Space wrap>
                  {currentPath.modules[activeModule].prerequisites.map((prereq, index) => (
                    <Tag key={index} color="blue">{prereq}</Tag>
                  ))}
                </Space>
              </Panel>
            )}
          </Collapse>
        </Card>
      )}

      {/* 学习建议 */}
      {assessmentResult && (
        <Card title="个性化建议" className="learning-suggestions">
          <Timeline>
            {assessmentResult.recommendations.map((recommendation, index) => (
              <Timeline.Item
                key={index}
                dot={<StarOutlined style={{ fontSize: '16px' }} />}
              >
                {recommendation}
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}

      {/* 学习统计 */}
      <Card title="学习统计" className="learning-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{calculateOverallProgress()}%</div>
            <div className="stat-label">总体进度</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {currentPath.modules.reduce((sum, module) => 
                sum + (module.topics ? module.topics.filter(t => t.completed).length : 0), 0
              )}
            </div>
            <div className="stat-label">已完成话题</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {currentPath.modules.reduce((sum, module) => 
                sum + (module.resources ? module.resources.filter(r => r.completed).length : 0), 0
              )}
            </div>
            <div className="stat-label">已完成资源</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {currentPath.modules.reduce((sum, module) => 
                sum + (module.estimatedHours || 0), 0
              )}h
            </div>
            <div className="stat-label">总学习时长</div>
          </div>
        </div>
      </Card>

      {/* 资源详情模态框 */}
      <Modal
        title={selectedResource?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          <Button key="start" type="primary">
            开始学习
          </Button>
        ]}
      >
        {selectedResource && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>资源类型：</Text>
                <Tag style={{ marginLeft: 8 }}>
                  {getResourceIcon(selectedResource.type)}
                  <span style={{ marginLeft: 4 }}>
                    {selectedResource.type === 'video' && '视频课程'}
                    {selectedResource.type === 'text' && '文本资料'}
                    {selectedResource.type === 'quiz' && '在线测试'}
                    {selectedResource.type === 'practice' && '练习题'}
                    {selectedResource.type === 'case' && '案例分析'}
                    {selectedResource.type === 'interactive' && '交互练习'}
                    {selectedResource.type === 'simulation' && '模拟训练'}
                  </span>
                </Tag>
              </div>
              
              {selectedResource.duration && (
                <div>
                  <Text strong>学习时长：</Text>
                  <Text>{selectedResource.duration}</Text>
                </div>
              )}
              
              {selectedResource.pages && (
                <div>
                  <Text strong>页数：</Text>
                  <Text>{selectedResource.pages}</Text>
                </div>
              )}
              
              {selectedResource.questions && (
                <div>
                  <Text strong>题目数量：</Text>
                  <Text>{selectedResource.questions} 题</Text>
                </div>
              )}
              
              <div>
                <Text strong>学习状态：</Text>
                <Tag color={selectedResource.completed ? 'green' : 'orange'}>
                  {selectedResource.completed ? '已完成' : '未完成'}
                </Tag>
              </div>
              
              <Divider />
              
              <Paragraph>
                这是一个重要的学习资源，建议您认真学习。完成后请记得标记为已完成，
                以便系统跟踪您的学习进度。
              </Paragraph>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LearningPath;
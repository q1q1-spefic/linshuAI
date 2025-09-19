// 中文语言包
export const zh = {
  // 导航
  nav: {
    home: '首页',
    chat: '开始对话',
    graph: '知识图谱',
    learning: '学习路径',
    settings: '设置',
    login: '登录'
  },

  // 首页
  home: {
    title: '中医智慧的 AI 学习伙伴',
    subtitle: '探索传统中医的深度智慧，通过AI驱动的知识图谱、智能问答和个性化学习路径，让古老的医学经典焕发现代活力',
    startExploring: '开始探索',
    learningPath: '学习路径',
    coreFeatures: '核心功能',

    // 功能卡片
    features: {
      chat: {
        title: 'AI 智能问答',
        description: '基于RAG模型的中医知识库，像与真人老师对话一样学习',
        features: [
          '经典古籍深度解读',
          '现代临床指南对比',
          '名家医案分析'
        ]
      },
      graph: {
        title: '知识图谱',
        description: '可视化的中医知识网络，探索概念间的深层关联',
        features: [
          '动态关联径发现',
          '病机传变可视化',
          '整体观念体现'
        ]
      },
      learning: {
        title: '个性化学习',
        description: '智能导师为您规划最适合的学习路径和复习计划',
        features: [
          '能力画像评估',
          '动态路径生成',
          '遗忘曲线优化'
        ]
      }
    },

    // 状态显示
    status: {
      backend: '后端服务',
      connected: '已连接',
      disconnected: '连接失败',
      uptime: '运行时间'
    }
  },

  // 聊天页面
  chat: {
    title: 'AI 智能问答',
    subtitle: '中医学习伙伴',
    quickQuestions: '快速问题',
    quickQuestionsTitle: '快速问题',
    learningTips: '学习提示',
    placeholder: '请输入您的中医问题...',
    sendHint: '按 Enter 发送，Shift + Enter 换行',
    thinking: '正在思考...',
    welcome: '您好！我是您的中医学习伙伴',
    welcomeDesc: '我可以帮您解答中医理论、经典条文、临床应用等各方面的问题。请问您想了解什么？',
    tryQuestions: '您可以试试这些问题：',
    tipContent: '您可以询问中医理论、经典条文、方剂配伍、病机分析等各种问题，我会基于丰富的中医知识库为您提供详细解答。',
    relatedConcepts: '相关概念：',

    // 示例问题
    quickQuestions: [
      '请解释什么是"肝主疏泄"的含义？',
      '麻黄汤和桂枝汤的区别是什么？',
      '中医的"望闻问切"四诊法具体是怎样的？',
      '什么是六经辨证？'
    ],

    // 错误状态
    error: {
      service: '服务异常',
      offline: '离线模式',
      sendFailed: '发送失败，请重试',
      noResponse: '抱歉，我暂时无法回应您的消息。请稍后重试。'
    }
  },

  // 知识图谱
  graph: {
    title: '知识图谱',
    subtitle: '探索中医知识的关联网络',
    search: '搜索概念...',
    categoryFilter: '分类筛选',
    allCategories: '全部分类',
    zoomIn: '放大',
    zoomOut: '缩小',
    reset: '重置',
    fullscreen: '全屏',
    nodeInfo: '节点信息',
    connections: '关联',
    categories: {
      organ: '脏腑',
      function: '生理功能',
      pathology: '病理',
      symptom: '症状',
      formula: '方剂',
      herb: '中药'
    },
    legend: '图例',
    legendLabels: {
      organ: '脏腑',
      function: '功能',
      pathology: '病理',
      symptom: '症状',
      treatment: '治法',
      formula: '方剂'
    },
    nodes: {
      // 脏腑
      heart: '心',
      liver: '肝',
      spleen: '脾',
      lung: '肺',
      kidney: '肾',
      // 功能
      shuaixue: '主血脉',
      cangsheng: '藏神',
      shuxie: '主疏泄',
      cangxue: '藏血',
      yunhua: '主运化',
      tongsheng: '统血',
      zhiqi: '主气',
      xuanfa: '宣发',
      cangzang: '主藏精',
      zhushui: '主水',
      // 病理状态
      qixue_yugui: '气滞血瘀',
      ganyu_qizhi: '肝郁气滞',
      pixu: '脾虚',
      shenyang_xu: '肾阳虚',
      feiqi_xu: '肺气虚',
      // 症状
      xiongxie_zhang: '胸胁胀痛',
      qingzhi_bu_shu: '情志不舒',
      // 方剂
      xiaoyao_san: '逍遥散',
      mahuang_tang: '麻黄汤',
      guizhi_tang: '桂枝汤',
      shengmai_san: '生脉散',
      buzhong_yiqi_tang: '补中益气汤',
      liuwei_dihuang_wan: '六味地黄丸',
      // 治法
      jianpi_yiqi: '健脾益气',
      buyang_yishen: '补阳益肾',
      shugan_jieyu: '疏肝解郁'
    },
    nodeDetails: {
      type: '类型：',
      level: '级别：',
      layerPrefix: '第',
      layerSuffix: '层',
      description: '这是关于"{name}"的详细信息。在实际应用中，这里会显示从知识库中检索到的详细说明、相关理论、临床应用等内容。',
      exploreRelated: '探索相关概念'
    }
  },

  // 学习路径
  learning: {
    title: '个性化学习',
    subtitle: '智能规划您的中医学习之路',
    tabs: {
      overview: '学习概览',
      assessment: '能力评估',
      path: '学习路径'
    },
    overview: {
      title: '开始您的中医学习之旅',
      description: '通过科学的评估和个性化的学习路径，让中医学习变得更加高效和有趣。我们将根据您的基础水平，为您制定专属的学习计划。',
      startAssessment: '开始能力评估',
      startLearningAssessment: '开始学习评估',
      completedAssessment: '您已完成能力评估',
      currentLevel: '当前水平',
      score: '得分',
      viewLearningPath: '查看学习路径',
      retakeAssessment: '重新评估',
      levels: {
        beginner: '入门级',
        basic: '基础级',
        intermediate: '进阶级',
        advanced: '高级'
      },
      features: [
        '个性化学习路径规划',
        '智能进度跟踪',
        '知识点关联分析',
        '学习效果评估'
      ],
      featureCards: {
        assessment: {
          title: '能力评估',
          description: '6道精心设计的题目，快速了解您的中医知识水平'
        },
        personalized: {
          title: '个性化路径',
          description: '根据评估结果，为您推荐最适合的学习内容和进度'
        },
        tracking: {
          title: '进度跟踪',
          description: '实时记录学习进展，智能调整学习计划'
        }
      }
    },
    assessment: {
      title: '中医基础能力评估',
      instruction: '请认真回答以下问题，系统将根据您的答案为您推荐最适合的学习路径',
      timeEstimate: '预计用时：5-10分钟',
      currentQuestion: '当前题目',
      totalQuestions: '总题数',
      submit: '提交评估',
      result: '评估结果',
      description: '通过这个简短的评估，我们将了解您的中医知识水平，为您制定个性化的学习计划。',
      questionCount: '题目数量',
      coverage: '涵盖：基础理论、脏腑、诊断、方剂等',
      startButton: '开始评估',
      completed: '评估完成！',
      yourLevel: '您的中医知识水平',
      overallScore: '总体得分',
      timeUsed: '用时',
      moduleScores: '各模块得分',
      suggestions: '学习建议',
      questionProgress: '第 {current} 题 / 共 {total} 题',
      timeRemaining: '剩余时间',
      previousQuestion: '上一题',
      submitAssessment: '提交评估',
      completeAssessment: '完成评估',
      nextQuestion: '下一题',
      recommendations: {
        advanced: {
          deepStudy: '可以深入学习中医经典原文',
          clinicalCases: '建议结合临床案例进行学习',
          complexAnalysis: '可以尝试独立分析复杂病例'
        },
        intermediate: {
          consolidate: '继续巩固基础理论知识',
          strengthen: '加强方剂学和诊断学学习',
          practice: '多做习题巩固理解'
        },
        basic: {
          focusBasics: '重点学习中医基础理论',
          systematicStudy: '建议系统学习脏腑经络',
          readMaterials: '多阅读入门教材'
        },
        beginner: {
          startPhilosophy: '从中医哲学基础开始学习',
          chooseBooks: '建议选择通俗易懂的入门书籍',
          watchVideos: '可以观看基础教学视频'
        }
      }
    },
    paths: {
      beginner: {
        title: '中医入门学习路径',
        description: '从零开始，系统学习中医基础知识',
        duration: '3-6个月',
        modules: [
          {
            title: '中医哲学基础',
            description: '了解中医的思维方式和理论基础',
            duration: '2周'
          },
          {
            title: '基础理论',
            description: '学习阴阳五行、脏腑经络等基本概念',
            duration: '4周'
          },
          {
            title: '诊断方法',
            description: '掌握望闻问切四诊法',
            duration: '3周'
          },
          {
            title: '常用方剂',
            description: '学习经典方剂的组成和应用',
            duration: '4周'
          },
          {
            title: '临床实践',
            description: '理论结合实际，培养临床思维',
            duration: '3周'
          }
        ]
      }
    },
    path: {
      pleaseCompleteAssessment: '请先完成能力评估',
      assessmentHelpText: '评估帮助我们了解您的学习水平，为您制定个性化的学习路径',
      estimatedTime: '预计用时',
      modules: '个模块',
      completed: '完成',
      overallProgress: '总体进度',
      learningPath: '学习路径',
      estimatedHours: '预计 {hours} 小时',
      continueStudy: '继续学习',
      startStudy: '开始学习',
      moduleDetails: '模块详情',
      learningObjectives: '学习目标',
      learningContent: '学习内容',
      learningResources: '学习资源',
      duration: '时长',
      pages: '页数',
      questions: '题数',
      exercises: '练习',
      cases: '案例',
      viewDetails: '查看详情',
      prerequisites: '前置要求',
      personalizedSuggestions: '个性化建议',
      learningStatistics: '学习统计',
      completedTopics: '已完成话题',
      completedResources: '已完成资源',
      totalStudyTime: '总学习时长',
      resourceType: '资源类型',
      resourceTypes: {
        video: '视频课程',
        text: '文本资料',
        quiz: '在线测试',
        practice: '练习题',
        case: '案例分析',
        interactive: '交互练习',
        simulation: '模拟训练'
      },
      questionCount: '题目数量',
      studyStatus: '学习状态',
      notCompleted: '未完成',
      resourceDescription: '这是一个重要的学习资源，建议您认真学习。完成后请记得标记为已完成，以便系统跟踪您的学习进度。'
    }
  },

  // 认证
  auth: {
    loginTitle: '登录',
    username: '用户名',
    password: '密码',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    loginButton: '登录',
    loginSuccess: '登录成功！',
    loginFailed: '登录失败，请重试',
    logoutSuccess: '已退出登录',
    forgotPassword: '忘记密码？',
    register: '注册账号',
    profile: '个人资料',
    settings: '设置',
    logout: '退出登录'
  },

  // 通用
  common: {
    loading: '加载中...',
    retry: '重试',
    back: '返回',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    more: '更多',
    less: '收起',
    expand: '展开',
    collapse: '折叠'
  }
};
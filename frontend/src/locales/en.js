// English language pack
export const en = {
  // Navigation
  nav: {
    home: 'Home',
    chat: 'Start Chat',
    graph: 'Knowledge Graph',
    learning: 'Learning Path',
    settings: 'Settings',
    login: 'Login'
  },

  // Home page
  home: {
    title: 'AI Learning Companion for Traditional Chinese Medicine',
    subtitle: 'Explore the profound wisdom of Traditional Chinese Medicine through AI-driven knowledge graphs, intelligent Q&A, and personalized learning paths, bringing ancient medical classics to modern life',
    startExploring: 'Start Exploring',
    learningPath: 'Learning Path',
    coreFeatures: 'Core Features',

    // Feature cards
    features: {
      chat: {
        title: 'AI Intelligent Q&A',
        description: 'TCM knowledge base based on RAG model, learn like talking to a real teacher',
        features: [
          'In-depth interpretation of classic texts',
          'Comparison with modern clinical guidelines',
          'Analysis of famous medical cases'
        ]
      },
      graph: {
        title: 'Knowledge Graph',
        description: 'Visualized TCM knowledge network, explore deep connections between concepts',
        features: [
          'Dynamic association discovery',
          'Pathogenesis visualization',
          'Holistic concept embodiment'
        ]
      },
      learning: {
        title: 'Personalized Learning',
        description: 'Intelligent tutoring system that plans the most suitable learning paths and review schedules',
        features: [
          'Capability profiling assessment',
          'Dynamic path generation',
          'Forgetting curve optimization'
        ]
      }
    },

    // Status display
    status: {
      backend: 'Backend Service',
      connected: 'Connected',
      disconnected: 'Connection Failed',
      uptime: 'Uptime'
    }
  },

  // Chat page
  chat: {
    title: 'AI Intelligent Q&A',
    subtitle: 'Traditional Chinese Medicine Learning Companion',
    quickQuestions: 'Quick Questions',
    quickQuestionsTitle: 'Quick Questions',
    learningTips: 'Learning Tips',
    placeholder: 'Please enter your Traditional Chinese Medicine question...',
    sendHint: 'Press Enter to send, Shift + Enter for new line',
    thinking: 'Thinking...',
    welcome: 'Hello! I am your Traditional Chinese Medicine learning companion',
    welcomeDesc: 'I can help you answer questions about Traditional Chinese Medicine theory, classic texts, clinical applications and other aspects. What would you like to know?',
    tryQuestions: 'You can try these questions:',
    tipContent: 'You can ask about Traditional Chinese Medicine theory, classic texts, herbal formula combinations, pathogenesis analysis and other various questions. I will provide detailed answers based on a rich Traditional Chinese Medicine knowledge base.',
    relatedConcepts: 'Related Concepts:',

    // Quick questions
    quickQuestions: [
      'Please explain the meaning of "Liver governs free flow of Qi"',
      'What is the difference between Mahuang Tang and Guizhi Tang?',
      'What are the four diagnostic methods of "inspection, listening, inquiry, and palpation" in Traditional Chinese Medicine?',
      'What is the six-meridian pattern identification?'
    ],

    // Error states
    error: {
      service: 'Service Error',
      offline: 'Offline Mode',
      sendFailed: 'Send failed, please retry',
      noResponse: 'Sorry, I cannot respond to your message at the moment. Please try again later.'
    }
  },

  // Knowledge Graph
  graph: {
    title: 'Knowledge Graph',
    subtitle: 'Explore the interconnected network of Traditional Chinese Medicine knowledge',
    search: 'Search concepts...',
    categoryFilter: 'Category Filter',
    allCategories: 'All Categories',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    reset: 'Reset',
    fullscreen: 'Fullscreen',
    nodeInfo: 'Node Information',
    connections: 'Connections',
    categories: {
      organ: 'Organs',
      function: 'Physiological Functions',
      pathology: 'Pathology',
      symptom: 'Symptoms',
      formula: 'Formulas',
      herb: 'Herbs'
    },
    legend: 'Legend',
    legendLabels: {
      organ: 'Organs',
      function: 'Functions',
      pathology: 'Pathology',
      symptom: 'Symptoms',
      treatment: 'Treatments',
      formula: 'Formulas'
    },
    nodes: {
      // Organs
      heart: 'Heart',
      liver: 'Liver',
      spleen: 'Spleen',
      lung: 'Lung',
      kidney: 'Kidney',
      // Functions
      shuaixue: 'Governs Blood Vessels',
      cangsheng: 'Houses the Mind',
      shuxie: 'Governs Free Flow of Qi',
      cangxue: 'Stores Blood',
      yunhua: 'Governs Transportation and Transformation',
      tongsheng: 'Controls Blood',
      zhiqi: 'Governs Qi',
      xuanfa: 'Dispersing and Descending',
      cangzang: 'Stores Essence',
      zhushui: 'Governs Water',
      // Pathological states
      qixue_yugui: 'Qi Stagnation and Blood Stasis',
      ganyu_qizhi: 'Liver Qi Stagnation',
      pixu: 'Spleen Deficiency',
      shenyang_xu: 'Kidney Yang Deficiency',
      feiqi_xu: 'Lung Qi Deficiency',
      // Symptoms
      xiongxie_zhang: 'Chest and Hypochondriac Distension and Pain',
      qingzhi_bu_shu: 'Emotional Discomfort',
      // Formulas
      xiaoyao_san: 'Free and Easy Wanderer Powder',
      mahuang_tang: 'Ephedra Decoction',
      guizhi_tang: 'Cinnamon Twig Decoction',
      shengmai_san: 'Generate the Pulse Powder',
      buzhong_yiqi_tang: 'Tonify the Middle and Augment the Qi Decoction',
      liuwei_dihuang_wan: 'Six-Ingredient Pill with Rehmannia',
      // Treatment methods
      jianpi_yiqi: 'Strengthen Spleen and Boost Qi',
      buyang_yishen: 'Supplement Yang and Benefit Kidney',
      shugan_jieyu: 'Soothe Liver and Resolve Depression'
    },
    nodeDetails: {
      type: 'Type:',
      level: 'Level:',
      layerPrefix: 'Layer ',
      layerSuffix: '',
      description: 'This is detailed information about "{name}". In actual applications, this would display detailed explanations, related theories, clinical applications and other content retrieved from the knowledge base.',
      exploreRelated: 'Explore Related Concepts'
    }
  },

  // Learning Path
  learning: {
    title: 'Personalized Learning',
    subtitle: 'Intelligently plan your Traditional Chinese Medicine learning journey',
    tabs: {
      overview: 'Learning Overview',
      assessment: 'Capability Assessment',
      path: 'Learning Path'
    },
    overview: {
      title: 'Begin Your Traditional Chinese Medicine Learning Journey',
      description: 'Through scientific assessment and personalized learning paths, make Traditional Chinese Medicine learning more efficient and interesting. We will create a dedicated learning plan based on your foundation level.',
      startAssessment: 'Start Capability Assessment',
      startLearningAssessment: 'Start Learning Assessment',
      completedAssessment: 'You have completed the capability assessment',
      currentLevel: 'Current Level',
      score: 'Score',
      viewLearningPath: 'View Learning Path',
      retakeAssessment: 'Retake Assessment',
      levels: {
        beginner: 'Beginner Level',
        basic: 'Basic Level',
        intermediate: 'Intermediate Level',
        advanced: 'Advanced Level'
      },
      features: [
        'Personalized learning path planning',
        'Intelligent progress tracking',
        'Knowledge point association analysis',
        'Learning effectiveness evaluation'
      ],
      featureCards: {
        assessment: {
          title: 'Capability Assessment',
          description: '6 carefully designed questions to quickly understand your Traditional Chinese Medicine knowledge level'
        },
        personalized: {
          title: 'Personalized Path',
          description: 'Based on assessment results, recommend the most suitable learning content and pace for you'
        },
        tracking: {
          title: 'Progress Tracking',
          description: 'Real-time recording of learning progress, intelligently adjusting learning plans'
        }
      }
    },
    assessment: {
      title: 'Traditional Chinese Medicine Foundation Capability Assessment',
      instruction: 'Please answer the following questions carefully. The system will recommend the most suitable learning path based on your answers',
      timeEstimate: 'Estimated time: 5-10 minutes',
      currentQuestion: 'Current Question',
      totalQuestions: 'Total Questions',
      submit: 'Submit Assessment',
      result: 'Assessment Result',
      description: 'Through this brief assessment, we will understand your Traditional Chinese Medicine knowledge level and create a personalized learning plan for you.',
      questionCount: 'Number of Questions',
      coverage: 'Coverage: Basic Theory, Organs, Diagnosis, Formulas, etc.',
      startButton: 'Start Assessment',
      completed: 'Assessment Completed!',
      yourLevel: 'Your Traditional Chinese Medicine Knowledge Level',
      overallScore: 'Overall Score',
      timeUsed: 'Time Used',
      moduleScores: 'Module Scores',
      suggestions: 'Learning Suggestions',
      questionProgress: 'Question {current} / {total}',
      timeRemaining: 'Time Remaining',
      previousQuestion: 'Previous',
      submitAssessment: 'Submit Assessment',
      completeAssessment: 'Complete Assessment',
      nextQuestion: 'Next',
      recommendations: {
        advanced: {
          deepStudy: 'Can deeply study Traditional Chinese Medicine classical texts',
          clinicalCases: 'Recommend combining clinical cases for learning',
          complexAnalysis: 'Can try independent analysis of complex cases'
        },
        intermediate: {
          consolidate: 'Continue to consolidate basic theoretical knowledge',
          strengthen: 'Strengthen learning of formulas and diagnosis',
          practice: 'Do more exercises to consolidate understanding'
        },
        basic: {
          focusBasics: 'Focus on learning Traditional Chinese Medicine basic theory',
          systematicStudy: 'Recommend systematic study of organs and meridians',
          readMaterials: 'Read more introductory materials'
        },
        beginner: {
          startPhilosophy: 'Start with Traditional Chinese Medicine philosophical foundations',
          chooseBooks: 'Recommend choosing easy-to-understand introductory books',
          watchVideos: 'Can watch basic instructional videos'
        }
      }
    },
    paths: {
      beginner: {
        title: 'Traditional Chinese Medicine Beginner Learning Path',
        description: 'Start from scratch and systematically learn the fundamentals of Traditional Chinese Medicine',
        duration: '3-6 months',
        modules: [
          {
            title: 'Traditional Chinese Medicine Philosophy Foundation',
            description: 'Understand the thinking methods and theoretical foundations of Traditional Chinese Medicine',
            duration: '2 weeks'
          },
          {
            title: 'Basic Theory',
            description: 'Learn fundamental concepts such as Yin-Yang, Five Elements, Zang-Fu organs and meridians',
            duration: '4 weeks'
          },
          {
            title: 'Diagnostic Methods',
            description: 'Master the four diagnostic methods: inspection, listening, inquiry, and palpation',
            duration: '3 weeks'
          },
          {
            title: 'Common Formulas',
            description: 'Learn the composition and application of classic herbal formulas',
            duration: '4 weeks'
          },
          {
            title: 'Clinical Practice',
            description: 'Combine theory with practice and develop clinical thinking',
            duration: '3 weeks'
          }
        ]
      }
    },
    path: {
      pleaseCompleteAssessment: 'Please complete the capability assessment first',
      assessmentHelpText: 'The assessment helps us understand your learning level and create a personalized learning path for you',
      estimatedTime: 'Estimated time',
      modules: 'modules',
      completed: 'completed',
      overallProgress: 'Overall Progress',
      learningPath: 'Learning Path',
      estimatedHours: 'Estimated {hours} hours',
      continueStudy: 'Continue Study',
      startStudy: 'Start Study',
      moduleDetails: 'Module Details',
      learningObjectives: 'Learning Objectives',
      learningContent: 'Learning Content',
      learningResources: 'Learning Resources',
      duration: 'Duration',
      pages: 'Pages',
      questions: 'questions',
      exercises: 'Exercises',
      cases: 'Cases',
      viewDetails: 'View Details',
      prerequisites: 'Prerequisites',
      personalizedSuggestions: 'Personalized Suggestions',
      learningStatistics: 'Learning Statistics',
      completedTopics: 'Completed Topics',
      completedResources: 'Completed Resources',
      totalStudyTime: 'Total Study Time',
      resourceType: 'Resource Type',
      resourceTypes: {
        video: 'Video Course',
        text: 'Text Material',
        quiz: 'Online Quiz',
        practice: 'Practice Exercises',
        case: 'Case Analysis',
        interactive: 'Interactive Exercise',
        simulation: 'Simulation Training'
      },
      questionCount: 'Number of Questions',
      studyStatus: 'Study Status',
      notCompleted: 'Not Completed',
      resourceDescription: 'This is an important learning resource. We recommend you study it carefully. Please remember to mark it as completed after finishing, so the system can track your learning progress.'
    }
  },

  // Authentication
  auth: {
    loginTitle: 'Login',
    username: 'Username',
    password: 'Password',
    usernameRequired: 'Please enter username',
    passwordRequired: 'Please enter password',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    loginButton: 'Login',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed, please try again',
    logoutSuccess: 'Logged out successfully',
    forgotPassword: 'Forgot password?',
    register: 'Register',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout'
  },

  // Common
  common: {
    loading: 'Loading...',
    retry: 'Retry',
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    more: 'More',
    less: 'Less',
    expand: 'Expand',
    collapse: 'Collapse'
  }
};
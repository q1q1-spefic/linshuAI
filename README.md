# 灵枢AI - 中医智慧学习平台项目结构

！！更多参考资料请前往：https://interviewasssistant.com

## 项目概览
基于React + Node.js的现代化中医学习平台，集成AI问答、知识图谱和个性化学习路径。

## 前端结构 (frontend/)
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js          # 顶部导航栏
│   │   │   ├── Sidebar.js         # 侧边栏
│   │   │   ├── Loading.js         # 加载组件
│   │   │   └── Modal.js           # 弹窗组件
│   │   ├── chat/
│   │   │   ├── ChatBox.js         # 聊天主界面
│   │   │   ├── MessageBubble.js   # 消息气泡
│   │   │   ├── InputArea.js       # 输入区域
│   │   │   └── QuickQuestions.js  # 快速问题
│   │   ├── knowledge-graph/
│   │   │   ├── GraphContainer.js  # 图谱容器
│   │   │   ├── NodeComponent.js   # 节点组件
│   │   │   ├── EdgeComponent.js   # 连线组件
│   │   │   ├── GraphControls.js   # 图谱控制器
│   │   │   └── ConceptSearch.js   # 概念搜索
│   │   ├── learning/
│   │   │   ├── StudyPlan.js       # 学习计划
│   │   │   ├── ProgressTracker.js # 学习进度
│   │   │   ├── LevelAssessment.js # 能力评估
│   │   │   └── ReviewSchedule.js  # 复习安排
│   │   └── home/
│   │       ├── Hero.js            # 首页主视觉
│   │       ├── FeatureCards.js    # 功能卡片
│   │       └── Statistics.js     # 统计信息
│   ├── pages/
│   │   ├── HomePage.js            # 首页
│   │   ├── ChatPage.js            # AI问答页
│   │   ├── GraphPage.js           # 知识图谱页
│   │   ├── LearningPage.js        # 个性化学习页
│   │   ├── ProfilePage.js         # 用户档案页
│   │   └── NotFoundPage.js        # 404页面
│   ├── hooks/
│   │   ├── useChat.js             # 聊天逻辑钩子
│   │   ├── useGraph.js            # 图谱逻辑钩子
│   │   ├── useLearning.js         # 学习逻辑钩子
│   │   └── useAuth.js             # 认证逻辑钩子
│   ├── services/
│   │   ├── api.js                 # API服务
│   │   ├── chatService.js         # 聊天服务
│   │   ├── graphService.js        # 图谱服务
│   │   └── learningService.js     # 学习服务
│   ├── utils/
│   │   ├── constants.js           # 常量定义
│   │   ├── helpers.js             # 工具函数
│   │   └── validators.js          # 验证函数
│   ├── styles/
│   │   ├── globals.css            # 全局样式
│   │   ├── components/            # 组件样式
│   │   └── pages/                 # 页面样式
│   ├── context/
│   │   ├── AuthContext.js         # 认证上下文
│   │   ├── ThemeContext.js        # 主题上下文
│   │   └── LearningContext.js     # 学习上下文
│   ├── App.js                     # 主应用组件
│   └── index.js                   # 入口文件
├── package.json                   # 依赖配置
└── README.md                      # 项目说明
```

## 后端结构 (backend/)
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # 认证控制器
│   │   ├── chatController.js      # 聊天控制器
│   │   ├── graphController.js     # 图谱控制器
│   │   ├── learningController.js  # 学习控制器
│   │   └── userController.js      # 用户控制器
│   ├── models/
│   │   ├── User.js                # 用户模型
│   │   ├── Conversation.js        # 对话模型
│   │   ├── KnowledgeNode.js       # 知识节点模型
│   │   ├── LearningPath.js        # 学习路径模型
│   │   └── StudyRecord.js         # 学习记录模型
│   ├── services/
│   │   ├── aiService.js           # AI服务（RAG集成）
│   │   ├── graphService.js        # 图谱服务
│   │   ├── learningService.js     # 学习算法服务
│   │   └── vectorService.js       # 向量数据库服务
│   ├── routes/
│   │   ├── auth.js                # 认证路由
│   │   ├── chat.js                # 聊天路由
│   │   ├── graph.js               # 图谱路由
│   │   ├── learning.js            # 学习路由
│   │   └── users.js               # 用户路由
│   ├── middleware/
│   │   ├── auth.js                # 认证中间件
│   │   ├── validation.js          # 验证中间件
│   │   ├── rateLimiter.js         # 请求限制
│   │   └── errorHandler.js        # 错误处理
│   ├── config/
│   │   ├── database.js            # 数据库配置
│   │   ├── ai.js                  # AI配置
│   │   └── index.js               # 总配置
│   ├── utils/
│   │   ├── logger.js              # 日志工具
│   │   ├── helpers.js             # 工具函数
│   │   └── constants.js           # 常量定义
│   └── app.js                     # Express应用
├── package.json                   # 依赖配置
├── .env.example                   # 环境变量示例
└── README.md                      # 后端说明
```

## 数据库设计 (database/)
```
database/
├── migrations/                    # 数据库迁移
│   ├── 001_create_users.sql
│   ├── 002_create_knowledge_nodes.sql
│   ├── 003_create_conversations.sql
│   └── 004_create_learning_records.sql
├── seeds/                         # 种子数据
│   ├── tcm_knowledge_base.json    # 中医知识库
│   ├── symptom_patterns.json     # 症状模式
│   └── prescription_database.json # 方剂数据库
└── schema/
    ├── knowledge_graph.json      # 知识图谱结构
    └── learning_paths.json       # 学习路径模板
```

## AI/RAG集成 (ai-service/)
```
ai-service/
├── embeddings/
│   ├── text_processor.py         # 文本处理
│   ├── vector_generator.py       # 向量生成
│   └── similarity_search.py      # 相似度搜索
├── knowledge_base/
│   ├── tcm_corpus/               # 中医语料库
│   │   ├── classical_texts/      # 经典文献
│   │   ├── modern_textbooks/     # 现代教材
│   │   ├── clinical_cases/       # 临床案例
│   │   └── research_papers/      # 研究论文
│   └── preprocessed/             # 预处理数据
├── models/
│   ├── rag_model.py              # RAG模型
│   ├── graph_builder.py          # 图谱构建
│   └── learning_recommender.py   # 学习推荐
├── config/
│   ├── model_config.yaml         # 模型配置
│   └── embedding_config.yaml     # 嵌入配置
└── api/
    ├── chat_api.py               # 聊天API
    ├── graph_api.py              # 图谱API
    └── learning_api.py           # 学习API
```

## 配置文件
```
项目根目录/
├── docker-compose.yml            # Docker编排
├── .gitignore                    # Git忽略
├── .env.example                  # 环境变量模板
├── package.json                  # 根项目配置
└── README.md                     # 项目总说明
```

## 主要技术栈

### 前端
- **React 18** - 用户界面库
- **React Router** - 路由管理
- **D3.js** - 知识图谱可视化
- **Ant Design** - UI组件库
- **Styled Components** - 样式解决方案
- **Axios** - HTTP客户端
- **Socket.io Client** - 实时通信

### 后端
- **Node.js** - 运行时环境
- **Express.js** - Web框架
- **MongoDB** - 主数据库
- **Redis** - 缓存和会话
- **Socket.io** - 实时通信
- **JWT** - 认证机制
- **Helmet** - 安全中间件

### AI/ML
- **Python** - AI服务语言
- **FastAPI** - AI服务框架
- **Transformers** - 大语言模型
- **LangChain** - RAG框架
- **Pinecone/Chroma** - 向量数据库
- **spaCy** - 中文NLP处理

### 部署
- **Docker** - 容器化
- **Nginx** - 反向代理
- **PM2** - 进程管理
- **GitHub Actions** - CI/CD

## 开发步骤建议

1. **环境搭建** - 配置开发环境和依赖
2. **后端API** - 构建基础API和数据库
3. **前端框架** - 搭建React应用和路由
4. **AI集成** - 集成RAG模型和知识库
5. **功能模块** - 逐步实现各核心功能
6. **测试优化** - 测试和性能优化
7. **部署上线** - 生产环境部署

每个阶段都可以独立开发和测试，确保项目稳步推进。

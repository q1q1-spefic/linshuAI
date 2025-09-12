# 灵枢AI - 中医智慧学习平台

<div align="center">

![灵枢AI Logo](https://via.placeholder.com/120x120/52c41a/ffffff?text=灵枢AI)

**将静态的中医知识，转化为动态的、可交互、可探索的智慧网络**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-7.0-green)](https://www.mongodb.com/)

</div>


！！更多参考资料请前往：https://interviewasssistant.com



## 🌟 项目简介

灵枢AI是一个创新的中医智慧学习平台，旨在通过人工智能技术将传统中医知识转化为现代化的学习体验。平台集成了RAG（检索增强生成）技术、知识图谱可视化和个性化学习路径，为中医学习者提供智能化的学习伙伴。

### 🎯 核心理念

- **智能化学习**：AI驱动的个性化学习体验
- **知识图谱**：可视化的中医知识网络
- **互动探索**：从静态知识到动态智慧的转化
- **传承创新**：传统医学与现代技术的完美结合

## ✨ 核心功能

### 🤖 AI智能问答
- **RAG技术**：基于庞大中医知识库的智能问答
- **多层次内容**：涵盖经典古籍、现代教材、临床指南
- **情境理解**：理解用户学习水平和需求
- **个性化回答**：根据用户档案调整回答风格

### 🕸️ 交互式知识图谱
- **可视化探索**：动态展示概念间的关联关系
- **路径发现**：智能计算病机传变路径
- **概念连接**：发现知识点之间的深层联系
- **实时生成**：AI动态构建知识网络

### 📚 个性化学习
- **能力评估**：智能分析学习水平和薄弱环节
- **路径规划**：动态生成个性化学习计划
- **进度跟踪**：详细记录学习轨迹和成果
- **复习优化**：基于遗忘曲线的智能复习提醒

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化用户界面框架
- **Ant Design** - 企业级UI组件库
- **D3.js** - 数据可视化和知识图谱
- **Framer Motion** - 流畅的动画效果
- **Styled Components** - CSS-in-JS样式方案

### 后端技术栈
- **Node.js + Express** - 高性能后端服务
- **MongoDB** - 灵活的文档数据库
- **Redis** - 高速缓存和会话管理
- **Socket.io** - 实时通信支持

### AI/ML技术
- **OpenAI GPT-4** - 大语言模型
- **LangChain** - RAG框架
- **ChromaDB** - 向量数据库
- **Python FastAPI** - AI服务接口

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- MongoDB >= 7.0
- Redis >= 6.0
- Python >= 3.9 (AI服务)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-org/lingsu-ai.git
cd lingsu-ai
```

2. **安装依赖**
```bash
# 安装所有依赖
npm run setup

# 或分别安装
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 编辑配置文件
vim backend/.env
```

4. **启动服务**
```bash
# 使用Docker (推荐)
docker-compose up -d

# 或手动启动
npm run dev
```

5. **访问应用**
- 前端界面: http://localhost:3000
- 后端API: http://localhost:3001
- AI服务: http://localhost:8000

## 📁 项目结构

```
lingsu-ai/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── pages/           # 页面组件
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── services/        # API服务
│   │   └── utils/           # 工具函数
│   └── public/              # 静态资源
├── backend/                  # Node.js后端
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由定义
│   │   ├── services/        # 业务服务
│   │   └── middleware/      # 中间件
│   └── tests/               # 测试文件
├── ai-service/              # Python AI服务
│   ├── api/                 # API接口
│   ├── models/              # AI模型
│   ├── embeddings/          # 向量处理
│   └── knowledge_base/      # 知识库
├── database/                # 数据库相关
│   ├── migrations/          # 数据迁移
│   ├── seeds/               # 种子数据
│   └── schema/              # 数据结构
└── docs/                    # 项目文档
```

## 🔧 配置说明

### 环境变量

**后端 (.env)**
```env
# 服务配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 数据库
MONGODB_URI=mongodb://localhost:27017/lingsu_ai
REDIS_URL=redis://localhost:6379

# 认证
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# AI服务
OPENAI_API_KEY=your_openai_api_key
AI_SERVICE_URL=http://localhost:8000

# 邮件服务
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**前端 (.env)**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
```

## 📊 数据库设计

### 用户模型 (User)
- 基本信息：用户名、邮箱、密码
- 学习档案：水平、兴趣、目标、活动记录
- 统计数据：学习时间、对话次数、成就
- 偏好设置：主题、通知、隐私

### 对话模型 (Conversation)
- 消息列表：用户和AI的完整对话记录
- 上下文：学习目标、当前话题、难度
- 分析数据：话题分布、情感分析、质量指标

### 知识节点 (KnowledgeNode)
- 概念信息：名称、定义、分类
- 关联关系：父子关系、相关概念
- 内容数据：文档、图片、音频

## 🎨 界面设计

### 设计原则
- **简洁清晰**：减少认知负担，突出核心功能
- **响应式**：适配各种设备和屏幕尺寸
- **无障碍**：遵循WCAG无障碍设计标准
- **中医美学**：融入传统中医文化元素

### 主要页面
- **首页**：功能介绍和快速导航
- **AI问答**：智能对话界面
- **知识图谱**：可视化概念网络
- **个人学习**：学习计划和进度
- **用户中心**：个人设置和统计

## 🧪 测试

```bash
# 运行所有测试
npm test

# 前端测试
npm run test:frontend

# 后端测试
npm run test:backend

# 生成测试覆盖率报告
npm run test:coverage
```

## 📦 部署

### Docker部署 (推荐)
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 手动部署
```bash
# 构建前端
npm run build:frontend

# 启动后端
npm run start
```

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范
- 使用ESLint和Prettier进行代码格式化
- 遵循Conventional Commits规范
- 为新功能添加适当的测试
- 更新相关文档

## 📋 开发计划

### 第一阶段 (MVP)
- [x] 基础架构搭建
- [x] 用户认证系统
- [x] AI问答功能
- [ ] 基础知识图谱
- [ ] 个人学习档案

### 第二阶段 (增强版)
- [ ] 高级知识图谱可视化
- [ ] 个性化学习路径
- [ ] 多媒体内容支持
- [ ] 社交学习功能

### 第三阶段 (专业版)
- [ ] 临床案例分析
- [ ] 专家系统集成
- [ ] 移动端应用
- [ ] 企业版功能

## 📞 支持与联系

- **官方网站**: https://lingsu-ai.com
- **技术文档**: https://docs.lingsu-ai.com
- **问题反馈**: https://github.com/your-org/lingsu-ai/issues
- **邮箱联系**: support@lingsu-ai.com

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和贡献者：
- React和React生态系统
- Ant Design设计团队
- OpenAI和LangChain社区
- MongoDB和Redis团队
- 所有贡献代码和建议的开发者

---

<div align="center">

**用AI传承千年智慧，让中医学习更加智能化** ✨

Made with ❤️ by 灵枢AI团队

</div>

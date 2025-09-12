#!/bin/bash

# 灵枢AI - Mac开发环境一键安装脚本
# 用途：在Mac上快速搭建完整的开发环境

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查系统要求
check_system() {
    log_info "检查系统环境..."
    
    # 检查操作系统
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log_error "此脚本仅支持macOS系统"
        exit 1
    fi
    
    # 检查Xcode Command Line Tools
    if ! xcode-select -p &> /dev/null; then
        log_warning "Xcode Command Line Tools未安装，正在安装..."
        xcode-select --install
        log_info "请在弹出的对话框中完成Xcode Command Line Tools的安装，然后重新运行此脚本"
        exit 1
    fi
    
    log_success "系统环境检查完成"
}

# 安装Homebrew
install_homebrew() {
    if command_exists brew; then
        log_success "Homebrew已安装"
        brew update
    else
        log_info "安装Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # 添加Homebrew到PATH
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        
        log_success "Homebrew安装完成"
    fi
}

# 安装Node.js
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        log_success "Node.js已安装: $NODE_VERSION"
        
        # 检查版本是否满足要求
        REQUIRED_VERSION="18.0.0"
        if [[ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]]; then
            log_warning "Node.js版本过低，建议升级到18.0.0或更高版本"
        fi
    else
        log_info "安装Node.js..."
        brew install node
        log_success "Node.js安装完成"
    fi
    
    # 安装pnpm (可选的包管理器)
    if ! command_exists pnpm; then
        log_info "安装pnpm..."
        npm install -g pnpm
        log_success "pnpm安装完成"
    fi
}

# 安装Python和AI相关依赖
install_python() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        log_success "Python已安装: $PYTHON_VERSION"
    else
        log_info "安装Python..."
        brew install python@3.11
        log_success "Python安装完成"
    fi
    
    # 安装pipenv
    if ! command_exists pipenv; then
        log_info "安装pipenv..."
        pip3 install pipenv
        log_success "pipenv安装完成"
    fi
}

# 安装数据库
install_databases() {
    # 安装MongoDB
    if command_exists mongod; then
        log_success "MongoDB已安装"
    else
        log_info "安装MongoDB..."
        brew tap mongodb/brew
        brew install mongodb-community
        
        # 启动MongoDB服务
        brew services start mongodb/brew/mongodb-community
        log_success "MongoDB安装并启动完成"
    fi
    
    # 安装Redis
    if command_exists redis-server; then
        log_success "Redis已安装"
    else
        log_info "安装Redis..."
        brew install redis
        
        # 启动Redis服务
        brew services start redis
        log_success "Redis安装并启动完成"
    fi
}

# 安装Docker
install_docker() {
    if command_exists docker; then
        log_success "Docker已安装"
    else
        log_info "Docker未安装，请手动安装Docker Desktop for Mac"
        log_info "下载地址: https://www.docker.com/products/docker-desktop"
        log_warning "Docker安装完成后，请重新运行此脚本"
    fi
}

# 安装开发工具
install_dev_tools() {
    log_info "安装开发工具..."
    
    # Git (通常已预装)
    if ! command_exists git; then
        brew install git
    fi
    
    # VS Code (可选)
    if ! command_exists code; then
        log_info "安装Visual Studio Code..."
        brew install --cask visual-studio-code
    fi
    
    # 其他有用的工具
    brew install wget curl jq tree
    
    log_success "开发工具安装完成"
}

# 创建项目目录结构
create_project_structure() {
    log_info "创建项目目录结构..."
    
    # 如果当前目录不是项目根目录，创建新的项目目录
    if [[ ! -f "package.json" ]]; then
        mkdir -p lingsu-ai
        cd lingsu-ai
    fi
    
    # 创建主要目录
    mkdir -p frontend/src/{components,pages,hooks,services,utils,styles,context}
    mkdir -p frontend/src/components/{common,chat,knowledge-graph,learning,home}
    mkdir -p frontend/public
    
    mkdir -p backend/src/{controllers,models,routes,services,middleware,config,utils}
    mkdir -p backend/tests
    
    mkdir -p ai-service/{api,models,embeddings,knowledge_base}
    mkdir -p ai-service/knowledge_base/{tcm_corpus,preprocessed}
    mkdir -p ai-service/knowledge_base/tcm_corpus/{classical_texts,modern_textbooks,clinical_cases,research_papers}
    
    mkdir -p database/{migrations,seeds,schema}
    mkdir -p docs/{api,deployment,development}
    mkdir -p nginx
    
    log_success "项目目录结构创建完成"
}

# 初始化项目配置
init_project_config() {
    log_info "初始化项目配置..."
    
    # 创建根目录package.json (如果不存在)
    if [[ ! -f "package.json" ]]; then
        cat > package.json << 'EOF'
{
  "name": "lingsu-ai",
  "version": "1.0.0",
  "description": "中医智慧AI学习伙伴 - 将静态知识转化为动态智慧网络",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm start",
    "dev:backend": "cd backend && npm run dev",
    "setup": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build"
  },
  "workspaces": ["frontend", "backend"],
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
    fi
    
    # 创建环境变量模板
    if [[ ! -f "backend/.env.example" ]]; then
        cat > backend/.env.example << 'EOF'
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
EOF
    fi
    
    if [[ ! -f "frontend/.env.example" ]]; then
        cat > frontend/.env.example << 'EOF'
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
EOF
    fi
    
    # 创建.gitignore
    if [[ ! -f ".gitignore" ]]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Build outputs
build/
dist/
*/build/
*/dist/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# AI/ML
*.pkl
*.model
__pycache__/
*.pyc

# Docker
.docker/
EOF
    fi
    
    log_success "项目配置初始化完成"
}

# 安装项目依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    # 安装根目录依赖
    if [[ -f "package.json" ]]; then
        npm install
    fi
    
    # 检查是否有前端和后端的package.json文件
    if [[ -f "frontend/package.json" ]]; then
        log_info "安装前端依赖..."
        cd frontend && npm install && cd ..
    else
        log_warning "前端package.json不存在，跳过前端依赖安装"
    fi
    
    if [[ -f "backend/package.json" ]]; then
        log_info "安装后端依赖..."
        cd backend && npm install && cd ..
    else
        log_warning "后端package.json不存在，跳过后端依赖安装"
    fi
    
    # Python依赖
    if [[ -f "ai-service/requirements.txt" ]]; then
        log_info "安装Python依赖..."
        cd ai-service
        pipenv install
        cd ..
    else
        log_warning "Python requirements.txt不存在，跳过Python依赖安装"
    fi
    
    log_success "项目依赖安装完成"
}

# 启动开发服务
start_dev_services() {
    log_info "启动开发服务..."
    
    # 检查MongoDB是否运行
    if ! pgrep -x "mongod" > /dev/null; then
        log_info "启动MongoDB..."
        brew services start mongodb/brew/mongodb-community
    fi
    
    # 检查Redis是否运行
    if ! pgrep -x "redis-server" > /dev/null; then
        log_info "启动Redis..."
        brew services start redis
    fi
    
    log_success "开发服务启动完成"
}

# 显示后续步骤
show_next_steps() {
    log_success "🎉 环境搭建完成！"
    echo ""
    echo "📋 后续步骤："
    echo "1. 配置环境变量："
    echo "   cp backend/.env.example backend/.env"
    echo "   cp frontend/.env.example frontend/.env"
    echo "   编辑这些文件并填入正确的配置"
    echo ""
    echo "2. 获取OpenAI API密钥（如需AI功能）："
    echo "   访问 https://platform.openai.com/api-keys"
    echo ""
    echo "3. 启动开发服务器："
    echo "   npm run dev"
    echo ""
    echo "4. 访问应用："
    echo "   前端: http://localhost:3000"
    echo "   后端: http://localhost:3001"
    echo ""
    echo "📚 更多信息请查看 README.md 文件"
    echo ""
    echo "🚀 开始您的中医AI学习之旅！"
}

# 主函数
main() {
    echo "🏥 灵枢AI - 中医智慧学习平台 🤖"
    echo "================================="
    echo ""
    
    check_system
    install_homebrew
    install_nodejs
    install_python
    install_databases
    install_docker
    install_dev_tools
    create_project_structure
    init_project_config
    
    # 询问是否安装依赖
    read -p "是否现在安装项目依赖？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_dependencies
    fi
    
    start_dev_services
    show_next_steps
}

# 错误处理
trap 'log_error "脚本执行过程中发生错误"; exit 1' ERR

# 运行主函数
main "$@"
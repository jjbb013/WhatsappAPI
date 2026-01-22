# 使用官方 Node.js 18 镜像
FROM node:18-slim

# 设置工作目录
WORKDIR /usr/src/app

# 安装 puppeteer/Chromium 依赖和其他系统依赖
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libxrandr2 \
    libxss1 \
    libxfixes3 \
    libxrender1 \
    libgconf-2-4 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 设置 puppeteer 使用系统 Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 创建必要的目录
RUN mkdir -p .wwebjs_auth uploads

# 复制依赖声明
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制项目源码
COPY . .

# 设置权限
RUN chown -R node:node /usr/src/app

# 切换到非root用户
USER node

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# 启动服务
CMD [ "node", "server.js" ]

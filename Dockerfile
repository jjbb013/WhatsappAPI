# 使用官方 Node.js 18 镜像
FROM node:18-bullseye

# 设置工作目录
WORKDIR /usr/src/app

# 更换为阿里云源（适合中国大陆环境）
RUN sed -i 's@http://deb.debian.org/debian@https://mirrors.aliyun.com/debian@g' /etc/apt/sources.list

# 安装 puppeteer/Chromium 依赖
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 设置 puppeteer 使用系统 Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 复制依赖声明
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目源码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动服务
CMD [ "node", "server.js" ]

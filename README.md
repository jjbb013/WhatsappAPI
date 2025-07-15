# 玮清出品 必属精品 - WhatsApp API 服务器

本项目是一个基于 Node.js 的 WhatsApp API 服务，支持定时消息、批量发送、图片发送、Web 前端管理等功能，界面与交互全部为中文，适合个人和团队自动化运营使用。

## 功能特色

- **扫码登录 WhatsApp，自动复用 session，无需频繁扫码**
- **支持定时任务（Cron 表达式），可定时发送文字或图片**
- **支持批量发送消息，适合群发或通知**
- **支持图片上传，消息可带图片和文字**
- **全中文网页前端，操作简单，支持一键跳转各页面**
- **API Key 机制，保障接口安全**
- **Docker 支持，易于部署**

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
node server.js
```

首次启动请用手机扫描网页上的二维码登录 WhatsApp，后续会自动复用 session。

### 3. 访问管理页面

浏览器打开 [http://localhost:3000](http://localhost:3000)

- 登录密码：`984819`
- 登录后可进入主页、定时任务、批量发送等页面

### 4. 定时任务 Cron 表达式简介

在定时任务页面，Cron 表达式用于设置消息发送时间，格式为：`分 时 日 月 星期`  
常用示例：

```
// * * * * *      每分钟执行一次
// 0 8 * * *      每天 8:00 执行
// 0 9 * * 1      每周一 9:00 执行
// */5 * * * *    每 5 分钟执行一次
// 0 0 1,15 * *   每月 1 日和 15 日 0:00 执行
```
更多用法请参考 [crontab.guru](https://crontab.guru/)

## 目录结构

```
.
├── public/              # 前端页面与静态资源
├── server.js            # 主服务端代码
├── package.json         # 依赖声明
├── Dockerfile           # Docker 支持
├── .gitignore           # Git 忽略配置
```

## 常见问题

- **端口占用**：如 3000 端口被占用，需先 kill 掉旧进程再启动。
- **二维码无法显示**：请确保 puppeteer 能正常启动 Chromium，且网络可访问 WhatsApp Web。
- **推送到 GitHub 失败**：请将 uploads、.wwebjs_auth、.wwebjs_cache、scheduledTasks.json 等大文件加入 .gitignore 并清理历史。

## 贡献与许可

欢迎提交 issue 和 PR，项目采用 MIT 许可证。 
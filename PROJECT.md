# 项目概述

这是一个基于 Node.js 的 WhatsApp API 应用程序，旨在通过 WhatsApp 发送消息并管理调度任务。该项目可能包含以下功能：

- **消息发送**：通过 WhatsApp API 发送消息。
- **Web 界面**：提供一个用户界面，用于交互和管理应用程序。
- **任务调度**：管理和执行定时任务。
- **API 集成**：与 WhatsApp 服务的 API 进行集成。

## 文件结构

- `server.js`: 后端服务器逻辑。
- `public/`: 包含前端静态文件 (HTML, CSS, JavaScript)。
  - `public/index.html`: 主页面。
  - `public/client.js`: 前端 JavaScript 逻辑。
  - `public/style.css`: 样式文件。
  - `public/login.html`: 登录页面。
  - `public/schedule.html`: 任务调度页面。
  - `public/lang.js`: 语言相关文件。
- `scheduledTasks.json`: 存储调度任务的配置文件。
- `package.json`: Node.js 项目的依赖和脚本配置。
- `Dockerfile`: 用于 Docker 容器化部署的配置文件。
- `DEPLOY_NORTHFLANK.md`: Northflank 部署指南。

## 使用方式

用户可以通过 Web 界面与应用程序交互，发送消息，并管理调度任务。部署可以通过 Docker 进行。有关如何在 Northflank 上部署的详细说明，请参阅 `DEPLOY_NORTHFLANK.md`。

## 核心参数

- WhatsApp API 凭证 (未在文件中明确，可能在环境变量或配置中)。
- 调度任务的配置。
- `LOGIN_PASSWORD` 环境变量 (用于登录认证)。

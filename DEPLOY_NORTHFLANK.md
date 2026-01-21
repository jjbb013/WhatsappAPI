# Northflank 部署指南

本指南将帮助您在 Northflank 平台上部署您的 WhatsApp API 项目，并解决在生产环境中遇到的常见问题，特别是关于数据持久化和安全性方面。

## 1. 概述

Northflank 是一个强大的云平台，支持 Docker 容器化部署，非常适合运行您的 Node.js 应用程序。为了确保您的应用稳定运行并持久保存重要数据，我们需要进行一些配置。

## 2. 配置持久化存储

您的应用会生成 WhatsApp 会话文件 (`.wwebjs_auth` 目录)、调度任务 (`scheduledTasks.json`) 和上传的图片 (`uploads` 目录)。这些数据在容器重启后会丢失。为了解决这个问题，我们需要使用 Northflank 的持久化存储卷功能。

**什么是持久化存储卷？**

持久化存储卷就像是您的应用容器可以访问的一个“硬盘空间”，它独立于容器的生命周期。即使容器被销毁并重新创建，存储卷中的数据也不会丢失。

**配置步骤：**

1.  **在 Northflank 创建存储卷：**
    *   登录您的 Northflank 账户。
    *   导航到您的项目。
    *   在左侧菜单中找到 `Storage` 或 `持久化存储` 选项，点击创建新的存储卷。
    *   为存储卷命名，例如 `whatsapp-data`。
    *   选择合适的存储类型和大小（例如 1GB 或 5GB 应该足够）。

2.  **将存储卷挂载到服务：**
    *   当您创建或编辑您的服务时，在配置页面找到 `Storage` 或 `存储` 部分。
    *   添加一个新的挂载点，选择您刚才创建的 `whatsapp-data` 存储卷。
    *   **重要：** 将存储卷挂载到容器内部的以下路径：
        *   `/usr/src/app/.wwebjs_auth` (用于 WhatsApp 会话文件)
        *   `/usr/src/app/scheduledTasks.json` (用于调度任务文件)
        *   `/usr/src/app/uploads` (用于上传的图片)

    *   **如何挂载单个文件？** 对于 `scheduledTasks.json`，您可以将整个存储卷挂载到 `/usr/src/app/`，这样 `scheduledTasks.json` 就会自动存储在存储卷中。或者，您可以创建一个特定的文件挂载点。

## 3. 使用环境变量管理密码

您的 `server.js` 文件中硬编码了一个登录密码。这不安全，也使得修改密码不方便。我们应该使用环境变量来管理它。

**修改 `server.js`：**

打开 `server.js` 文件，找到以下代码：

```javascript
    if (password === '984819') {
```

将其修改为从环境变量读取密码。我们将使用 `process.env.LOGIN_PASSWORD`。如果环境变量不存在，可以设置一个默认值。

```javascript
    const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || 'your_default_secure_password'; // 建议设置一个默认值，但生产环境应通过环境变量提供
    if (password === LOGIN_PASSWORD) {
```

**在 Northflank 配置环境变量：**

1.  在 Northflank 服务的配置页面中，找到 `Environment Variables` 或 `环境变量` 部分。
2.  添加一个新的环境变量。
3.  **名称 (Name):** `LOGIN_PASSWORD`
4.  **值 (Value):** 设置您的安全密码（例如：`MySuperSecurePassword123`）。

## 4. API Key 管理

目前 API Key 是在服务器启动时生成的，并且只存储在内存中。这意味着每次部署或服务器重启后，API Key 都会改变，前端或其他 API 调用方需要获取新的 Key。对于简单的用例，您可以在前端页面上显示生成的 API Key，让用户知道当前的 Key。

**一个简单的改进方案（在前端显示 API Key）：**

您可以在 `/public/index.html` 或 `/public/client.js` 中修改，当客户端成功连接并收到 `ready` 事件时，显示从后端传来的 `apiKey`。

目前 `server.js` 中的 `broadcast` 函数在 `ready` 事件时会发送 `apiKey`：

```javascript
    broadcast({ type: 'ready', apiKey: apiKey });
```

您需要在 `public/client.js` 中捕获这个事件并显示它。例如，在您的 `client.js` 中找到处理 `ready` 事件的部分，并添加代码来更新 UI。

## 5. Northflank 部署步骤

1.  **连接您的 Git 仓库：** 在 Northflank 中创建一个新服务，并将其连接到您的 GitHub/GitLab/Bitbucket 仓库。
2.  **配置构建过程：** Northflank 会自动检测您的 `Dockerfile`。确保构建类型设置为 `Docker Image`。
3.  **配置服务：**
    *   **端口：** 您的应用监听 `PORT` 环境变量或默认 3000。Northflank 会自动处理端口映射。
    *   **环境变量：** 添加上面提到的 `LOGIN_PASSWORD` 环境变量。
    *   **存储卷：** 挂载持久化存储卷。
4.  **部署：** 触发部署，Northflank 将会构建您的 Docker 镜像并运行服务。

遵循这些步骤，您的 WhatsApp API 项目应该能够在 Northflank 上更稳定、更安全地运行。

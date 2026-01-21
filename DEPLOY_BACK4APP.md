# Back4App 部署说明文档

本项目为 Node.js + Express + whatsapp-web.js 的 WhatsApp API 服务，适合部署在 Back4App 的 Node.js App Hosting 平台。

---

## 一、准备工作

1. **确保项目结构如下：**
    - `package.json`（包含 `start` 脚本）
    - `server.js`（主服务端入口，监听 `process.env.PORT`）
    - `public/`（前端静态资源）
    - 其他依赖文件
2. **本地测试通过**，可用 `npm install && npm start` 启动。

---

## 二、在 Back4App 创建 Node.js App

1. 登录 [Back4App 控制台](https://dashboard.back4app.com/apps)
2. 点击“Create a new App” → 选择“NodeJS App Hosting”
3. 填写 App 名称，创建 App

---

## 三、上传代码到 Back4App

有两种方式：

### 方式一：通过 GitHub 自动部署
1. 在 Back4App 控制台选择“Connect to GitHub”
2. 授权并选择你的仓库（如 `WhatsappAPI`）
3. Back4App 会自动拉取主分支代码并部署

### 方式二：手动上传 ZIP 包
1. 在本地将项目文件（不含 node_modules、.git 等）压缩为 ZIP
2. 在 Back4App 控制台选择“Upload ZIP”上传

---

## 四、环境变量设置（可选）
如需自定义端口、API 密钥等，可在 Back4App 控制台的“Environment Variables”页面添加，例如：

```
PORT=3000
API_KEY=your_api_key
```

---

## 五、启动与访问
1. 部署完成后，Back4App 会自动运行 `npm install` 和 `npm start`
2. 控制台会显示分配的公网访问地址（如 `https://your-app-name.b4a.run`）
3. 访问该地址即可使用 Web 前端和 API 服务

---

## 六、常见问题

- **依赖安装失败**：请检查 `package.json` 是否完整，依赖版本是否正确。
- **端口监听问题**：务必监听 `process.env.PORT`，不要写死端口号。
- **静态资源无法访问**：确保 `public/` 目录存在，并在 `server.js` 中用 `express.static` 托管。
- **环境变量未生效**：请在 Back4App 控制台正确设置。
- **Puppeteer/Chromium 依赖**：如需自定义 Chromium 路径，可设置 `PUPPETEER_EXECUTABLE_PATH` 环境变量。

---

如有更多问题，请参考 Back4App 官方文档或联系开发者。 
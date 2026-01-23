# WhatsApp API - Northflank 部署指南

## 📋 概述

本指南详细说明如何在 Northflank 平台上部署 WhatsApp API 服务，使用 Addon 方式进行数据存储，确保服务的高可用性和数据持久化。

## 🚀 快速部署

### 1. 创建新服务

1. 登录 Northflank 控制台
2. 点击 **"Create Service"**
3. 选择 **"Container Service"**
4. 配置基本信息：
   - **服务名称**: `whatsapp-api`
   - **仓库**: `jjbb013/WhatsappAPI`
   - **分支**: `main`
   - **Dockerfile**: 使用项目根目录的 Dockerfile

### 2. 配置 Addon 存储

#### 🔑 WhatsApp 会话存储 Addon
1. 在服务配置页面，点击 **"Add Addon"**
2. 选择 **"Volume Addon"**
3. 配置参数：
   ```
   名称: whatsapp-session
   类型: Volume
   大小: 100Mi
   挂载路径: /usr/src/app/.wwebjs_auth
   ```

#### 📁 文件上传存储 Addon
1. 再次点击 **"Add Addon"**
2. 选择 **"Volume Addon"**
3. 配置参数：
   ```
   名称: whatsapp-uploads
   类型: Volume
   大小: 1Gi
   挂载路径: /usr/src/app/uploads
   ```

### 3. 环境变量配置

在 **"Environment Variables"** 部分添加：

```bash
NODE_ENV=production
PORT=3000
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### 4. 资源配置

设置最小资源配置：
- **CPU**: 0.5 核心
- **内存**: 512 MiB
- **存储**: 2 GiB

### 5. 端口配置

- **内部端口**: 3000
- **外部端口**: 80/443 (自动分配)
- **协议**: HTTP
- **公开访问**: ✅ 是

### 6. 部署

点击 **"Deploy"** 按钮开始部署。

## 🔧 配置详解

### Addon 配置原理

#### 为什么使用 Addon 而不是普通 Volume？

1. **高可用性**: Addon 具有备份和恢复功能
2. **独立扩展**: 可以独立扩展存储容量
3. **数据安全**: 内置数据保护和备份机制
4. **监控集成**: 更好的监控和告警支持

#### Addon 挂载映射

```yaml
# 会话存储 Addon
whatsapp-session → /usr/src/app/.wwebjs_auth
  - 存储 WhatsApp 登录会话
  - 保存认证状态
  - 支持多设备连接

# 文件上传 Addon  
whatsapp-uploads → /usr/src/app/uploads
  - 存储定时消息的图片文件
  - 保存用户上传的媒体文件
  - 支持文件共享和备份
```

### 环境变量说明

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境模式 |
| `PORT` | `3000` | 服务监听端口 |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Chrome 浏览器路径 |

## 📱 使用流程

### 首次登录

1. **访问服务**: 部署完成后，访问 Northflank 提供的服务 URL
2. **扫码登录**: 使用手机 WhatsApp 扫描页面上的 QR 码
3. **自动跳转**: 登录成功后 2 秒自动跳转到批量发送页面
4. **获取 API Key**: 复制显示的 API Key（仅显示一次）

### API 使用示例

#### 发送单条消息
```bash
curl -X POST https://your-service.northflank.com/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+8613812345678",
    "message": "Hello from API!"
  }'
```

#### 批量发送消息
```bash
curl -X POST https://your-service.northflank.com/batch-send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": ["+8613812345678", "+8613812345679"],
    "message": "批量发送测试消息"
  }'
```

#### 定时发送消息
```bash
curl -X POST https://your-service.northflank.com/schedule \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "cron=0 9 * * *" \
  -F "number=+8613812345678" \
  -F "message=每日提醒消息" \
  -F "image=@/path/to/image.jpg"
```

## 🔍 故障排除

### 常见问题

#### 1. QR 码无法加载
**现象**: 页面显示空白或 QR 码一直转圈
**解决方案**:
- 检查服务日志是否有错误
- 确认 Chromium 依赖正确安装
- 重启服务

#### 2. 登录成功后立即断开
**现象**: 扫码成功后马上显示连接断开
**解决方案**:
- 清理会话 Addon 数据
- 检查 WhatsApp 账户状态
- 确认网络连接稳定

#### 3. 会话数据丢失
**现象**: 重启服务后需要重新登录
**解决方案**:
- 检查 `whatsapp-session` Addon 是否正确挂载
- 确认挂载路径正确
- 查看 Addon 存储状态

#### 4. 消息发送失败
**现象**: API 返回 503 错误
**解决方案**:
- 检查客户端连接状态
- 确认 API Key 有效
- 查看服务日志

### 日志查看命令

```bash
# 查看实时日志
northflank logs whatsapp-api --follow

# 查看构建日志
northflank logs whatsapp-api --build

# 查看最近的错误
northflank logs whatsapp-api --since=1h --level=error
```

### 监控配置

在 Northflank 中设置以下监控告警：

#### 性能告警
- CPU 使用率 > 80%
- 内存使用率 > 90%
- 磁盘使用率 > 85%

#### 可用性告警
- 健康检查失败
- 服务重启次数 > 3次/小时
- API 响应时间 > 5秒

## 🔄 更新和维护

### 更新部署

1. **代码更新**: 推送到 GitHub 主分支
2. **触发重部署**: 在 Northflank 中点击 "Redeploy"
3. **验证更新**: 检查新功能是否正常工作
4. **监控观察**: 观察服务运行状态

### 数据备份

Northflank Addon 自动提供：
- 每日数据备份
- 异地备份存储
- 一键数据恢复
- 备份版本管理

### 扩容配置

#### 垂直扩容（推荐）
```yaml
CPU: 0.5 → 1.0 核心
内存: 512MiB → 1GiB
存储: 2GiB → 5GiB
```

#### 水平扩容（高级）
- 使用负载均衡器
- 配置多个实例
- 共享存储 Addon

## 🛡️ 安全配置

### 网络安全

1. **HTTPS 强制**: 在自定义域名中启用 SSL
2. **IP 白名单**: 限制 API 访问来源
3. **防火墙规则**: 仅开放必要端口

### 数据安全

1. **API 密钥管理**: 定期轮换 API 密钥
2. **访问控制**: 配置登录密码保护
3. **数据加密**: 使用 HTTPS 传输数据

## 📊 性能优化

### 推荐配置

#### 生产环境
```
CPU: 1.0 核心
内存: 1GiB
存储: 5GiB
实例数: 1
```

#### 高负载环境
```
CPU: 2.0 核心
内存: 2GiB  
存储: 10GiB
实例数: 2-3
```

### 性能调优

1. **会话管理**: 定期清理过期会话
2. **文件清理**: 定期清理上传文件
3. **缓存优化**: 启用适当的缓存策略
4. **连接池**: 优化数据库连接

## 🎯 最佳实践

### 部署建议

1. **使用 Addon 存储**: 确保数据持久化和高可用
2. **配置健康检查**: 自动检测和恢复服务
3. **设置监控告警**: 及时发现和处理问题
4. **定期备份数据**: 防止数据丢失

### 运维建议

1. **定期更新**: 保持依赖库最新版本
2. **监控日志**: 及时发现异常情况
3. **性能测试**: 定期进行负载测试
4. **安全审计**: 定期检查安全配置

## 📞 技术支持

### 获取帮助

1. **文档参考**: 查看项目 README 和 API 文档
2. **社区支持**: GitHub Issues 和讨论区
3. **官方支持**: Northflank 官方文档和支持
4. **问题报告**: 创建 GitHub Issue 报告问题

### 联系方式

- **GitHub**: [jjbb013/WhatsappAPI](https://github.com/jjbb013/WhatsappAPI)
- **问题反馈**: [Issues](https://github.com/jjbb013/WhatsappAPI/issues)
- **功能建议**: [Discussions](https://github.com/jjbb013/WhatsappAPI/discussions)

---

🎉 **恭喜！** 您的 WhatsApp API 服务现已成功部署在 Northflank 上，具备高可用性、数据持久化和自动恢复能力。
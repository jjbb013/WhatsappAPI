#!/bin/bash

echo "🧪 WhatsApp API 测试脚本"
echo "====================="

# 设置基础URL（这里使用本地测试，部署时需要替换为实际URL）
BASE_URL="http://localhost:3000"
API_KEY=""

echo "📍 测试URL: $BASE_URL"

echo ""
echo "1. 测试服务健康状态..."
curl -s "$BASE_URL/health" | python3 -m json.tool || echo "❌ 健康检查失败"

echo ""
echo "2. 测试主页访问..."
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$BASE_URL/" || echo "❌ 主页访问失败"

echo ""
echo "3. 测试定时任务页面..."
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$BASE_URL/schedule.html" || echo "❌ 定时任务页面访问失败"

echo ""
echo "4. 测试登录页面..."
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$BASE_URL/login.html" || echo "❌ 登录页面访问失败"

echo ""
echo "5. 检查WebSocket连接..."
echo "   WebSocket需要通过浏览器测试，请手动访问主页检查连接状态"

echo ""
echo "6. 验证关键文件存在..."
files_to_check=(
    "server.js"
    "package.json" 
    "Dockerfile"
    "public/client.js"
    "public/index.html"
    "public/schedule.html"
    "NORTHFLANK_DEPLOYMENT_CN.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 缺失"
    fi
done

echo ""
echo "7. 检查关键依赖..."
if [ -f "package.json" ]; then
    echo "📦 关键依赖版本:"
    grep -E "(whatsapp-web.js|express|puppeteer)" package.json | sed 's/^/   /'
fi

echo ""
echo "8. Docker构建测试..."
if command -v docker &> /dev/null; then
    echo "🐳 构建Docker镜像..."
    docker build -t whatsapp-test . >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Docker构建成功"
        docker rmi whatsapp-test >/dev/null 2>&1
    else
        echo "❌ Docker构建失败"
    fi
else
    echo "⚠️  Docker未安装，跳过构建测试"
fi

echo ""
echo "9. 检查Addon配置..."
if [ -f "northflank.json" ]; then
    echo "📋 Addon配置检查:"
    grep -A 10 "addons" northflank.json | sed 's/^/   /'
else
    echo "❌ northflank.json配置文件缺失"
fi

echo ""
echo "====================="
echo "🎉 测试完成！"
echo ""
echo "📝 部署前检查清单:"
echo "□ 所有HTTP端点返回200状态码"
echo "□ Docker镜像构建成功"
echo "□ Addon配置正确"
echo "□ 所有关键文件存在"
echo "□ 依赖版本是最新的"
echo ""
echo "🚀 准备部署到Northflank！"
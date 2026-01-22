# Northflank Deployment Guide

## Overview
This WhatsApp API server is optimized for deployment on Northflank with proper containerization, volume management, and health checks.

## Quick Deploy

### 1. Connect Repository
- Link your GitHub repository `jjbb013/WhatsappAPI` to Northflank
- Select the main branch

### 2. Container Configuration
- **Image**: Use the provided Dockerfile
- **Port**: 3000 (HTTP)
- **Resources**: Minimum 0.5 CPU, 512Mi RAM

### 3. Environment Variables
```bash
NODE_ENV=production
PORT=3000
```

### 4. Persistent Volumes
Create two persistent volumes:

#### Volume 1: WhatsApp Session
- **Path**: `/usr/src/app/.wwebjs_auth`
- **Name**: `whatsapp-session`
- **Size**: 100Mi
- **Purpose**: Stores WhatsApp authentication session

#### Volume 2: File Uploads
- **Path**: `/usr/src/app/uploads`
- **Name**: `whatsapp-uploads`
- **Size**: 1Gi
- **Purpose**: Stores uploaded images for scheduled messages

### 5. Health Check
- **Path**: `/`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

## Features

### ✅ Optimized for Northflank
- Multi-stage Docker build for faster deployments
- Slim Node.js image for reduced size
- Health checks for automatic restarts
- Non-root user for security

### ✅ Persistent Storage
- WhatsApp sessions persist across deployments
- Uploaded images are preserved
- No data loss during container restarts

### ✅ Auto-Scaling Ready
- Stateless application design
- External session storage via volumes
- Load balancer compatible

### ✅ Security
- Non-root container execution
- Minimal system dependencies
- No sensitive data in container layers

## Deployment Steps

### 1. Create New Service
1. Go to Northflank dashboard
2. Click "Create Service"
3. Select "Container Service"

### 2. Configure Service
- **Name**: `whatsapp-api`
- **Repository**: `jjbb013/WhatsappAPI`
- **Branch**: `main`
- **Dockerfile**: Use existing Dockerfile

### 3. Set Resources
- **CPU**: 0.5 (minimum)
- **RAM**: 512Mi (minimum)
- **Storage**: 2Gi total

### 4. Add Volumes
```
Volume 1:
- Mount Path: /usr/src/app/.wwebjs_auth
- Size: 100Mi
- Type: Persistent

Volume 2:
- Mount Path: /usr/src/app/uploads
- Size: 1Gi
- Type: Persistent
```

### 5. Configure Port
- **Port**: 3000
- **Protocol**: HTTP
- **Public**: Yes

### 6. Deploy
Click "Deploy" and wait for the build to complete.

## Post-Deployment

### 1. Verify Health Check
- Check service logs
- Ensure health check passes
- Verify service is "Running"

### 2. Test WhatsApp Connection
1. Open the service URL
2. Scan the QR code with WhatsApp
3. Verify API key generation
4. Test auto-redirect to batch send page

### 3. Configure Custom Domain (Optional)
- Add your custom domain in Northflank
- Update SSL certificate
- Update any webhook URLs

## Troubleshooting

### Common Issues

#### 1. Health Check Failing
- Check if port 3000 is accessible
- Verify the application started successfully
- Review service logs

#### 2. WhatsApp Session Lost
- Ensure persistent volume is mounted correctly
- Check volume path: `/usr/src/app/.wwebjs_auth`
- Verify volume has sufficient space

#### 3. Image Uploads Failing
- Check uploads volume mount: `/usr/src/app/uploads`
- Verify write permissions
- Ensure sufficient storage space

#### 4. Container Crashes
- Check resource allocation (CPU/RAM)
- Review application logs
- Verify all dependencies are installed

### Log Commands
```bash
# View service logs
northflank logs whatsapp-api

# View build logs
northflank logs whatsapp-api --build

# Real-time logs
northflank logs whatsapp-api --follow
```

## API Usage

Once deployed, use the service URL to access:

- **Main Page**: `https://your-service.northflank.com/`
- **API Endpoint**: `https://your-service.northflank.com/send`
- **Batch Send**: `https://your-service.northflank.com/batch-send`
- **Schedule**: `https://your-service.northflank.com/schedule.html`

## Monitoring

Northflank provides built-in monitoring for:
- CPU usage
- Memory consumption
- Network traffic
- Health check status

Set up alerts for:
- High CPU (>80%)
- High memory (>90%)
- Health check failures
- Container restarts

## Scaling

For higher traffic:
1. Increase CPU/RAM allocation
2. Enable horizontal scaling
3. Add load balancer
4. Consider Redis for session storage

## Support

For deployment issues:
- Check Northflank documentation
- Review service logs
- Verify configuration matches this guide
- Test locally with `docker build`
# 🚂 Railway Deployment Guide - FIFA Smart Stadium AI

**Status**: ✅ Ready for Railway deployment  
**Date**: 2026-07-18

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [x] Git repository ready: https://github.com/shruti9414/FIFA-Smart-Stadium-AI
- [x] Code committed and pushed
- [x] package.json configured correctly
- [x] Build script: `npm run build`
- [x] Start script: `npm run start`
- [x] Procfile created
- [x] railway.json configured

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Connect Railway to GitHub**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize Railway with GitHub
5. Select repository: `shruti9414/FIFA-Smart-Stadium-AI`
6. Select branch: `main`

### **Step 2: Configure Environment Variables**

Railway will need these environment variables set:

```env
# Database Configuration
DB_HOST=your_railway_mysql_host
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=fifa_smart_stadium

# AI APIs
GROK_API_KEY=your_grok_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Application
NODE_ENV=production
SOCKET_PORT=3000
NEXT_PUBLIC_SOCKET_URL=https://your_railway_domain.railway.app
```

### **Step 3: Add MySQL Database**

1. In Railway project dashboard
2. Click "+ New Service"
3. Select "MySQL"
4. Railway will auto-configure DB connection

### **Step 4: Configure Build & Deploy**

Railway automatically detects:
- ✅ Node.js environment (from package.json)
- ✅ Build command (npm run build)
- ✅ Start command (Procfile)
- ✅ Port (3000)

### **Step 5: Deploy**

1. Push changes to main branch
2. Railway auto-detects and deploys
3. Watch deployment logs in dashboard
4. Get live URL once deployed

---

## 🔧 ENVIRONMENT VARIABLES SETUP

### **For Railway Dashboard:**

Go to **Project Settings → Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DB_HOST` | Railway MySQL host | Auto-provided if using Railway MySQL |
| `DB_PORT` | `3306` | Standard MySQL port |
| `DB_USER` | `root` | Default user |
| `DB_PASSWORD` | Your secure password | Generate strong password |
| `DB_NAME` | `fifa_smart_stadium` | Database name |
| `NODE_ENV` | `production` | Required for Next.js |
| `GROK_API_KEY` | Your Grok key | From https://console.x.ai/ |
| `GEMINI_API_KEY` | Your Gemini key | From https://aistudio.google.com/apikey |
| `NEXT_PUBLIC_SOCKET_URL` | `https://yourapp.railway.app` | Public domain for WebSocket |
| `SOCKET_PORT` | `3000` | Internal port |

---

## 🗄️ DATABASE SETUP

### **Option 1: Railway MySQL Service**

1. Add MySQL service from Railway dashboard
2. Railway auto-provides:
   - DB_HOST
   - DB_PORT
   - DB_USER
   - DB_PASSWORD
3. Database initializes on first deploy
4. Run migrations if needed

### **Option 2: External MySQL Database**

1. Use existing MySQL provider (e.g., TiDB Cloud, AWS RDS)
2. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
3. Ensure database exists: `fifa_smart_stadium`
4. Schema will initialize automatically

### **Run Database Setup Script**

After deployment, you may need to initialize the database:

```bash
npm run db:init    # Initialize schema
npm run db:seed    # Seed sample data
```

---

## 📝 DEPLOYMENT CONFIGURATION FILES

### **Procfile**
```
web: npm run start
```
Tells Railway how to start the app.

### **railway.json**
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "on_failure",
    "restartPolicyMaxRetries": 5
  }
}
```
Railway-specific configuration for build and deploy.

---

## ✅ HEALTH CHECKS

Once deployed, verify:

1. **Health Check**: `GET /` should return 200
2. **Demo Page**: `GET /demo` accessible
3. **API Endpoints**: `GET /api/health` returns status
4. **Socket.io**: WebSocket connection works
5. **Database**: Queries execute successfully

---

## 🚨 TROUBLESHOOTING

### **Build Fails**
- Check build logs in Railway dashboard
- Ensure all dependencies in package.json
- Verify Node.js version compatible

### **Database Connection Error**
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Check MySQL service is running
- Ensure database `fifa_smart_stadium` exists

### **API Key Issues**
- Verify GROK_API_KEY is correct and active
- Verify GEMINI_API_KEY is correct and active
- Check API quotas in respective dashboards

### **Socket.io Not Working**
- Verify NEXT_PUBLIC_SOCKET_URL is correct
- Check firewall allows WebSocket connections
- Verify SOCKET_PORT=3000

### **Slow Deployment**
- First build may take 5-10 minutes
- Subsequent deploys are faster (cached)
- Check Railway dashboard build logs

---

## 📊 MONITORING

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage
- **Deployments**: History and status
- **Alerts**: Notification on failures

---

## 🔄 AUTO-DEPLOYMENT

Railway automatically deploys when:
- You push to `main` branch
- CI/CD completes successfully
- No secrets leaked in code

To disable auto-deploy:
- Go to **Service Settings → Auto-Deploy** → Toggle OFF

---

## 🎯 DEPLOYMENT CHECKLIST

- [x] Code pushed to GitHub
- [x] package.json has correct build/start scripts
- [x] Procfile configured
- [x] railway.json created
- [x] Environment variables documented
- [x] Database configuration ready
- [x] API keys obtained
- [x] NEXT_PUBLIC_SOCKET_URL planned

---

## 📈 POST-DEPLOYMENT

After successful deployment:

1. **Test the App**
   - Visit live URL
   - Test demo page
   - Verify API endpoints
   - Check Socket.io

2. **Monitor Logs**
   - Watch for errors
   - Check performance
   - Monitor API response times

3. **Enable Alerts**
   - Set up notifications
   - Configure thresholds
   - Enable auto-restart

4. **Setup Domain** (Optional)
   - Custom domain
   - SSL certificate (Railway auto-handles)
   - DNS configuration

---

## 🚀 LIVE URL

After deployment, your app will be at:
```
https://[your-project-name].railway.app
```

Share this URL with judges for live demo! 🎬

---

## 📞 SUPPORT

- Railway Docs: https://docs.railway.app
- Railway Status: https://status.railway.app
- GitHub Issue: https://github.com/shruti9414/FIFA-Smart-Stadium-AI/issues

---

**Ready to deploy to Railway!** 🚂✨

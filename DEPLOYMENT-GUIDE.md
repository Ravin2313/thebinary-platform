# Deployment Guide - Project Shop

Is guide me aap seekhenge ki apni Project Shop website ko kaise deploy karein.

## Pre-Deployment Checklist

- [ ] MongoDB Atlas account setup
- [ ] Strong admin password set
- [ ] JWT secret changed
- [ ] Contact details updated
- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Git repository ready (optional)

## Option 1: Deploy on Heroku (Recommended for Beginners)

### Step 1: Heroku Account Setup
1. https://heroku.com pe jao
2. Free account banao
3. Heroku CLI install karo: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: MongoDB Atlas Setup
1. https://www.mongodb.com/cloud/atlas pe jao
2. Free cluster create karo
3. Database user banao
4. Network Access me "Allow from Anywhere" (0.0.0.0/0) add karo
5. Connection string copy karo

### Step 3: Prepare Project
```bash
# Git initialize karo (agar nahi kiya)
git init
git add .
git commit -m "Initial commit"
```

### Step 4: Create Heroku App
```bash
# Heroku login
heroku login

# App create karo
heroku create your-project-shop-name

# Environment variables set karo
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_random_secret_key_123456"
heroku config:set ADMIN_EMAIL="admin@projectshop.com"
heroku config:set ADMIN_PASSWORD="your_strong_password"
```

### Step 5: Deploy
```bash
# Deploy karo
git push heroku main

# Ya agar master branch hai
git push heroku master

# Logs check karo
heroku logs --tail
```

### Step 6: Open App
```bash
heroku open
```

Your app will be live at: `https://your-project-shop-name.herokuapp.com`

---

## Option 2: Deploy on Render (Free & Easy)

### Step 1: Render Account
1. https://render.com pe jao
2. GitHub se sign up karo

### Step 2: MongoDB Atlas Setup
(Same as Heroku - Step 2)

### Step 3: Create Web Service
1. Dashboard me "New +" click karo
2. "Web Service" select karo
3. GitHub repository connect karo (ya public repo URL dalo)
4. Settings:
   - **Name:** project-shop
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 4: Environment Variables
Add karo:
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@projectshop.com
ADMIN_PASSWORD=your_password
PORT=5000
```

### Step 5: Deploy
"Create Web Service" click karo. Automatic deploy hoga!

---

## Option 3: Deploy on Railway

### Step 1: Railway Account
1. https://railway.app pe jao
2. GitHub se sign up karo

### Step 2: New Project
1. "New Project" click karo
2. "Deploy from GitHub repo" select karo
3. Repository select karo

### Step 3: Add MongoDB
1. "New" → "Database" → "Add MongoDB"
2. Connection string automatically mil jayega

### Step 4: Environment Variables
Variables tab me add karo:
```
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@projectshop.com
ADMIN_PASSWORD=your_password
```

### Step 5: Deploy
Automatic deploy ho jayega!

---

## Option 4: Deploy on VPS (DigitalOcean, AWS, etc.)

### Requirements
- Ubuntu 20.04+ server
- Root/sudo access
- Domain name (optional)

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional - use Atlas recommended)
# Or use MongoDB Atlas

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (web server)
sudo apt install -y nginx
```

### Step 2: Upload Project
```bash
# Git se clone karo
git clone your-repo-url
cd project-shop-platform

# Dependencies install karo
npm install

# .env file create karo
nano .env
# Add your environment variables
```

### Step 3: Start with PM2
```bash
# Start app
pm2 start backend/server.js --name project-shop

# Auto-start on reboot
pm2 startup
pm2 save
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/project-shop
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/project-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

---

## Option 5: Deploy on Vercel (Frontend Only)

Agar aap frontend aur backend separately deploy karna chahte ho:

### Backend on Render/Railway
(Follow Option 2 or 3)

### Frontend on Vercel
1. Frontend folder ko separate repo me dalo
2. Vercel pe deploy karo
3. API calls me backend URL update karo

---

## Post-Deployment Steps

### 1. Test Everything
- [ ] Home page load ho raha hai
- [ ] Projects list aa raha hai
- [ ] Project detail page work kar raha hai
- [ ] Contact form submit ho raha hai
- [ ] Admin login work kar raha hai
- [ ] Admin panel me projects add/edit/delete ho raha hai
- [ ] Images upload ho rahe hain

### 2. Update Contact Details
Frontend files me apne actual contact details update karo:
- Phone number
- WhatsApp number
- Email address

### 3. Add Sample Projects
Admin panel me 5-10 sample projects add karo

### 4. Monitor
```bash
# Heroku
heroku logs --tail

# PM2
pm2 logs project-shop

# Railway/Render
Dashboard me logs dekho
```

### 5. Backup
Regular database backups setup karo:
- MongoDB Atlas automatic backups
- Ya manual exports

---

## Custom Domain Setup

### Heroku
```bash
heroku domains:add www.your-domain.com
```
Then add CNAME record in your domain DNS.

### Render/Railway
Dashboard me custom domain add karo aur DNS settings follow karo.

---

## Troubleshooting

### Issue: App crash ho raha hai
```bash
# Logs check karo
heroku logs --tail

# Common fixes:
# 1. Check MONGODB_URI correct hai
# 2. Check all environment variables set hain
# 3. Check package.json me start script hai
```

### Issue: Images upload nahi ho rahe
- Check uploads folder exists
- Check file permissions
- Consider using cloud storage (Cloudinary, AWS S3)

### Issue: MongoDB connection error
- Check MongoDB Atlas IP whitelist
- Check connection string correct hai
- Check database user credentials

---

## Performance Optimization

### 1. Enable Compression
```javascript
// server.js me add karo
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching
```javascript
// Static files ke liye
app.use(express.static('frontend', { maxAge: '1d' }));
```

### 3. Use CDN
Images ko CDN pe host karo (Cloudinary recommended)

### 4. Database Indexing
```javascript
// Project model me
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1 });
```

---

## Security Best Practices

1. ✅ Strong passwords use karo
2. ✅ JWT secret random aur long rakho
3. ✅ HTTPS enable karo
4. ✅ Rate limiting add karo
5. ✅ Input validation implement karo
6. ✅ Regular updates karo
7. ✅ Backup regularly
8. ✅ Monitor logs

---

## Cost Estimation

### Free Tier (Good for Starting)
- **Heroku:** Free (with limitations)
- **Render:** Free (with limitations)
- **Railway:** $5 credit/month free
- **MongoDB Atlas:** 512MB free
- **Total:** FREE

### Paid (For Production)
- **Heroku Hobby:** $7/month
- **Render Starter:** $7/month
- **Railway:** ~$5-10/month
- **MongoDB Atlas:** $9/month (M2)
- **Domain:** $10-15/year
- **Total:** ~$25-35/month

---

## Support & Maintenance

### Regular Tasks
- Weekly: Check logs for errors
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: Renew domain/SSL

### Monitoring Tools
- Heroku Dashboard
- MongoDB Atlas Monitoring
- Google Analytics (add to frontend)
- Uptime monitoring (UptimeRobot - free)

---

**Congratulations! 🎉 Your Project Shop is now live!**

Share your website link with students and start selling projects!

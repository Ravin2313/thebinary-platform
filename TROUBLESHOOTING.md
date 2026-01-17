# Troubleshooting Guide - Project Shop

Common problems aur unke solutions.

## Installation Issues

### Problem 1: npm install fail ho raha hai

**Error:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**
```bash
# Option 1: Clear cache
npm cache clean --force
npm install

# Option 2: Use sudo (Linux/Mac)
sudo npm install

# Option 3: Fix permissions
sudo chown -R $USER:$USER ~/.npm
```

---

### Problem 2: Node version error

**Error:**
```
error: The engine "node" is incompatible
```

**Solution:**
```bash
# Check Node version
node --version

# Update Node.js to v14 or higher
# Download from: https://nodejs.org/
```

---

## MongoDB Issues

### Problem 3: MongoDB connection failed

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check MongoDB running hai
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Ya MongoDB Atlas use karo (recommended)
```

---

### Problem 4: MongoDB Atlas connection error

**Error:**
```
MongooseServerSelectionError: connection timed out
```

**Solution:**
1. MongoDB Atlas dashboard me jao
2. Network Access → Add IP Address
3. "Allow Access from Anywhere" (0.0.0.0/0) select karo
4. Connection string check karo:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```
5. Username aur password me special characters ho toh encode karo

---

## Server Issues

### Problem 5: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Option 1: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in .env
PORT=3000
```

---

### Problem 6: Server crash ho raha hai

**Error:**
```
Server crashed unexpectedly
```

**Solution:**
```bash
# Check logs
npm start

# Common causes:
# 1. .env file missing
# 2. MongoDB not connected
# 3. Syntax error in code

# Debug mode me run karo
node --inspect backend/server.js
```

---

## Frontend Issues

### Problem 7: Projects load nahi ho rahe

**Symptoms:**
- "Loading projects..." message stuck hai
- Empty grid dikha raha hai

**Solution:**
1. Browser console check karo (F12)
2. Network tab me API calls dekho
3. Backend running hai check karo
4. CORS error hai toh backend me cors enable karo

```javascript
// server.js me check karo
const cors = require('cors');
app.use(cors());
```

---

### Problem 8: Images display nahi ho rahe

**Symptoms:**
- Broken image icons
- 404 errors for images

**Solution:**
```bash
# 1. uploads folder exists check karo
mkdir uploads

# 2. Static files serve ho rahe hain check karo
# server.js me:
app.use('/uploads', express.static('uploads'));

# 3. Image paths correct hain check karo
# Database me: /uploads/filename.jpg
```

---

## Admin Panel Issues

### Problem 9: Admin login nahi ho raha

**Error:**
```
Invalid credentials
```

**Solution:**
1. `.env` file check karo:
   ```
   ADMIN_EMAIL=admin@projectshop.com
   ADMIN_PASSWORD=admin123
   ```
2. Server restart karo
3. Browser console me errors check karo
4. Network tab me API response dekho

---

### Problem 10: Token expired error

**Error:**
```
Authentication required / Invalid token
```

**Solution:**
```javascript
// Logout karke phir se login karo
localStorage.removeItem('adminToken');
// Login page pe jao
```

---

### Problem 11: Project add nahi ho raha

**Symptoms:**
- Form submit hone ke baad error
- "Error saving project" message

**Solution:**
1. All required fields filled hain check karo
2. Images size check karo (max 5MB each)
3. Features aur technologies format check karo
4. Browser console me errors dekho
5. Server logs check karo

---

## File Upload Issues

### Problem 12: Images upload nahi ho rahe

**Error:**
```
Multer error / File upload failed
```

**Solution:**
```bash
# 1. uploads folder create karo
mkdir uploads

# 2. Permissions check karo (Linux/Mac)
chmod 755 uploads

# 3. File size limit check karo
# backend/routes/admin.js me multer config dekho

# 4. File type check karo
# Only jpg, jpeg, png, gif allowed
```

---

## Database Issues

### Problem 13: Duplicate key error

**Error:**
```
E11000 duplicate key error
```

**Solution:**
```javascript
// Unique field me duplicate value hai
// Check karo kaunsa field unique hai
// Different value use karo
```

---

### Problem 14: Validation error

**Error:**
```
ValidationError: Path `title` is required
```

**Solution:**
- Required fields fill karo
- Data type correct hai check karo
- Schema requirements dekho

---

## Deployment Issues

### Problem 15: Heroku deployment fail

**Error:**
```
Failed to compile
```

**Solution:**
```bash
# 1. package.json me start script check karo
"scripts": {
  "start": "node backend/server.js"
}

# 2. Node version specify karo
"engines": {
  "node": "18.x"
}

# 3. Environment variables set karo
heroku config:set MONGODB_URI=your_uri

# 4. Logs check karo
heroku logs --tail
```

---

### Problem 16: App deployed but not working

**Symptoms:**
- App open ho raha hai but blank page
- API calls fail ho rahe hain

**Solution:**
1. Environment variables check karo
2. MongoDB connection string correct hai
3. Build logs check karo
4. Browser console errors dekho
5. API endpoints correct hain

---

## Performance Issues

### Problem 17: Slow loading

**Symptoms:**
- Pages load hone me time lag raha hai
- Images slow load ho rahe hain

**Solution:**
```javascript
// 1. Database queries optimize karo
// Indexes add karo
projectSchema.index({ category: 1 });

// 2. Images compress karo
// Use image optimization tools

// 3. Pagination implement karo
// Limit results per page

// 4. Caching enable karo
app.use(express.static('frontend', { maxAge: '1d' }));
```

---

## Browser Issues

### Problem 18: CORS error

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
```javascript
// server.js me
const cors = require('cors');
app.use(cors({
  origin: '*', // Development
  // origin: 'https://yourdomain.com' // Production
}));
```

---

### Problem 19: LocalStorage not working

**Symptoms:**
- Admin login ke baad redirect nahi ho raha
- Token save nahi ho raha

**Solution:**
1. Browser cookies/storage enabled hai check karo
2. Incognito mode me try karo
3. Different browser me try karo
4. Browser console me localStorage check karo:
   ```javascript
   localStorage.getItem('adminToken')
   ```

---

## Common Mistakes

### ❌ Mistake 1: .env file missing
```bash
# Solution: Create .env file
cp .env.example .env
# Edit with your values
```

### ❌ Mistake 2: Wrong MongoDB URI
```bash
# Wrong:
MONGODB_URI=localhost:27017/project-shop

# Correct:
MONGODB_URI=mongodb://localhost:27017/project-shop
```

### ❌ Mistake 3: Forgot to restart server
```bash
# After changing .env or code
# Stop server (Ctrl+C)
# Start again
npm start
```

### ❌ Mistake 4: Wrong file paths
```javascript
// Wrong:
<img src="uploads/image.jpg">

// Correct:
<img src="/uploads/image.jpg">
```

---

## Debug Checklist

When something is not working:

1. [ ] Check browser console (F12)
2. [ ] Check server logs/terminal
3. [ ] Check MongoDB is running
4. [ ] Check .env file exists and correct
5. [ ] Check all dependencies installed
6. [ ] Check file permissions
7. [ ] Try restarting server
8. [ ] Try clearing browser cache
9. [ ] Try different browser
10. [ ] Check network tab for API calls

---

## Getting Help

### Before Asking for Help:

1. ✅ Read error message carefully
2. ✅ Check this troubleshooting guide
3. ✅ Search error on Google/Stack Overflow
4. ✅ Check README.md and other docs
5. ✅ Try basic debugging steps

### When Asking for Help:

Include:
- Error message (full text)
- What you were trying to do
- What you've already tried
- Your environment (OS, Node version, etc.)
- Relevant code snippets
- Screenshots if helpful

---

## Useful Commands

```bash
# Check versions
node --version
npm --version
mongod --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Check running processes
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# View logs
# Development:
npm start

# Production (PM2):
pm2 logs project-shop

# Heroku:
heroku logs --tail
```

---

## Still Having Issues?

1. Double-check all steps in SETUP-GUIDE.md
2. Make sure you're using latest code
3. Try on a fresh installation
4. Check if issue is environment-specific
5. Look for similar issues online

---

**Remember:** Most issues are simple configuration problems. Stay calm and debug step by step! 🐛🔧

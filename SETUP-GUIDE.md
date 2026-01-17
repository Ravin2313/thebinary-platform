# Quick Setup Guide - Project Shop

## 5 Minute Setup

### 1. Install Node.js
Agar Node.js install nahi hai:
- Download: https://nodejs.org/
- LTS version install karo
- Check: `node --version` aur `npm --version`

### 2. Install MongoDB

**Option A: Local MongoDB**
- Download: https://www.mongodb.com/try/download/community
- Install karo
- Start karo: `mongod`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. https://www.mongodb.com/cloud/atlas pe jao
2. Free account banao
3. Free cluster create karo
4. Connection string copy karo
5. `.env` file me paste karo

### 3. Project Setup

```bash
# Terminal me project folder me jao
cd project-shop-platform

# Dependencies install karo
npm install

# Uploads folder banao
mkdir uploads

# .env file check karo aur edit karo
```

### 4. Start Server

```bash
# Development mode
npm run dev

# Ya simple start
npm start
```

### 5. Open Browser

```
Website: http://localhost:5000
Admin: http://localhost:5000/admin/login.html
```

## Default Admin Login

```
Email: admin@projectshop.com
Password: admin123
```

**⚠️ Important:** Production me password change karna mat bhoolna!

## Common Issues & Solutions

### Issue 1: Port already in use
```bash
# .env file me PORT change karo
PORT=3000
```

### Issue 2: MongoDB connection error
```bash
# Check MongoDB running hai
mongod

# Ya .env me MongoDB Atlas URI use karo
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-shop
```

### Issue 3: npm install error
```bash
# Cache clear karo
npm cache clean --force
npm install
```

### Issue 4: Images upload nahi ho rahe
```bash
# uploads folder check karo
mkdir uploads

# Permissions check karo (Linux/Mac)
chmod 755 uploads
```

## Testing the Platform

### 1. Add Sample Project
1. Admin login karo
2. "Manage Projects" → "+ Add New Project"
3. Fill details:
   - Title: "E-Commerce Website"
   - Category: "Web Application"
   - Description: "Complete online shopping website with cart and payment"
   - Features: 
     ```
     User registration and login
     Product catalog
     Shopping cart
     Order management
     Admin panel
     ```
   - Technologies: `HTML, CSS, JavaScript, Node.js, MongoDB`
   - Price: `5000`
4. Save karo

### 2. Test Frontend
1. Home page kholo: `http://localhost:5000`
2. "Browse Projects" click karo
3. Project card pe click karo
4. "Contact for This Project" try karo

### 3. Test Contact Form
1. Contact page kholo
2. Form bharo
3. Submit karo
4. Admin dashboard me check karo

## Production Deployment Checklist

- [ ] Strong admin password set karo
- [ ] JWT_SECRET change karo (random string)
- [ ] MongoDB Atlas use karo (not local)
- [ ] Environment variables secure rakho
- [ ] HTTPS enable karo
- [ ] Contact details update karo (phone, email)
- [ ] Test all features
- [ ] Backup setup karo

## Next Steps

1. ✅ Admin panel me login karo
2. ✅ Apne projects add karo
3. ✅ Contact details update karo
4. ✅ Design customize karo (optional)
5. ✅ Domain buy karo aur deploy karo

## Need Help?

- Check README.md for detailed documentation
- Check console for errors
- Verify all dependencies installed
- Make sure MongoDB is running

---

Happy Coding! 🚀

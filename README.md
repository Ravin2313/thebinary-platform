# ⚡ TheBinary - Student Projects Platform

Ek complete platform jahan students apne liye ready-made projects dekh aur kharid sakte hain.

## Features

### Student Features
- ✅ Browse projects by category (College, School, Website, Mobile App, AI/ML, etc.)
- ✅ Search aur filter projects
- ✅ Project details, features, technologies dekh sakte hain
- ✅ Student reviews aur ratings
- ✅ Direct contact form
- ✅ WhatsApp aur call integration
- ✅ Responsive design (mobile-friendly)

### Admin Features
- ✅ Secure admin login
- ✅ Dashboard with statistics
- ✅ Add/Edit/Delete projects
- ✅ Upload multiple images
- ✅ Manage contact requests
- ✅ Update inquiry status
- ✅ View all reviews

## Tech Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- Multer (File Upload)

## Installation & Setup

### Prerequisites
- Node.js (v14 ya usse upar)
- MongoDB (local ya MongoDB Atlas)

### Step 1: Clone/Download Project
```bash
# Agar git use kar rahe ho
git clone <repository-url>
cd thebinary-platform

# Ya phir download karke extract karo
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
`.env` file ko edit karo aur apni details dalo:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thebinary
JWT_SECRET=apna_secret_key_yahan_dalo
ADMIN_EMAIL=admin@thebinary.com
ADMIN_PASSWORD=admin123
```

**Important:** Production me strong password use karo!

### Step 4: Create Uploads Folder
```bash
mkdir uploads
```

### Step 5: Start MongoDB
Agar local MongoDB use kar rahe ho:
```bash
mongod
```

Agar MongoDB Atlas use kar rahe ho, toh `.env` me connection string update karo.

### Step 6: Start Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server start ho jayega: `http://localhost:5000`

## Usage Guide

### Admin Panel Access
1. Browser me jao: `http://localhost:5000/admin/login.html`
2. Login credentials (default):
   - Email: `admin@thebinary.com`
   - Password: `admin123`

### Add New Project
1. Admin panel me login karo
2. "Manage Projects" pe click karo
3. "+ Add New Project" button click karo
4. Project details bharo:
   - Title
   - Category
   - Description
   - Features (ek line me ek feature)
   - Technologies (comma separated)
   - Price
   - Images (max 5)
   - Demo Link (optional)
5. "Save Project" click karo

### Manage Contact Requests
1. Dashboard me jao
2. Recent contact requests dikhengi
3. Status change kar sakte ho: New → In Progress → Completed

## Project Structure

```
thebinary/
├── backend/
│   ├── server.js              # Main server file
│   ├── models/
│   │   ├── Project.js         # Project schema
│   │   └── Contact.js         # Contact schema
│   ├── routes/
│   │   ├── projects.js        # Project routes
│   │   ├── contact.js         # Contact routes
│   │   └── admin.js           # Admin routes
│   └── middleware/
│       └── auth.js            # JWT authentication
├── frontend/
│   ├── index.html             # Home page
│   ├── projects.html          # Projects listing
│   ├── project-detail.html    # Single project view
│   ├── contact.html           # Contact page
│   ├── admin/
│   │   ├── login.html         # Admin login
│   │   ├── dashboard.html     # Admin dashboard
│   │   └── manage-projects.html
│   ├── css/
│   │   └── style.css          # All styles
│   └── js/
│       ├── main.js            # Frontend JS
│       └── admin.js           # Admin JS
├── uploads/                   # Project images
├── .env                       # Environment variables
├── package.json
└── README.md
```

## Customization

### Change Contact Details
1. `.env` file me apna email/phone update karo
2. Frontend files me search karo: `XXXXXXXXXX`
3. Replace karo apne actual phone number se

### Change Colors/Design
`frontend/css/style.css` file edit karo

### Add New Categories
1. `backend/models/Project.js` me category enum update karo
2. Frontend dropdowns me bhi add karo

## Deployment

### Deploy on Heroku
```bash
# Heroku CLI install karo
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

### Deploy on Vercel/Netlify
Backend aur frontend ko separately deploy karna padega.

## Future Enhancements

- 💳 Payment gateway integration
- 📧 Email notifications
- 🔍 Advanced search filters
- ⭐ Rating system
- 💬 Live chat support
- 📱 Mobile app
- 🎨 Theme customization

## Support

Koi problem ho toh:
1. Check karo MongoDB running hai
2. Check karo `.env` file sahi hai
3. Console me errors dekho
4. Port 5000 available hai

## License

Free to use for personal and commercial projects.

---

**Made with ❤️ for Students**

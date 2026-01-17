# 📧 Email Notifications Setup Guide

Email notifications automatically alert you when:
- 🔔 New contact request is submitted
- 👤 New user registers
- ⭐ New review is posted

---

## Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. Click on **"Security"** (left sidebar)
3. Enable **"2-Step Verification"** if not already enabled
4. Search for **"App passwords"** in the search bar
5. Click **"App passwords"**
6. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → Type "TheBinary Platform"
7. Click **"Generate"**
8. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

---

## Step 2: Update .env File

Open `.env` file and update these values:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
SITE_URL=http://localhost:5000
```

**Example:**
```env
EMAIL_USER=rinkushriwas065@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
SITE_URL=http://localhost:5000
```

**Important:**
- Remove spaces from app password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- Use your actual Gmail address
- Don't share this password!

---

## Step 3: Install Nodemailer

Run this command:

```bash
npm install
```

This will install nodemailer package.

---

## Step 4: Test Email Notifications

1. **Start server:**
   ```bash
   npm start
   ```

2. **Test contact form:**
   - Go to: http://localhost:5000/contact.html
   - Fill and submit form
   - Check your email inbox!

3. **Test user registration:**
   - Go to: http://localhost:5000/student-register.html
   - Register a new user
   - Check your email inbox!

4. **Test review submission:**
   - Login as user
   - Go to any project detail page
   - Submit a review
   - Check your email inbox!

---

## Email Templates

### 1. New Contact Request
- Subject: 🔔 New Contact Request - TheBinary
- Contains: Name, Email, Phone, Project, Message
- Beautiful HTML template with gradient header

### 2. New User Registration
- Subject: 👤 New User Registration - TheBinary
- Contains: Name, Email, Phone, College, Course
- Professional HTML template

### 3. New Review
- Subject: ⭐ New Review Submitted - TheBinary
- Contains: Project name, User, Rating, Comment
- Includes "Go to Admin Panel" button
- Warning: Action required (approve/reject)

---

## Troubleshooting

### ❌ Error: "Invalid login"
- Make sure 2-Step Verification is enabled
- Use App Password, not your regular Gmail password
- Remove spaces from app password

### ❌ Error: "Connection timeout"
- Check your internet connection
- Try different network (mobile hotspot)
- Firewall might be blocking port 587

### ❌ Emails not received
- Check spam folder
- Verify EMAIL_USER is correct
- Make sure server restarted after .env changes

---

## Production Deployment

When deploying to production (Render/Vercel/Railway):

1. Add environment variables in hosting platform:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   SITE_URL=https://your-domain.com
   ```

2. Update SITE_URL to your actual domain

3. Emails will work automatically!

---

## Security Notes

✅ **Safe:**
- App passwords are safer than regular passwords
- Can be revoked anytime
- Limited to specific app

❌ **Don't:**
- Share your app password
- Commit .env file to GitHub
- Use regular Gmail password

---

## Alternative Email Services

If Gmail doesn't work, you can use:

1. **SendGrid** (Free 100 emails/day)
2. **Mailgun** (Free 5000 emails/month)
3. **AWS SES** (Cheap, reliable)

Just update `backend/config/email.js` transporter settings.

---

## Need Help?

If emails still not working:
1. Check server console for error messages
2. Verify all .env values are correct
3. Try with different Gmail account
4. Test with mobile hotspot

---

**That's it! Email notifications are now set up! 🎉**

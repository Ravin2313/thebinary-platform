const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

// Email templates
const emailTemplates = {
    // New Contact Request
    newContact: (contact) => ({
        subject: '🔔 New Contact Request - TheBinary',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">⚡ TheBinary</h1>
                    <p style="color: white; margin: 10px 0 0 0;">New Contact Request</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.email}</td>
                        </tr>
                        ${contact.phone ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.phone}</td>
                        </tr>
                        ` : ''}
                        ${contact.projectTitle ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Project:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.projectTitle}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="padding: 10px; vertical-align: top;"><strong>Message:</strong></td>
                            <td style="padding: 10px;">${contact.message}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; color: #666;">Received at: ${new Date().toLocaleString('en-IN')}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                    <p>This is an automated notification from TheBinary Platform</p>
                </div>
            </div>
        `
    }),
    
    // New User Registration
    newUser: (user) => ({
        subject: '👤 New User Registration - TheBinary',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">⚡ TheBinary</h1>
                    <p style="color: white; margin: 10px 0 0 0;">New User Registration</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">User Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.email}</td>
                        </tr>
                        ${user.phone ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.phone}</td>
                        </tr>
                        ` : ''}
                        ${user.college ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>College/School:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.college}</td>
                        </tr>
                        ` : ''}
                        ${user.course ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Course:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.course}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; color: #666;">Registered at: ${new Date().toLocaleString('en-IN')}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                    <p>This is an automated notification from TheBinary Platform</p>
                </div>
            </div>
        `
    }),
    
    // New Review Submitted
    newReview: (review, projectTitle) => ({
        subject: '⭐ New Review Submitted - TheBinary',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">⚡ TheBinary</h1>
                    <p style="color: white; margin: 10px 0 0 0;">New Review Submitted</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Review Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Project:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${projectTitle}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>User:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${review.userName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Rating:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${'⭐'.repeat(review.rating)} (${review.rating}/5)</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; vertical-align: top;"><strong>Comment:</strong></td>
                            <td style="padding: 10px;">${review.comment}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; color: #856404;"><strong>⚠️ Action Required:</strong> Please review and approve/reject this review in admin panel</p>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${process.env.SITE_URL || 'http://localhost:5000'}/admin/manage-reviews.html" 
                           style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Go to Admin Panel
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                    <p>This is an automated notification from TheBinary Platform</p>
                </div>
            </div>
        `
    })
};

// Send email function
async function sendEmail(to, template) {
    try {
        const mailOptions = {
            from: `"TheBinary Platform" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: template.subject,
            html: template.html
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, error: error.message };
    }
}

// Notification functions
async function notifyNewContact(contact) {
    const template = emailTemplates.newContact(contact);
    return await sendEmail(process.env.ADMIN_EMAIL, template);
}

async function notifyNewUser(user) {
    const template = emailTemplates.newUser(user);
    return await sendEmail(process.env.ADMIN_EMAIL, template);
}

async function notifyNewReview(review, projectTitle) {
    const template = emailTemplates.newReview(review, projectTitle);
    return await sendEmail(process.env.ADMIN_EMAIL, template);
}

module.exports = {
    sendEmail,
    notifyNewContact,
    notifyNewUser,
    notifyNewReview
};

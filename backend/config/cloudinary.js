const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'thebinary-projects', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Resize large images
            { quality: 'auto' } // Automatic quality optimization
        ]
    }
});

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Function to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
    try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `thebinary-projects/${filename.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted from Cloudinary:', publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

module.exports = {
    cloudinary,
    upload,
    deleteImage
};

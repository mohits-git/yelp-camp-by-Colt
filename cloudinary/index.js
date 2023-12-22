const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'YelpCamp',
        format: async (req, file) => {
            const acceptable = ['jpeg', 'png', 'jpg']
            const ext = file.originalname.split('.')[1];
            if(acceptable.includes(ext)){
                return ext;
            }
            return 'jpeg'
        }
    }
});

module.exports = {
    cloudinary,
    storage
}

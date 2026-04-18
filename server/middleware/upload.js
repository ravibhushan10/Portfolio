import multer                  from 'multer'
import { CloudinaryStorage }  from 'multer-storage-cloudinary'
import cloudinary              from '../config/cloudinary.js'

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder         : 'portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation : [
      { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
    eager: [
      { width: 800,  crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      { width: 400,  crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
    eager_async: true,
  },
})

export const uploadProjectImages = multer({
  storage : projectStorage,
  limits  : { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPG, PNG, WEBP images are allowed'), false)
  },
})

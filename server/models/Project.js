import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type     : String,
      required : [true, 'Title is required'],
      trim     : true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type     : String,
      required : [true, 'Short description is required'],
      trim     : true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    fullDescription: {
      type     : String,
      trim     : true,
      maxlength: [2000, 'Full description cannot exceed 2000 characters'],
      default  : '',
    },
    // Cover image (shown on card)
    img: {
      url      : { type: String, default: '' },
      publicId : { type: String, default: '' },   // Cloudinary public_id for deletion
    },
    // Carousel images in modal
    images: [
      {
        url      : { type: String, required: true },
        publicId : { type: String, default: '' },
      },
    ],
    tags: {
      type   : [String],
      default: [],
    },
    features: {
      type   : [String],
      default: [],
    },
    github : { type: String, default: '' },
    live   : { type: String, default: '' },
    // Controls display order on frontend (lower = first)
    order: {
      type   : Number,
      default: 0,
    },
    isVisible: {
      type   : Boolean,
      default: true,
    },
    // Track how many times the project modal was opened
    views: {
      type   : Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)

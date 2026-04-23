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

    img: {
      url      : { type: String, default: '' },
      publicId : { type: String, default: '' },
    },

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

    order: {
      type   : Number,
      default: 0,
    },
    isVisible: {
      type   : Boolean,
      default: true,
    },

    views: {
      type   : Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)

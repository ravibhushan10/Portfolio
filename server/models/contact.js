import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type     : String,
      required : [true, 'Full name is required'],
      trim     : true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type     : String,
      required : [true, 'Email is required'],
      trim     : true,
      lowercase: true,
      match    : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
      type   : String,
      trim   : true,
      default: '',
    },
    subject: {
      type     : String,
      required : [true, 'Subject is required'],
      trim     : true,
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    message: {
      type     : String,
      required : [true, 'Message is required'],
      trim     : true,
      minlength: [10,   'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    // ── Admin management fields ──────────────────────
    isRead: {
      type   : Boolean,
      default: false,
    },
    isStarred: {
      type   : Boolean,
      default: false,
    },
    adminNote: {
      type   : String,
      default: '',
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Contact', contactSchema)

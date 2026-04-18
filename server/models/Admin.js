import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const adminSchema = new mongoose.Schema(
  {
    // We only ever have 1 admin, but keeping it as a model is cleaner than env-only auth
    username: {
      type     : String,
      required : true,
      unique   : true,
      default  : 'admin',
    },
    // Hashed password — seeded from ADMIN_PASSWORD env on first boot
    passwordHash: {
      type    : String,
      required: true,
    },
  },
  { timestamps: true }
)

// Instance method to compare plain-text password
adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

export default mongoose.model('Admin', adminSchema)

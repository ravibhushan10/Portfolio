import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const adminSchema = new mongoose.Schema(
  {

    username: {
      type     : String,
      required : true,
      unique   : true,
      default  : 'admin',
    },

    passwordHash: {
      type    : String,
      required: true,
    },
  },
  { timestamps: true }
)


adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

export default mongoose.model('Admin', adminSchema)

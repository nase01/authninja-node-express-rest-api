import mongoose from 'mongoose'
import mongooseSequence from 'mongoose-sequence'
import validator from 'validator'

const AutoIncrement = mongooseSequence(mongoose)

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Email is required.'],
    validate: {
      validator: (v) => {
        return validator.isEmail(v)
      },
      message: props => `${props.value} is not a valid email address.`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  pwReset: {
    token: {
      type: String
    },
    expiry: {
      type: Date
    }
  },
  pwForceChange: {
    type: Boolean,
    required: [true, 'Password "force change" status is required.'],
    default: false
  },
  role: {
    type: String,
    enum: ['super', 'admin', 'accountant'],
    required: [true, 'Role is required.']
  },
  ipWhitelist: {
    type: [String],
    default: null
  },
  active: {
    type: Boolean,
    required: [true, 'Admin active status is required.'],
    default: true
  }
}, { optimisticConcurrency: true, timestamps: true })

adminSchema.plugin(AutoIncrement, { id: 'adminCounter', inc_field: 'id' })
adminSchema.index({ id: 1 })
adminSchema.index({ id: -1 })

export const Admin = mongoose.model('Admin', adminSchema)

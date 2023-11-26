import mongoose from 'mongoose'

const adminLogSchema = new mongoose.Schema({
  actionTaker: {
    type: {
      id: {
        type: Number
      },
      email: {
        type: String
      }
    },
    required: [true, 'Action taker is required.']
  },
  info: {
    type: String,
    required: [true, 'Log entry info is required.']
  },
  ip: {
    type: String,
    required: [true, 'User IP is required.']
  }
}, {
  capped: { size: 102400000 },
  collection: 'adminLogs',
  optimisticConcurrency: true,
  timestamps: true
})

export const AdminLog = mongoose.model('AdminLog', adminLogSchema)

import mongoose from 'mongoose'

const adminDeletedSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: [true, 'Deleted account\'s ID is required.']
  }
}, {
  collection: 'adminsDeleted',
  optimisticConcurrency: true,
  timestamps: true
})

export const AdminDeleted = mongoose.model('AdminDeleted', adminDeletedSchema)

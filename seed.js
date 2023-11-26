import 'dotenv/config'
import fs from 'fs'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { Admin } from './models/mongoose/Admin.js'

const seed = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      autoIndex: true
    })

    const hashedPassword = await bcrypt.hash(process.env.FIRST_ADMIN_PASSWORD, 12)

    const firstAdmin = new Admin({
      'name': process.env.FIRST_ADMIN_NAME,
      'email': process.env.FIRST_ADMIN_EMAIL,
      'password': hashedPassword,
      'role': 'super'
    })

    // Other data
    // const sampleData = fs.readFileSync('./data/sampleData.json')
    // const samples = JSON.parse(sampleData)

    await Promise.all([
      firstAdmin.save(),
      // Model.insertMany(samples),
    ])

    db.connection.close()
  } catch (error) {
    throw new Error(error)
  }
}

seed()

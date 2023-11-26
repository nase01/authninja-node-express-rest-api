import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Admin } from '../../models/mongoose/Admin.js'
import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { userIp, userIpCheck } from '../../utils/userIp.js'

export const authAdmin = async (req, res) => {
  try {
    const ip = userIp(req)
    const userAgent = req.headers['user-agent']

    const email = req.body.email
    const password = req.body.password

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Incorrect email address/password.' }] })
    }

    const correctPass = await bcrypt.compare(password, admin.password)

    if (!correctPass) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Incorrect email address/password.' }] })
    }

    if (!userIpCheck(req, admin)) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized IP address.' }] })
    }

    if (!admin.active) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Account disabled.' }] })
    }

    const token = jwt.sign({
      id: admin.id,
      accountType: 'admin',
      email: admin.email,
      role: admin.role,
      ip,
      userAgent
    },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

    const adminLog = new AdminLog({
      info: `${admin.email} admin logged in.`,
      actionTaker: { id: admin.id, email: admin.email },
      ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true, user: { id: admin.id, email: admin.email, token } } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

export const authCurrentAdmin = (req, res) => {
  try {
    const ip = userIp(req)

    const admin = req.currentAdmin

    return res.status(200)
      .json({
        data: {
          currentAdmin: {
            ip,
            id: admin.id,
            name: admin.name,
            accountType: 'admin',
            email: admin.email,
            role: admin.role,
            active: admin.active,
            pwForceChange: admin.pwForceChange,
            ipWhitelist: admin.ipWhitelist
          }
        }
      })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

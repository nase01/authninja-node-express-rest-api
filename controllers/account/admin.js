import bcrypt from 'bcryptjs'

import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { adminValidate } from '../../utils/input-validate/adminValidate.js'
import { userIp } from '../../utils/userIp.js'

export const adminAccountUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const self = req.currentAdmin
    
    const validate = await adminValidate(req.body, self.id, self.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const modifiedDetails = []

    if (req.body.name !== self.name) {
      modifiedDetails.push(`Name: ${self.name} -> ${req.body.name}.`)
      self.name = req.body.name
    }

    if (self.pwForceChange) {
      self.pwForceChange = false
    }

    if (req.body.email !== self.email) {
      modifiedDetails.push(`Email: ${self.email} -> ${req.body.email}.`)
      self.email = req.body.email
    }

    if (req.body.newPassword) {
      modifiedDetails.push('Password updated.')
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
      self.password = hashedPassword
    }

    if (req.body.ipWhitelist.length !== self.ipWhitelist.length ||
      !req.body.ipWhitelist.every(ip => self.ipWhitelist.includes(ip))) {
      if (req.body.ipWhitelist.length) {
        modifiedDetails.push('IP whitelist updated.')
      } else {
        modifiedDetails.push('IP whitelist cleared.')
      }

      self.ipWhitelist = req.body.ipWhitelist
    }

    await self.save()

    const adminLog = new AdminLog({
      info: `Admin user ${self.email} (${self.id}) updated their own account. ${modifiedDetails.join(' ')}`,
      actionTaker: { id: self.id, email: self.email },
      ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

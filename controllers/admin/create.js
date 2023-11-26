import bcrypt from 'bcryptjs'

import { Admin } from '../../models/mongoose/Admin.js'
import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { adminValidate } from '../../utils/input-validate/adminValidate.js'
import { userIp } from '../../utils/userIp.js'

export const adminCreate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    const validate = await adminValidate(req.body, currentAdmin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      ipWhitelist: req.body.ipWhitelist,
      role: req.body.role,
      active: req.body.active,
      pwForceChange: req.body.pwForceChange
    })

    const saved = await admin.save()

    const adminLog = new AdminLog({
      info: `${currentAdmin.email} created new admin ${saved.email} (${saved.id}).`,
      actionTaker: { id: currentAdmin.id, email: currentAdmin.email },
      ip
    })

    await adminLog.save()

    return res.status(201).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

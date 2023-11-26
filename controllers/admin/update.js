import bcrypt from 'bcryptjs'

import { Admin } from '../../models/mongoose/Admin.js'
import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { adminValidate } from '../../utils/input-validate/adminValidate.js'
import { userIp } from '../../utils/userIp.js'

export const adminUpdate = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    const admin = await Admin.findOne({ id: req.params.id })

    if (!admin) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Admin does not exist.' }] })
    }

    if (admin.id === currentAdmin.id) {
      return res.status(400).json({
        errors: [{
          status: '400',
          detail: 'Modify account on your account settings page.'
        }]
      })
    }

    if (admin.id == 1) {
      return res.status(400).json({
        errors: [{
          status: '400',
          detail: 'Modification is not allowed on first admin.'
        }]
      })
    }

    const validate = await adminValidate(req.body, currentAdmin.id, admin.id)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    const modifiedDetails = []

    if (req.body.name !== admin.name) {
      modifiedDetails.push(`Name: ${admin.name} -> ${req.body.name}.`)
      admin.name = req.body.name
    }

    if (req.body.email !== admin.email) {
      modifiedDetails.push(`Email: ${admin.email} -> ${req.body.email}.`)
      admin.email = req.body.email
    }

    if (req.body.password) {
      modifiedDetails.push('New password.')
      const hashedPassword = await bcrypt.hash(req.body.password, 12)
      admin.password = hashedPassword
    }

    if (req.body.ipWhitelist.length !== admin.ipWhitelist.length ||
      !req.body.ipWhitelist.every(ip => admin.ipWhitelist.includes(ip))) {
      if (req.body.ipWhitelist.length) {
        modifiedDetails.push('IP whitelist updated.')
      } else {
        modifiedDetails.push('IP whitelist cleared.')
      }

      admin.ipWhitelist = req.body.ipWhitelist
    }

    if (req.body.role !== admin.role) {
      modifiedDetails.push(`Admin type: ${admin.role} -> ${req.body.role}.`)
      admin.role = req.body.role
    }

    if (req.body.active !== admin.active) {
      modifiedDetails.push(`Status: ${admin.active} -> ${req.body.active}.`)
      admin.active = req.body.active
    }

    if (req.body.pwForceChange !== admin.pwForceChange) {
      modifiedDetails.push(`Password force change: ${admin.pwForceChange} -> ${req.body.pwForceChange}.`)
      admin.pwForceChange = req.body.pwForceChange
    }

    await admin.save()

    const adminLog = new AdminLog({
      info: `${currentAdmin.email} updated admin account ${admin.email} (${admin.id}). ${modifiedDetails.join(' ')}`,
      actionTaker: { id: currentAdmin.id, email: currentAdmin.email },
      ip
    })

    await adminLog.save()

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

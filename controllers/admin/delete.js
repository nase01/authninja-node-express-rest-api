import { Admin } from '../../models/mongoose/Admin.js'
import { AdminDeleted } from '../../models/mongoose/AdminDeleted.js'
import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { userIp } from '../../utils/userIp.js'

export const adminDelete = async (req, res) => {
  try {
    const ip = userIp(req)
    const currentAdmin = req.currentAdmin

    if (!req.body.ids.every(id => typeof (id) === 'number')) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'There was an issue with your request.' }] })
    }

    if (req.body.ids.includes(1)) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Cannot delete first admin' }] })
    }

    if (req.body.ids.includes(currentAdmin.id)) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'Cannot delete own account.' }] })
    }

    const existCount = await Admin.find({ id: { $in: req.body.ids } }).countDocuments()
    if (existCount !== req.body.ids.length) {
      return res.status(400).json({ errors: [{ status: '400', detail: 'At least one ID is invalid.' }] })
    }

    const deleted = await Admin.deleteMany({ id: { $in: req.body.ids } })

    if (deleted.ok === 1) {
      const results = await Promise.all(req.body.ids.map((id) => {
        const adminLog = new AdminLog({
          info: `${currentAdmin.email} deleted admin ${id}.`,
          actionTaker: { id: currentAdmin.id, email: currentAdmin.email },
          ip
        })

        // Save ID of deleted admins since logs linked to IDs will be kept
        const adminDeleted = new AdminDeleted({ id })

        adminLog.save()
        adminDeleted.save()

        return 'ok'
      }))

      if (results.every(result => result === 'ok')) {
        return res.status(200).json({ data: { success: true } })
      } else {
        return res.status(400).json({ errors: [{ status: '400', detail: 'There was an issue with your request.' }] })
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

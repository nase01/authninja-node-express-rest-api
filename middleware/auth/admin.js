import { Admin } from '../../models/mongoose/Admin.js'
import { who } from '../../utils/who.js'
import { userIpCheck } from '../../utils/userIp.js'

// Roles:
// 'super'
// 'admin'

export const adminAuthenticated = async (req, res, next) => {
  try {
    const payload = who(req.headers.authorization)

    if (!payload || payload.accountType !== 'admin') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    const currentAdmin = await Admin.findOne({ id: payload.id })

    if (!currentAdmin) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    req.currentAdmin = currentAdmin

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// all roles
export const userAuthorized = (req, res, next) => {
  try {
    if (!req.currentAdmin.active) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    if (!userIpCheck(req, req.currentAdmin)) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized IP address.' }] })
    }

    if (req.currentAdmin.pwForceChange) {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}


// super admins and admins only
export const adminAuthorized = (req, res, next) => {
  try {
    if (req.currentAdmin.role !== 'super' && req.currentAdmin.role !== 'admin') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

// super admins only
export const superAdminAuthorized = (req, res, next) => {
  try {
    if (req.currentAdmin.role !== 'super') {
      return res.status(401).json({ errors: [{ status: '401', detail: 'Unauthorized.' }] })
    }

    next()
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

import { Admin } from '../../models/mongoose/Admin.js'

const adminSearchFilterGenerator = (query) => {
  try {
    const adminSearchFilters = []

    if (query.search) {
      adminSearchFilters.push({
        email: {
          $regex: query.search,
          $options: 'i'
        }
      })
    }

    if (query.role) {
      adminSearchFilters.push({ role: query.role })
    }

    if (query.active) {
      adminSearchFilters.push({ active: query.active === 'true' })
    }

    return adminSearchFilters.length === 0 ? {} : { $and: adminSearchFilters }
  } catch (error) {
    throw new Error(error)
  }
}

export const adminCount = async (req, res) => {
  try {
    const find = adminSearchFilterGenerator(req.query)

    const count = await Admin
      .find(find)
      .countDocuments()

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

export const adminFetch = async (req, res) => {
  try {
    const admin = await Admin.findOne({ id: req.params.id })
      .select('-_id -password -pwReset')
      .lean()

    return res.status(200).json({ data: admin })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

export const adminFetchMany = async (req, res) => {
  try {
    const find = adminSearchFilterGenerator(req.query)
    const sort = req.query.sort === 'role' ? { role: 1 } : { email: 1 }

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const admins = await Admin
      .find(find)
      .select('-_id -password -pwReset')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    return res.status(200).json({ data: admins })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

import { AdminLog } from '../../../models/mongoose/AdminLog.js'

const logSearchFilterGenerator = (query) => {
  try {
    const logSearchFilters = []

    if (query.search) {
      logSearchFilters.push({ $or: [{ info: { $regex: query.search, $options: 'i' } }, { ip: { $regex: query.search, $options: 'i' } }] })
    }

    if (query.id) {
      logSearchFilters.push({ 'actionTaker.id': +query.id })
    }

    return logSearchFilters.length === 0 ? {} : { $and: logSearchFilters }
  } catch (error) {
    throw new Error(error)
  }
}

export const adminLogCount = async (req, res) => {
  try {
    const find = logSearchFilterGenerator(req.query)

    const count = await AdminLog
      .find(find)
      .countDocuments()

    return res.status(200).json({ data: { count } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

export const adminLogFetchMany = async (req, res) => {
  try {
    const find = logSearchFilterGenerator(req.query)

    const perPage = +req.query.perPage
    const currentPage = +req.query.currentPage

    const skip = currentPage && perPage ? (currentPage - 1) * perPage : 0
    const limit = currentPage && perPage ? perPage : 0

    const adminLogs = await AdminLog
      .find(find)
      .select('-_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return res.status(200).json({ data: adminLogs })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}

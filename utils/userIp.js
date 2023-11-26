import ipRangeCheck from 'ip-range-check'

export const userIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

export const userIpCheck = (req, admin) => {
  const ip = userIp(req)

  if (admin.ipWhitelist && admin.ipWhitelist.length) {
    return admin.ipWhitelist.some(entry => entry === ip || ipRangeCheck(ip, entry) === true)
  }

  return true
}

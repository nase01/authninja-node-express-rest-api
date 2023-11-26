import crypto from 'crypto'
import dayjs from 'dayjs'

class Token {
  /**
   *
   * @param {Number} expiresIn token will expire in `expiresIn` hours
   */

  constructor (expiresIn = 0, size = 6) {
    this.token = crypto.randomBytes(size).toString('hex')
    this.expiresIn = expiresIn
    this.expiry = dayjs().add(expiresIn, 'h')
  }
}

export { Token }

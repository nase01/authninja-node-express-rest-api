import jwt from 'jsonwebtoken'

/**
 *
 * @param {String} authString Value of req.headers.authorization; Bearer <token>
 */

export const who = (authString) => {
  if (authString) {
    return jwt.verify(authString.split('Bearer ')[1], process.env.JWT_SECRET)
  }

  return null
}

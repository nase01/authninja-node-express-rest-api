import dayjs from 'dayjs'
import validator from 'validator'
import { strongPwOpts } from '../strongPwOpts.js'

export const pwResetValidate = (input, account) => {
  if (!account) {
    return { error: 'Account does not exist.' }
  }

  if (!input.email || !validator.isEmail(input.email)) {
    return { error: 'Invalid email address.' }
  }

  if (input.token) {
    if (account.pwReset.token !== input.token || dayjs().isAfter(account.pwReset.expiry)) {
      return { error: 'Invalid or expired reset token.' }
    }

    if (!validator.isStrongPassword(input.newPassword, strongPwOpts)) {
      return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    }

    if (input.newPassword !== input.newPasswordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  return true
}

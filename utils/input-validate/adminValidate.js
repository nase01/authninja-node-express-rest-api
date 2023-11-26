import bcrypt from 'bcryptjs'
import validator from 'validator'
import { Admin } from '../../models/mongoose/Admin.js'
import { customValidator } from '../custom-validator/index.js'
import { strongPwOpts } from '../strongPwOpts.js'

export const adminValidate = async (input, actionTaker, id = null) => {
  const self = actionTaker === id
  const actionTarget = id ? await Admin.findOne({ id }) : null
  
  if (self) {
    const correctPass = input.password ? await bcrypt.compare(input.password, actionTarget.password) : false
    
    if (actionTarget.id == 1) {
      //First Admin
      return { error: 'Cannot modify first admin account.' }
    }

    if (!correctPass) {
      return { error: 'Incorrect current password.' }
    }

    if (actionTarget.pwForceChange && !input.newPassword) {
      return { error: 'You are required to change your password.' }
    }

    if (actionTarget.pwForceChange && await bcrypt.compare(input.newPassword, actionTarget.password)) {
      return { error: 'Cannot use current password.' }
    }
  }

  if (!id) {
    if (!validator.isStrongPassword(input.password, strongPwOpts)) {
      return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    }

    if (input.newPassword !== input.newPasswordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  if (id) {
    if (input.newPassword && !validator.isStrongPassword(input.newPassword, strongPwOpts)) {
      return { error: 'Password must contain at least one uppercase, one lowercase, one number. Password min. length is 8 characters.' }
    }
    
    if (input.newPassword !== input.newPasswordConfirm) {
      return { error: 'Both password fields must match.' }
    }
  }

  if (!customValidator.isName(input.name)) {
    return { error: 'Invalid name.' }
  }

  if (!validator.isEmail(input.email)) {
    return { error: 'Invalid email address.' }
  }

  const exists = await Admin.findOne({ email: input.email })

  if (exists && exists.id !== id) {
    return { error: 'Another admin with the same email already exists.' }
  }

  if (input.ipWhitelist && input.ipWhitelist.length > 30) {
    return { error: 'IP whitelist can only have a maximum of 30 entries.' }
  }

  if (input.ipWhitelist && !input.ipWhitelist.every(ip => validator.isIP(ip) === true ||
      validator.isIPRange(ip) === true)) {
    return { error: 'Invalid format for IP whitelist.' }
  }

  if (input.ipWhitelist.length !== new Set(input.ipWhitelist).size) {
    return { error: 'Duplicate IPs detected.' }
  }

  if (input.role && !['super', 'admin'].includes(input.role)) {
    return { error: 'Invalid role.' }
  }

  if (input.active && typeof (input.active) !== 'boolean') {
    return { error: 'Invalid admin active status.' }
  }

  return true
}

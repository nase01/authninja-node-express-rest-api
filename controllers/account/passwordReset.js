import bcrypt from 'bcryptjs'

import { Admin } from '../../models/mongoose/Admin.js'
import { AdminLog } from '../../models/mongoose/AdminLog.js'
import { EmailToken } from '../../models/email/EmailToken.js'
import { Token } from '../../models/Token.js'
import { sendmail } from '../../utils/sendmail.js'
import { pwResetValidate } from '../../utils/input-validate/pwResetValidate.js'
import { captcha } from '../../utils/captcha.js'
import { userIp } from '../../utils/userIp.js'

export const passwordReset = async (req, res) => {
  try {
    const accountType = req.body.accountType

    const ip = userIp(req)

    const captchaResult = accountType === 'admin' ? true : await captcha(req.body.captchaToken, ip)
    if (!captchaResult) {
      return res.status(500).json({ errors: [{ status: '500', detail: 'Captcha verification failed.' }] })
    }

    const account = accountType === 'admin' ? await Admin.findOne({ email: req.body.email }) : null

    const validate = pwResetValidate(req.body, account)

    if (validate !== true) {
      return res.status(400).json({ errors: [{ status: '400', detail: validate.error }] })
    }

    if (req.body.token) {
      account.password = await bcrypt.hash(req.body.newPassword, 12)
      account.pwReset.token = null
      account.pwReset.expiry = null

      await account.save()

      if (accountType === 'admin') {
        const adminLog = new AdminLog({
          info: 'Completed password reset process.',
          actionTaker: { id: account.id, email: account.email },
          ip
        })

        await adminLog.save()
      }

      return res.status(200).json({ data: { success: true } })
    }

    const resetToken = new Token(3)

    account.pwReset.token = resetToken.token
    account.pwReset.expiry = resetToken.expiry

    await account.save()

    if (accountType === 'admin') {
      const adminLog = new AdminLog({
        info: 'Generated password reset token for own account.',
        actionTaker: { id: account.id, email: account.email },
        ip
      })

      await adminLog.save()
    }

    const name = account.name

    const email = new EmailToken(name, account.email, resetToken.token, 'Password Reset', resetToken
      .expiresIn)

    const sendRes = await sendmail(email)
    console.log(sendRes)
    if (!sendRes.success) {
      return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
    }

    return res.status(200).json({ data: { success: true } })
  } catch (error) {
    return res.status(500).json({ errors: [{ status: '500', detail: 'Internal Server Error' }] })
  }
}
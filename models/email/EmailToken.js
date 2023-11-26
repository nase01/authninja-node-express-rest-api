import { Email } from './Email.js'

class EmailToken extends Email {
  static subject (type) {
    return `${type} | ${process.env.SYSTEM_NAME}`
  }

  static html (toName, token, type, tokenValidity) {
    return `
    Hello ${toName},<br/><br/>
    Your ${type.toLowerCase()} token is: <strong>${token}</strong><br/><br/>
    This token will expire in ${tokenValidity} hours.
    `
  }

  constructor (toName, toEmail, token, type, tokenValidity) {
    const subject = EmailToken.subject(type)
    const completeMessage = EmailToken.html(toName, token, type, tokenValidity)
    super(null, toEmail, null, null, null, subject, completeMessage, null)
  }
}

export { EmailToken }

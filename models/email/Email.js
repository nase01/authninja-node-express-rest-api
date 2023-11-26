class Email {
  static html (message, ipAddress) {
    if (ipAddress) {
      return `
      ${message}
      <br/><br/>
      User IP address: ${ipAddress}
      `
    }

    return `${message}`
  }

  static from (name) {
    const senderName = name || process.env.SYSTEM_NAME
    return `${senderName} <${process.env.SMTP_SENDER}>`
  }

  constructor (replyTo, to, cc = null, bcc = null, name, subject, message, ipAddress) {
    this.from = Email.from(name)
    this.replyTo = replyTo
    this.to = to

    if (cc) {
      this.cc = cc
    }

    if (bcc) {
      this.bcc = bcc
    }

    this.subject = subject
    this.html = Email.html(message, ipAddress)
  }
}

export { Email }

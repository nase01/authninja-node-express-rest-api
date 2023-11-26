import { Email } from './Email.js'

class EmailTicketReply extends Email {
  static subject (ticketId) {
    return `#${ticketId} - New Support Ticket Response | ${process.env.SYSTEM_NAME}`
  }

  static html (toName, ticketId) {
    return `
    Hello ${toName},<br/><br/>
    Ticket #${ticketId} has been updated.
    A reply has been made to your ticket. Please sign in to the admin dashboard to respond to it.
    `
  }

  constructor (toName, toEmail, ticketId) {
    const subject = EmailTicketReply.subject(ticketId)
    const completeMessage = EmailTicketReply.html(toName, ticketId)
    super(null, toEmail, null, null, null, subject, completeMessage, null)
  }
}

export { EmailTicketReply }

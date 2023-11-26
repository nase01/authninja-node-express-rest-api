import { Email } from './Email.js'

class EmailTicketCreated extends Email {
  static subject (ticketId) {
    return `#${ticketId} - New Support Ticket Created | ${process.env.SYSTEM_NAME}`
  }

  static html (toName, ticketId, message) {
    return `
    Hello ${toName},<br/><br/>
    Ticket #${ticketId} has been created.
    Please sign in to the admin dashboard to view or respond to it.
    You will receive an email notification when this ticket is updated.<br/><br/>

    Initial message:<br/>
    ${message}
    `
  }

  constructor (toName, toEmail, ticketId, message) {
    const subject = EmailTicketCreated.subject(ticketId)
    const completeMessage = EmailTicketCreated.html(toName, ticketId, message)
    super(null, toEmail, null, null, null, subject, completeMessage, null)
  }
}

export { EmailTicketCreated }

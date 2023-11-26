import nodemailer from 'nodemailer'

const options = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  tls: {
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'true'
  },
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
}

const transport = nodemailer.createTransport(options)

export const sendmail = async (message) => {
  try {
    const result = await transport.sendMail(message)
    return {
      ...result,
      success: true
    }
  } catch (error) {
    return error
  }
}

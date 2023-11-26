import axios from 'axios'

export const captcha = async (captchaToken, ip) => {
  if (process.env.NODE_ENV === 'development-local') {
    return true
  }

  try {
    const captchaRes = await axios.get(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}&remoteip=${ip}`
    )

    if (captchaRes.data.success === true && captchaRes.data.score >= 0.3) {
      return true
    }

    return false
  } catch (error) {
    throw new Error(error)
  }
}

export const isPostalCode = (input) => {
  return /^[0-9]{3,5}$/.test(input.trim())
}

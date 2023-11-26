export const isPrice = (input) => {
  return /^([0-9]+)(\.[0-9]{2})?$/.test(input.trim())
}

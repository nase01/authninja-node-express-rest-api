export const isContactNumber = (input) => {
  return /^([0-9 \-+. ()]){1,32}$/.test(input.trim())
}

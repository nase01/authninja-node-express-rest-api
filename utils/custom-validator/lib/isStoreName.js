export const isStoreName = (input) => {
  return /^[a-zA-Z0-9 -+,@.'&]+$/.test(input.trim())
}

export const isName = (input) => {
  return /^([A-Za-zÀ-ÖØ-öø-ÿ .]+?)([- '][A-Za-zÀ-ÖØ-öø-ÿ .]+)*?$/.test(input.trim())
}

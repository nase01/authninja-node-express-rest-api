import { isAddressString } from './lib/isAddressString.js'
import { isContactNumber } from './lib/isContactNumber.js'
import { isName } from './lib/isName.js'
import { isPostalCode } from './lib/isPostalCode.js'
import { isPrice } from './lib/isPrice.js'
import { isStoreName } from './lib/isStoreName.js'

export const customValidator = {
  isAddressString,
  isContactNumber,
  isName,
  isPostalCode,
  isPrice,
  isStoreName
}

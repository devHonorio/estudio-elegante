import { createPhoneFactory } from "./phone.factory"
import type { Phone as PhoneVO } from "./phone"

export const Phone = createPhoneFactory()

export { createPhone } from "./phone"
export { createPhoneFactory } from "./phone.factory"
export { createLibPhoneNumberParser } from "@/src/modules/shared/infra/phone/libphonenumber-js/libphonenumber-js.phone-parser"
export type Phone = PhoneVO
export type { PhoneError } from "./phone-error"
export type {
  ParsedPhone,
  PhoneParser,
  PhoneParserOptions,
  PhoneParserResult,
} from "./phone-parser"
export type { PhoneValidationProvider } from "./phone-validation.provider"
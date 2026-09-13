import { createLibPhoneNumberParser } from "@/src/modules/shared/infra/phone/libphonenumber-js/libphonenumber-js.phone-parser"
import { createPhone } from "./phone"

const createPhoneFactory = () => {
  const parser = createLibPhoneNumberParser()

  return createPhone(parser)
}

export { createPhoneFactory }

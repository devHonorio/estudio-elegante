import {
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
  type PhoneNumber,
} from "libphonenumber-js"
import type {
  ParsedPhone,
  PhoneParser,
  PhoneParserOptions,
  PhoneParserResult,
} from "@/src/modules/shared/value-object/phone/phone-parser"

const DEFAULT_COUNTRY: CountryCode = "BR"

const isSupported = (country: string | undefined): country is CountryCode => {
  return country !== undefined && isSupportedCountry(country)
}

const extractAreaCode = (phoneNumber: PhoneNumber): string | undefined => {
  const match = phoneNumber.formatNational().match(/\((\d+)\)/)

  return match ? match[1] : undefined
}

const extractDdi = (phoneNumber: PhoneNumber): string => {
  return phoneNumber.countryCallingCode
}

const formatBrazil = (phoneNumber: PhoneNumber): string | undefined => {
  const nationalNumber = phoneNumber.nationalNumber
  const ddd = nationalNumber.slice(0, 2)
  const rest = nationalNumber.slice(2)

  if (/^9\d{8}$/.test(rest)) {
    return `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5)}`
  }

  if (/^\d{8}$/.test(rest)) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  }

  return undefined
}

const formatNational = (phoneNumber: PhoneNumber): string => {
  if (phoneNumber.country === "BR") {
    const formatted = formatBrazil(phoneNumber)

    if (formatted !== undefined) {
      return formatted
    }
  }

  return phoneNumber.formatNational()
}

const buildParsedPhone = (phoneNumber: PhoneNumber): ParsedPhone => {
  return {
    value: phoneNumber.number,
    formatted: formatNational(phoneNumber),
    country: phoneNumber.country,
    ddi: extractDdi(phoneNumber),
    ddd: extractAreaCode(phoneNumber),
  }
}

const parse = (
  input: string,
  options?: PhoneParserOptions,
): PhoneParserResult => {
  const country = isSupported(options?.defaultCountry)
    ? options?.defaultCountry
    : DEFAULT_COUNTRY
  const phoneNumber = parsePhoneNumberFromString(input, country)

  if (phoneNumber === undefined) {
    return { status: "unrecognized" }
  }

  if (!phoneNumber.isValid()) {
    return { status: "invalid" }
  }

  return {
    status: "valid",
    phone: buildParsedPhone(phoneNumber),
  }
}

const createLibPhoneNumberParser = (): PhoneParser => {
  return { parse }
}

export { createLibPhoneNumberParser }

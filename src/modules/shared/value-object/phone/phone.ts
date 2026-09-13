import { result, type Result } from "@/src/modules/shared/result"
import type { PhoneParser } from "./phone-parser"
import type { PhoneValidationProvider } from "./phone-validation.provider"
import type { PhoneError } from "./phone-error"

type Phone = {
  readonly value: string;
  readonly formatted: string;
  readonly country: string | undefined;
  readonly ddi: string;
  readonly ddd: string | undefined;
};

const validateRequired = (input: string): Result<string, PhoneError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "PHONE_REQUIRED",
      message: "O telefone é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateParsed = (
  parser: PhoneParser | PhoneValidationProvider,
  input: string,
): Result<Phone, PhoneError> => {
  const parsed = parser.parse(input)

  if (parsed.status === "unrecognized") {
    return result.fail({
      code: "PHONE_INVALID_FORMAT",
      message: "O telefone não possui um formato reconhecível.",
    })
  }

  if (parsed.status === "invalid") {
    return result.fail({
      code: "PHONE_INVALID_NUMBER",
      message: "O telefone não é um número válido.",
    })
  }

  return result.ok(parsed.phone)
};

const createPhone = (parser: PhoneParser | PhoneValidationProvider) => {
  const tryCreate = (input: unknown): Result<Phone, PhoneError[]> => {
    if (typeof input !== "string") {
      return result.fail([
        {
          code: "PHONE_INVALID_TYPE",
          message: "O telefone deve ser uma string.",
        },
      ])
    }

    const required = validateRequired(input)

    if (required.fail) {
      return result.fail([required.error])
    }

    const parsed = validateParsed(parser, input)

    if (parsed.fail) {
      return result.fail([parsed.error])
    }

    return result.ok(parsed.value)
  }

  const create = (value: string): Phone => {
    const phoneResult = tryCreate(value)

    if (phoneResult.fail) {
      const codes = phoneResult.error.map((error) => error.code).join(", ")
      throw new Error(`Pré-condição do Phone violada: ${codes}.`)
    }

    return phoneResult.value
  }

  const isValid = (input: unknown): boolean => {
    return typeof input === "string" && parser.parse(input).status === "valid"
  }

  const equals = (first: Phone, second: Phone): boolean => {
    return first.value === second.value
  }

  return { create, tryCreate, isValid, equals }
}

export { createPhone };
export type { Phone, PhoneError };
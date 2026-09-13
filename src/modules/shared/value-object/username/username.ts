import { result, type Result } from "@/src/modules/shared/result"
import type { UsernameError } from "./username-error"

type Username = {
  readonly value: string
}

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30

const USERNAME_REGEX = /^[a-z0-9._]+$/

const normalize = (input: string): string => {
  return input.toLowerCase()
}

const validateRequired = (input: string): Result<string, UsernameError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "USERNAME_REQUIRED",
      message: "O username é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateLength = (input: string): Result<string, UsernameError> => {
  if (input.length < USERNAME_MIN_LENGTH || input.length > USERNAME_MAX_LENGTH) {
    return result.fail({
      code: "USERNAME_INVALID_LENGTH",
      message: `O username deve ter entre ${USERNAME_MIN_LENGTH} e ${USERNAME_MAX_LENGTH} caracteres.`,
    })
  }

  return result.ok(input)
}

const validateFormat = (input: string): Result<string, UsernameError> => {
  if (!USERNAME_REGEX.test(input)) {
    return result.fail({
      code: "USERNAME_INVALID_FORMAT",
      message: "O username deve conter apenas letras, números, pontos e underscores.",
    })
  }

  return result.ok(input)
}

const tryCreate = (input: unknown): Result<Username, UsernameError[]> => {
  if (typeof input !== "string") {
    return result.fail([
      {
        code: "USERNAME_INVALID_TYPE",
        message: "O username deve ser uma string.",
      },
    ])
  }

  const normalized = normalize(input)

  const validation = result.combine(
    validateRequired(normalized),
    validateLength(normalized),
    validateFormat(normalized),
  )

  if (validation.fail) {
    return validation
  }

  return result.ok({ value: normalized })
}

const create = (value: string): Username => {
  const usernameResult = tryCreate(value)

  if (usernameResult.fail) {
    const codes = usernameResult.error.map((error) => error.code).join(", ")
    throw new Error(`Pré-condição do Username violada: ${codes}.`)
  }

  return usernameResult.value
}

const isValid = (input: unknown): boolean => {
  if (typeof input !== "string") return false
  const normalized = normalize(input)
  return (
    validateRequired(normalized).success &&
    validateLength(normalized).success &&
    validateFormat(normalized).success
  )
}

const equals = (first: Username, second: Username): boolean => {
  return first.value === second.value
}

const Username = {
  create,
  tryCreate,
  isValid,
  equals,
}

export { Username, normalize, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX }
export type { UsernameError }

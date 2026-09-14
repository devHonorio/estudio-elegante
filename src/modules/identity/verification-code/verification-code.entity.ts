import { result, type Result } from "@/src/modules/shared/result"
import { Id } from "@/src/modules/shared/value-object/id"
import { Phone } from "@/src/modules/shared/value-object/phone"
import type { VerificationCodeError } from "./verification-code-error"

export type VerificationCode = {
  readonly id: Id
  readonly phone: Phone
  readonly codeHash: string
  readonly expiresAt: Date
  readonly attempts: number
  readonly maxAttempts: number
  readonly consumedAt: Date | null
  readonly createdAt: Date
}

type CreateVerificationCodeInput = {
  readonly id: string
  readonly phone: string
  readonly codeHash: string
  readonly expiresAt: Date
  readonly attempts: number
  readonly maxAttempts: number
  readonly consumedAt: Date | null
  readonly createdAt: Date
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const validateId = (input: unknown): Result<Id, VerificationCodeError> => {
  const idResult = Id.tryCreate(input)

  if (idResult.fail) {
    return result.fail(
      {
        code: "VERIFICATION_CODE_INVALID_ID",
        message: "O id do verification code é inválido.",
        cause: idResult.error,
      },
      { cause: idResult.error },
    )
  }

  return result.ok(idResult.value)
}

const validatePhone = (input: unknown): Result<Phone, VerificationCodeError> => {
  const phoneResult = Phone.tryCreate(input)

  if (phoneResult.fail) {
    return result.fail(
      {
        code: "VERIFICATION_CODE_INVALID_PHONE",
        message: "O telefone do verification code é inválido.",
        cause: phoneResult.error,
      },
      { cause: phoneResult.error },
    )
  }

  return result.ok(phoneResult.value)
}

const validateCodeHash = (input: unknown): Result<string, VerificationCodeError> => {
  if (typeof input !== "string") {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_CODE_HASH",
      message: "O codeHash deve ser uma string.",
    })
  }

  if (input.trim().length === 0) {
    return result.fail({
      code: "VERIFICATION_CODE_REQUIRED_CODE_HASH",
      message: "O codeHash é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateExpiresAt = (input: unknown): Result<Date, VerificationCodeError> => {
  if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_EXPIRES_AT",
      message: "O expiresAt deve ser uma data válida.",
    })
  }

  return result.ok(input)
}

const validateAttempts = (input: unknown): Result<number, VerificationCodeError> => {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 0) {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_ATTEMPTS",
      message: "O attempts deve ser um inteiro maior ou igual a zero.",
    })
  }

  return result.ok(input)
}

const validateMaxAttempts = (input: unknown): Result<number, VerificationCodeError> => {
  if (typeof input !== "number" || !Number.isInteger(input) || input <= 0) {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_MAX_ATTEMPTS",
      message: "O maxAttempts deve ser um inteiro maior que zero.",
    })
  }

  return result.ok(input)
}

const validateConsumedAt = (
  input: unknown,
): Result<Date | null, VerificationCodeError> => {
  if (input === null) {
    return result.ok(null)
  }

  if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_CONSUMED_AT",
      message: "O consumedAt deve ser uma data válida ou null.",
    })
  }

  return result.ok(input)
}

const validateCreatedAt = (input: unknown): Result<Date, VerificationCodeError> => {
  if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
    return result.fail({
      code: "VERIFICATION_CODE_INVALID_CREATED_AT",
      message: "O createdAt deve ser uma data válida.",
    })
  }

  return result.ok(input)
}

const tryCreate = (input: unknown): Result<VerificationCode, VerificationCodeError[]> => {
  if (!isRecord(input)) {
    return result.fail([
      {
        code: "VERIFICATION_CODE_INVALID_TYPE",
        message: "O verification code deve ser um objeto.",
      },
    ])
  }

  const idValidation = validateId(input.id)
  const phoneValidation = validatePhone(input.phone)
  const codeHashValidation = validateCodeHash(input.codeHash)
  const expiresAtValidation = validateExpiresAt(input.expiresAt)
  const attemptsValidation = validateAttempts(input.attempts)
  const maxAttemptsValidation = validateMaxAttempts(input.maxAttempts)
  const consumedAtValidation = validateConsumedAt(input.consumedAt)
  const createdAtValidation = validateCreatedAt(input.createdAt)

  const combined = result.combine(
    idValidation,
    phoneValidation,
    codeHashValidation,
    expiresAtValidation,
    attemptsValidation,
    maxAttemptsValidation,
    consumedAtValidation,
    createdAtValidation,
  )

  if (combined.fail) {
    return combined
  }

  const [
    id,
    phone,
    codeHash,
    expiresAt,
    attempts,
    maxAttempts,
    consumedAt,
    createdAt,
  ] = combined.value

  return result.ok({
    id,
    phone,
    codeHash,
    expiresAt,
    attempts,
    maxAttempts,
    consumedAt,
    createdAt,
  })
}

const create = (input: CreateVerificationCodeInput): VerificationCode => {
  const verificationResult = tryCreate(input)

  if (verificationResult.fail) {
    const codes = verificationResult.error.map((error) => error.code).join(", ")
    throw new Error(`Pré-condição do VerificationCode violada: ${codes}.`)
  }

  return verificationResult.value
}

const isExpired = (verificationCode: VerificationCode, now: Date): boolean => {
  return now.getTime() >= verificationCode.expiresAt.getTime()
}

const isConsumed = (verificationCode: VerificationCode): boolean => {
  return verificationCode.consumedAt !== null
}

const canAttempt = (verificationCode: VerificationCode): boolean => {
  return verificationCode.attempts < verificationCode.maxAttempts
}

const incrementAttempts = (
  verificationCode: VerificationCode,
): Result<VerificationCode, VerificationCodeError> => {
  if (!canAttempt(verificationCode)) {
    return result.fail({
      code: "VERIFICATION_CODE_ATTEMPTS_EXHAUSTED",
      message: "O verification code não possui tentativas disponíveis.",
    })
  }

  return result.ok({
    ...verificationCode,
    attempts: verificationCode.attempts + 1,
  })
}

const consume = (
  verificationCode: VerificationCode,
  consumedAt: Date,
): Result<VerificationCode, VerificationCodeError> => {
  if (isConsumed(verificationCode)) {
    return result.fail({
      code: "VERIFICATION_CODE_ALREADY_CONSUMED",
      message: "O verification code já foi consumido.",
    })
  }

  const consumedAtValidation = validateConsumedAt(consumedAt)

  if (consumedAtValidation.fail) {
    return consumedAtValidation
  }

  return result.ok({
    ...verificationCode,
    consumedAt: consumedAtValidation.value,
  })
}

const VerificationCode = {
  create,
  tryCreate,
  isExpired,
  isConsumed,
  canAttempt,
  incrementAttempts,
  consume,
}

export { VerificationCode }
export type { CreateVerificationCodeInput }

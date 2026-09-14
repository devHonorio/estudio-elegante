import { result, type Result } from "@/src/modules/shared/result"
import { Phone } from "@/src/modules/shared/value-object/phone"
import { IdentityId, type IdentityId as IdentityIdType } from "./value-object"
import type { IdentityError } from "./identity-error"

export type Identity = {
  readonly id: IdentityIdType
  readonly phone: Phone
  readonly createdAt: Date
  readonly updatedAt: Date
}

type CreateIdentityInput = {
  readonly id: string
  readonly phone: string
}

type ReconstituteIdentityInput = CreateIdentityInput & {
  readonly createdAt: Date
  readonly updatedAt: Date
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const validateId = (input: unknown): Result<IdentityIdType, IdentityError> => {
  const idResult = IdentityId.tryCreate(input)

  if (idResult.fail) {
    const codes = idResult.error.map((error) => error.code)
    const code = codes.includes("IDENTITY_ID_REQUIRED")
      ? "IDENTITY_REQUIRED_ID"
      : codes.includes("IDENTITY_ID_INVALID_TYPE")
        ? "IDENTITY_INVALID_ID_TYPE"
        : "IDENTITY_INVALID_ID"

    return result.fail(
      {
        code,
        message:
          code === "IDENTITY_REQUIRED_ID"
            ? "O id da identity é obrigatório."
            : "O id da identity é inválido.",
        cause: idResult.error,
      },
      {
        cause: idResult.error,
      },
    )
  }

  return result.ok(idResult.value)
}

const validatePhone = (input: unknown): Result<Phone, IdentityError> => {
  const phoneResult = Phone.tryCreate(input)

  if (phoneResult.fail) {
    const hasRequired = phoneResult.error.some((e) => e.code === "PHONE_REQUIRED")

    return result.fail(
      {
        code: hasRequired ? "IDENTITY_REQUIRED_PHONE" : "IDENTITY_INVALID_PHONE",
        message: hasRequired
          ? "O telefone da identity é obrigatório."
          : "O telefone da identity é inválido.",
        cause: phoneResult.error,
      },
      {
        cause: phoneResult.error,
      },
    )
  }

  return result.ok(phoneResult.value)
}

const validateCreatedAt = (input: unknown): Result<Date, IdentityError> => {
  if (!(input instanceof Date)) {
    return result.fail({
      code: "IDENTITY_INVALID_CREATED_AT",
      message: "O createdAt da identity deve ser uma data válida.",
    })
  }

  if (Number.isNaN(input.getTime())) {
    return result.fail({
      code: "IDENTITY_INVALID_CREATED_AT",
      message: "O createdAt da identity deve ser uma data válida.",
    })
  }

  return result.ok(input)
}

const validateUpdatedAt = (input: unknown): Result<Date, IdentityError> => {
  if (!(input instanceof Date)) {
    return result.fail({
      code: "IDENTITY_INVALID_UPDATED_AT",
      message: "O updatedAt da identity deve ser uma data válida.",
    })
  }

  if (Number.isNaN(input.getTime())) {
    return result.fail({
      code: "IDENTITY_INVALID_UPDATED_AT",
      message: "O updatedAt da identity deve ser uma data válida.",
    })
  }

  return result.ok(input)
}

const tryCreate = (input: unknown): Result<Identity, IdentityError[]> => {
  if (!isRecord(input)) {
    return result.fail([
      {
        code: "IDENTITY_INVALID_TYPE",
        message: "A identity deve ser um objeto.",
      },
    ])
  }

  const idValidation = validateId(input.id)
  const phoneValidation = validatePhone(input.phone)
  const createdAtValidation = validateCreatedAt(input.createdAt)
  const updatedAtValidation = validateUpdatedAt(input.updatedAt)

  const combined = result.combine(
    idValidation,
    phoneValidation,
    createdAtValidation,
    updatedAtValidation,
  )

  if (combined.fail) {
    return combined
  }

  const [id, phone, createdAt, updatedAt] = combined.value

  return result.ok({
    id,
    phone,
    createdAt,
    updatedAt,
  })
}

const create = (input: CreateIdentityInput, now: Date): Identity => {
  const identityResult = tryCreate({
    ...input,
    createdAt: now,
    updatedAt: now,
  })

  if (identityResult.fail) {
    const codes = identityResult.error.map((error) => error.code).join(", ")
    throw new Error(`Pré-condição do Identity violada: ${codes}.`)
  }

  return identityResult.value
}

const Identity = {
  create,
  tryCreate,
}

export { Identity, isRecord }
export type { IdentityIdType as IdentityId, CreateIdentityInput, ReconstituteIdentityInput }

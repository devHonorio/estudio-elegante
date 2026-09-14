import { result, type Result } from "@/src/modules/shared/result"
import type { IdGeneratorProvider } from "@/src/modules/shared/value-object/id/id-generator.provider"
import type { IdentityIdError } from "./identity-id-error"

// Nominal typing brand to prevent assignment from generic Id
declare const identityIdBrand: unique symbol

export type IdentityId = {
  readonly value: string
  readonly [identityIdBrand]: typeof identityIdBrand
}

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isValidUuidV7 = (value: string): boolean => {
  return UUID_V7_REGEX.test(value)
}

const validateRequired = (input: string): Result<string, IdentityIdError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "IDENTITY_ID_REQUIRED",
      message: "O identity id é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateFormat = (input: string): Result<string, IdentityIdError> => {
  if (!isValidUuidV7(input)) {
    return result.fail({
      code: "IDENTITY_ID_INVALID_FORMAT",
      message: "O identity id deve ser um UUID v7 válido.",
    })
  }

  return result.ok(input)
}

const createIdentityId = (provider: IdGeneratorProvider) => {
  const tryCreate = (input: unknown): Result<IdentityId, IdentityIdError[]> => {
    if (typeof input !== "string") {
      return result.fail([
        {
          code: "IDENTITY_ID_INVALID_TYPE",
          message: "O identity id deve ser uma string.",
        },
      ])
    }

    const validation = result.combine(validateRequired(input), validateFormat(input))

    if (validation.fail) {
      return validation
    }

    return result.ok({ value: input } as IdentityId)
  }

  const create = (value: string): IdentityId => {
    const idResult = tryCreate(value)

    if (idResult.fail) {
      const codes = idResult.error.map((error) => error.code).join(", ")
      throw new Error(`Pré-condição do IdentityId violada: ${codes}.`)
    }

    return idResult.value
  }

  const generate = (): IdentityId => {
    const value = provider.generate()

    const generatedResult = tryCreate(value)

    if (generatedResult.fail) {
      throw new Error(`Falha ao gerar IdentityId válido: ${value}.`)
    }

    return generatedResult.value
  }

  const equals = (first: IdentityId, second: IdentityId): boolean => {
    return first.value === second.value
  }

  const isValid = (input: unknown): boolean => {
    if (typeof input !== "string") return false
    return isValidUuidV7(input)
  }

  return { create, tryCreate, generate, equals, isValid }
}

export { createIdentityId, isValidUuidV7 }
export type { IdentityIdError }

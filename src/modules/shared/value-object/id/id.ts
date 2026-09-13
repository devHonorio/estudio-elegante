import { result, type Result } from "@/src/modules/shared/result"
import type { IdError } from "./id-error"
import type { IdGeneratorProvider } from "./id-generator.provider"

type Id = {
  readonly value: string
}

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isValidUuidV7 = (value: string): boolean => {
  return UUID_V7_REGEX.test(value)
}

const validateRequired = (input: string): Result<string, IdError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "ID_REQUIRED",
      message: "O id é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateFormat = (input: string): Result<string, IdError> => {
  if (!isValidUuidV7(input)) {
    return result.fail({
      code: "ID_INVALID_FORMAT",
      message: "O id deve ser um UUID v7 válido.",
    })
  }

  return result.ok(input)
}

const createId = (provider: IdGeneratorProvider) => {
  const tryCreate = (input: unknown): Result<Id, IdError[]> => {
    if (typeof input !== "string") {
      return result.fail([
        {
          code: "ID_INVALID_TYPE",
          message: "O id deve ser uma string.",
        },
      ])
    }

    const validation = result.combine(validateRequired(input), validateFormat(input))

    if (validation.fail) {
      return validation
    }

    return result.ok({ value: input })
  }

  const create = (value: string): Id => {
    const idResult = tryCreate(value)

    if (idResult.fail) {
      const codes = idResult.error.map((error) => error.code).join(", ")
      throw new Error(`Pré-condição do Id violada: ${codes}.`)
    }

    return idResult.value
  }

  const generate = (): Id => {
    const value = provider.generate()

    const generatedResult = tryCreate(value)

    if (generatedResult.fail) {
      throw new Error(`Falha ao gerar Id válido: ${value}.`)
    }

    return generatedResult.value
  }

  const equals = (first: Id, second: Id): boolean => {
    return first.value === second.value
  }

  const isValid = (input: unknown): boolean => {
    if (typeof input !== "string") return false
    return isValidUuidV7(input)
  }

  return { create, tryCreate, generate, equals, isValid }
}

export { createId, isValidUuidV7 }
export type { Id }

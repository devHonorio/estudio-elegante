import { createIdFactory } from "./id.factory"
import type { Id as IdVO } from "./id"

export const Id = createIdFactory()

export { createId } from "./id"
export { createIdFactory } from "./id.factory"
export { createUuidIdGenerator } from "@/src/modules/shared/infra/id/uuid/uuid.id-generator"
export type Id = IdVO
export type { IdError, IdErrorCode } from "./id-error"
export type { IdGeneratorProvider } from "./id-generator.provider"
export { isValidUuidV7 } from "./id"

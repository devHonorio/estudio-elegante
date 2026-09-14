import { IdentityId as IdentityIdValue } from "./identity-id.factory"
import type { IdentityId as IdentityIdVO } from "./identity-id.value-object"

export const IdentityId = IdentityIdValue
export type IdentityId = IdentityIdVO

export { createIdentityId, isValidUuidV7 } from "./identity-id.value-object"
export { createIdentityIdFactory } from "./identity-id.factory"
export type { IdentityIdError, IdentityIdErrorCode } from "./identity-id-error"

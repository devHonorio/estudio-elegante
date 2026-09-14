import { Identity as IdentityValue } from "./identity.entity"
import { IdentityId as IdentityIdValue } from "./value-object"
import { VerificationCode as VerificationCodeValue } from "./verification-code"
import type { Identity as IdentityType } from "./identity.entity"
import type { IdentityId as IdentityIdVO } from "./value-object"
import type { VerificationCode as VerificationCodeType } from "./verification-code"

export const Identity = IdentityValue
export type Identity = IdentityType
export const IdentityId = IdentityIdValue
export type IdentityId = IdentityIdVO
export const VerificationCode = VerificationCodeValue
export type VerificationCode = VerificationCodeType

export type { CreateIdentityInput, ReconstituteIdentityInput } from "./identity.entity"
export { createIdentityId, createIdentityIdFactory } from "./value-object"
export type { IdentityIdError, IdentityIdErrorCode } from "./value-object"
export type { IdentityError, IdentityErrorCode } from "./identity-error"
export type {
  IdentityRepositoryError,
  IdentityRepositoryErrorCode,
  CreateIdentityRepositoryInput,
  CreateIdentityRepository,
  FindIdentityByPhoneRepository,
  FindIdentityByIdRepository,
} from "./repository"
export type {
  CreateVerificationCodeInput,
  VerificationCodeError,
  VerificationCodeErrorCode,
} from "./verification-code"
export type {
  VerificationCodeSenderProvider,
  VerificationCodeSenderInput,
  VerificationCodeSenderErrorCode,
  VerificationCodeSenderError,
  VerificationCodeHashVerifierProvider,
  VerificationCodeHashVerifierInput,
  VerificationCodeHashVerifierErrorCode,
  VerificationCodeHashVerifierError,
} from "./verification-code"

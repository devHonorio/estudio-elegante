import { VerificationCode as VerificationCodeValue } from "./verification-code.entity"
import type { VerificationCode as VerificationCodeType } from "./verification-code.entity"

export const VerificationCode = VerificationCodeValue
export type VerificationCode = VerificationCodeType

export type { CreateVerificationCodeInput } from "./verification-code.entity"
export type { VerificationCodeError, VerificationCodeErrorCode } from "./verification-code-error"
export type {
  VerificationCodeSenderProvider,
  VerificationCodeSenderInput,
  VerificationCodeSenderErrorCode,
  VerificationCodeSenderError,
  VerificationCodeHashVerifierProvider,
  VerificationCodeHashVerifierInput,
  VerificationCodeHashVerifierErrorCode,
  VerificationCodeHashVerifierError,
} from "./provider"

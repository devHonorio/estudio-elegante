import type { Result } from "@/src/modules/shared/result"
import type { Phone } from "@/src/modules/shared/value-object/phone"

type VerificationCodeSenderInput = {
  readonly phone: Phone
  readonly code: string
}

type VerificationCodeSenderErrorCode =
  | "VERIFICATION_CODE_SEND_FAILED"
  | "VERIFICATION_CODE_SENDER_UNAVAILABLE"

type VerificationCodeSenderError = {
  readonly code: VerificationCodeSenderErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

type VerificationCodeSenderProvider = {
  send(
    input: VerificationCodeSenderInput,
  ): Promise<Result<void, VerificationCodeSenderError>>
}

export type {
  VerificationCodeSenderInput,
  VerificationCodeSenderErrorCode,
  VerificationCodeSenderError,
  VerificationCodeSenderProvider,
}

type VerificationCodeErrorCode =
  | "VERIFICATION_CODE_INVALID_TYPE"
  | "VERIFICATION_CODE_INVALID_ID"
  | "VERIFICATION_CODE_INVALID_PHONE"
  | "VERIFICATION_CODE_REQUIRED_CODE_HASH"
  | "VERIFICATION_CODE_INVALID_CODE_HASH"
  | "VERIFICATION_CODE_INVALID_EXPIRES_AT"
  | "VERIFICATION_CODE_INVALID_ATTEMPTS"
  | "VERIFICATION_CODE_INVALID_MAX_ATTEMPTS"
  | "VERIFICATION_CODE_INVALID_CONSUMED_AT"
  | "VERIFICATION_CODE_INVALID_CREATED_AT"
  | "VERIFICATION_CODE_ATTEMPTS_EXHAUSTED"
  | "VERIFICATION_CODE_ALREADY_CONSUMED"

type VerificationCodeError = {
  readonly code: VerificationCodeErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

export type { VerificationCodeError, VerificationCodeErrorCode }

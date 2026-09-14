import type { Result } from "@/src/modules/shared/result"

type VerificationCodeHashVerifierInput = {
  readonly code: string
  readonly hash: string
}

type VerificationCodeHashVerifierErrorCode =
  | "VERIFICATION_CODE_HASH_VERIFY_FAILED"
  | "VERIFICATION_CODE_HASH_VERIFIER_UNAVAILABLE"

type VerificationCodeHashVerifierError = {
  readonly code: VerificationCodeHashVerifierErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

type VerificationCodeHashVerifierProvider = {
  verify(
    input: VerificationCodeHashVerifierInput,
  ): Promise<Result<boolean, VerificationCodeHashVerifierError>>
}

export type {
  VerificationCodeHashVerifierInput,
  VerificationCodeHashVerifierErrorCode,
  VerificationCodeHashVerifierError,
  VerificationCodeHashVerifierProvider,
}

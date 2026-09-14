type IdentityErrorCode =
  | "IDENTITY_INVALID_TYPE"
  | "IDENTITY_REQUIRED_ID"
  | "IDENTITY_INVALID_ID_TYPE"
  | "IDENTITY_INVALID_ID"
  | "IDENTITY_REQUIRED_PHONE"
  | "IDENTITY_INVALID_PHONE"
  | "IDENTITY_INVALID_CREATED_AT"
  | "IDENTITY_INVALID_UPDATED_AT"

type IdentityError = {
  readonly code: IdentityErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

export type { IdentityError, IdentityErrorCode }

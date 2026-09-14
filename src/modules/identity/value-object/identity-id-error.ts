type IdentityIdErrorCode =
  | "IDENTITY_ID_INVALID_TYPE"
  | "IDENTITY_ID_REQUIRED"
  | "IDENTITY_ID_INVALID_FORMAT"

type IdentityIdError = {
  readonly code: IdentityIdErrorCode
  readonly message: string
}

export type { IdentityIdError, IdentityIdErrorCode }

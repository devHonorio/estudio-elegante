type IdentityRepositoryErrorCode =
  | "IDENTITY_REPOSITORY_CREATE_FAILED"
  | "IDENTITY_REPOSITORY_FIND_BY_PHONE_FAILED"
  | "IDENTITY_REPOSITORY_FIND_BY_ID_FAILED"

type IdentityRepositoryError = {
  readonly code: IdentityRepositoryErrorCode
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

export type { IdentityRepositoryError, IdentityRepositoryErrorCode }

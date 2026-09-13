type UsernameErrorCode =
  | "USERNAME_INVALID_TYPE"
  | "USERNAME_REQUIRED"
  | "USERNAME_INVALID_LENGTH"
  | "USERNAME_INVALID_FORMAT"

type UsernameError = {
  readonly code: UsernameErrorCode
  readonly message: string
}

export type { UsernameError, UsernameErrorCode }

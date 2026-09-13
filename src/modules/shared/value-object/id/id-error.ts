type IdErrorCode = "ID_INVALID_TYPE" | "ID_REQUIRED" | "ID_INVALID_FORMAT"

type IdError = {
  readonly code: IdErrorCode
  readonly message: string
}

export type { IdError, IdErrorCode }

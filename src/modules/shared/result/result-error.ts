type ResultError = {
  readonly code: string
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

export type { ResultError }
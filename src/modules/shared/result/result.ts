type ResultSuccess<T> = {
  readonly success: true
  readonly fail: false
  readonly value: T
}

type ResultFailure<E> = {
  readonly success: false
  readonly fail: true
  readonly error: E
}

type Result<T, E> = ResultSuccess<T> | ResultFailure<E>

type FailInfo = {
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}

type FailOptions = FailInfo

type ResultValueOf<R extends Result<unknown, unknown>> = R extends ResultSuccess<
  infer Value
>
  ? Value
  : never

type ResultErrorOf<R extends Result<unknown, unknown>> = R extends ResultFailure<
  infer Error
>
  ? Error
  : never

type CombinedValues<Results extends readonly Result<unknown, unknown>[]> = {
  -readonly [Index in keyof Results]: ResultValueOf<Results[Index]>
}

type CombinedErrors<Results extends readonly Result<unknown, unknown>[]> = {
  -readonly [Index in keyof Results]: ResultErrorOf<Results[Index]>
}[number]

type FailedResults<
  Results extends readonly Result<unknown, unknown>[],
> = CombinedErrors<Results>[]

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const hasOwn = (value: Record<string, unknown>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(value, key)
}

const ok = <T>(value: T): Result<T, never> => {
  return {
    success: true,
    fail: false,
    value,
  }
}

const fail = <E>(error: E, options?: FailOptions): Result<never, E & FailInfo> => {
  if (options === undefined || !isRecord(error)) {
    return { success: false, fail: true, error: error as E & FailInfo }
  }
  if (hasOwn(error, "cause") && hasOwn(error, "metadata")) {
    return { success: false, fail: true, error: error as E & FailInfo }
  }
  const augmented = { ...error } as Record<string, unknown>
  if (!hasOwn(error, "cause") && options.cause !== undefined) {
    augmented.cause = options.cause
  }
  if (!hasOwn(error, "metadata") && options.metadata !== undefined) {
    augmented.metadata = options.metadata
  }
  return { success: false, fail: true, error: augmented as E & FailInfo }
}

const tryFn = <T>(fn: () => T): Result<T, unknown> => {
  try {
    return ok(fn())
  } catch (cause) {
    return fail(cause)
  }
}

const tryAsync = async <T>(fn: () => Promise<T>): Promise<Result<T, unknown>> => {
  try {
    const value = await fn()
    return ok(value)
  } catch (cause) {
    return fail(cause)
  }
}

const combine = <const Results extends readonly Result<unknown, unknown>[]>(
  ...results: Results
): Result<CombinedValues<Results>, FailedResults<Results>> => {
  const values: unknown[] = []
  const failures: unknown[] = []
  for (const current of results) {
    if (current.success) {
      values.push(current.value)
    } else {
      failures.push(current.error)
    }
  }
  if (failures.length > 0) {
    return fail(failures as FailedResults<Results>)
  }
  return ok(values as CombinedValues<Results>)
}

const result = {
  ok,
  fail,
  try: tryFn,
  tryAsync,
  combine,
}

export { result }
export type {
  Result,
  ResultSuccess,
  ResultFailure,
  FailInfo,
  FailOptions,
  FailedResults,
  CombinedValues,
  CombinedErrors,
}
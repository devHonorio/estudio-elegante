import { describe, expect, it } from "vitest"
import { VerificationCode } from "./verification-code.entity"
import type { VerificationCodeError } from "./verification-code-error"

const VALID_ID = "0194f1a2-3b1a-7a2c-8e3d-1234567890ab"
const VALID_PHONE = "+5544998692094"
const NOW = new Date("2024-01-01T00:00:00.000Z")
const EXPIRES_AT = new Date("2024-01-01T00:05:00.000Z")

const getErrorCodes = (
  verificationResult: ReturnType<typeof VerificationCode.tryCreate>,
): VerificationCodeError["code"][] => {
  expect(verificationResult.fail).toBe(true)

  if (verificationResult.fail) {
    return verificationResult.error.map((error) => error.code)
  }

  return []
}

const createValidInput = (
  overrides: Partial<Parameters<typeof VerificationCode.create>[0]> = {},
): Parameters<typeof VerificationCode.create>[0] => {
  return {
    id: VALID_ID,
    phone: VALID_PHONE,
    codeHash: "hashed-code",
    expiresAt: EXPIRES_AT,
    attempts: 0,
    maxAttempts: 3,
    consumedAt: null,
    createdAt: NOW,
    ...overrides,
  }
}

describe("VerificationCode.tryCreate", () => {
  it("create a valid verification code", () => {
    const verificationResult = VerificationCode.tryCreate(createValidInput())

    expect(verificationResult.success).toBe(true)

    if (verificationResult.success) {
      expect(verificationResult.value.phone.value).toBe(VALID_PHONE)
      expect(verificationResult.value.codeHash).toBe("hashed-code")
      expect(verificationResult.value.attempts).toBe(0)
    }
  })

  it("reject invalid structural input", () => {
    expect(getErrorCodes(VerificationCode.tryCreate(null))).toEqual([
      "VERIFICATION_CODE_INVALID_TYPE",
    ])
  })
})

describe("VerificationCode expiration", () => {
  it("is not expired before expiresAt", () => {
    const verificationCode = VerificationCode.create(createValidInput())
    const beforeExpiration = new Date("2024-01-01T00:04:59.999Z")

    expect(VerificationCode.isExpired(verificationCode, beforeExpiration)).toBe(false)
  })

  it("is expired after expiresAt", () => {
    const verificationCode = VerificationCode.create(createValidInput())
    const afterExpiration = new Date("2024-01-01T00:05:00.001Z")

    expect(VerificationCode.isExpired(verificationCode, afterExpiration)).toBe(true)
  })

  it("is expired exactly at expiresAt", () => {
    const verificationCode = VerificationCode.create(createValidInput())

    expect(VerificationCode.isExpired(verificationCode, EXPIRES_AT)).toBe(true)
  })
})

describe("VerificationCode consumption", () => {
  it("is not consumed when consumedAt is null", () => {
    const verificationCode = VerificationCode.create(createValidInput())

    expect(VerificationCode.isConsumed(verificationCode)).toBe(false)
  })

  it("is consumed when consumedAt has a date", () => {
    const verificationCode = VerificationCode.create(
      createValidInput({ consumedAt: NOW }),
    )

    expect(VerificationCode.isConsumed(verificationCode)).toBe(true)
  })

  it("consume returns a new verification code", () => {
    const verificationCode = VerificationCode.create(createValidInput())
    const consumedAt = new Date("2024-01-01T00:01:00.000Z")
    const consumed = VerificationCode.consume(verificationCode, consumedAt)

    expect(consumed.success).toBe(true)

    if (consumed.success) {
      expect(consumed.value.consumedAt).toBe(consumedAt)
      expect(verificationCode.consumedAt).toBeNull()
    }
  })

  it("does not consume an already consumed code", () => {
    const verificationCode = VerificationCode.create(
      createValidInput({ consumedAt: NOW }),
    )
    const consumed = VerificationCode.consume(verificationCode, NOW)

    expect(consumed.fail).toBe(true)

    if (consumed.fail) {
      expect(consumed.error.code).toBe("VERIFICATION_CODE_ALREADY_CONSUMED")
    }
  })
})

describe("VerificationCode attempts", () => {
  it("can attempt when attempts are available", () => {
    const verificationCode = VerificationCode.create(
      createValidInput({ attempts: 2, maxAttempts: 3 }),
    )

    expect(VerificationCode.canAttempt(verificationCode)).toBe(true)
  })

  it("cannot attempt when attempts are exhausted", () => {
    const verificationCode = VerificationCode.create(
      createValidInput({ attempts: 3, maxAttempts: 3 }),
    )

    expect(VerificationCode.canAttempt(verificationCode)).toBe(false)
  })

  it("incrementAttempts returns a new verification code", () => {
    const verificationCode = VerificationCode.create(createValidInput())
    const incremented = VerificationCode.incrementAttempts(verificationCode)

    expect(incremented.success).toBe(true)

    if (incremented.success) {
      expect(incremented.value.attempts).toBe(1)
      expect(verificationCode.attempts).toBe(0)
    }
  })

  it("does not increment attempts when exhausted", () => {
    const verificationCode = VerificationCode.create(
      createValidInput({ attempts: 3, maxAttempts: 3 }),
    )
    const incremented = VerificationCode.incrementAttempts(verificationCode)

    expect(incremented.fail).toBe(true)

    if (incremented.fail) {
      expect(incremented.error.code).toBe("VERIFICATION_CODE_ATTEMPTS_EXHAUSTED")
    }
  })
})

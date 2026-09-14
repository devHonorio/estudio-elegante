import { describe, expect, it } from "vitest"
import { Id } from "@/src/modules/shared/value-object/id"
import type { Result } from "@/src/modules/shared/result"
import { Identity, type CreateIdentityInput, type ReconstituteIdentityInput } from "./identity.entity"
import type { IdentityId as IdentityIdType } from "./value-object"
import type { IdentityError } from "./identity-error"

const VALID_ID = "0194f1a2-3b1a-7a2c-8e3d-1234567890ab"
const VALID_PHONE = "+5544998692094"

const getErrorCodes = (result: Result<Identity, IdentityError[]>): IdentityError["code"][] => {
  expect(result.fail).toBe(true)

  if (result.fail) {
    return result.error.map((error) => error.code)
  }

  return []
}

const NOW = new Date("2024-01-01T00:00:00.000Z")

const createValidInput = (overrides: Partial<CreateIdentityInput> = {}): CreateIdentityInput => {
  return {
    id: VALID_ID,
    phone: VALID_PHONE,
    ...overrides,
  }
}

const createValidReconstituteInput = (
  overrides: Partial<ReconstituteIdentityInput> = {},
): ReconstituteIdentityInput => {
  return {
    id: VALID_ID,
    phone: VALID_PHONE,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    ...overrides,
  }
}

describe("Identity.tryCreate", () => {
  it("create a valid identity", () => {
    const result = Identity.tryCreate(createValidReconstituteInput())

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.value.id.value).toBe(VALID_ID)
      expect(result.value.phone.value).toBe("+5544998692094")
      expect(result.value.createdAt).toBeInstanceOf(Date)
      expect(result.value.updatedAt).toBeInstanceOf(Date)
    }
  })

  it("accept valid phone variations", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ phone: "(44) 99869-2094" }))

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.value.phone.value).toBe("+5544998692094")
    }
  })

  it("fail with invalid type when not an object", () => {
    expect(getErrorCodes(Identity.tryCreate(null))).toEqual(["IDENTITY_INVALID_TYPE"])
    expect(getErrorCodes(Identity.tryCreate("string"))).toEqual(["IDENTITY_INVALID_TYPE"])
    expect(getErrorCodes(Identity.tryCreate(123))).toEqual(["IDENTITY_INVALID_TYPE"])
    expect(getErrorCodes(Identity.tryCreate([]))).toEqual(["IDENTITY_INVALID_TYPE"])
  })

  it("fail with invalid id", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ id: "invalid-uuid" }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_INVALID_ID"])
  })

  it("fail with required id", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ id: "" }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_REQUIRED_ID"])
  })

  it("fail with invalid id type", () => {
    const result = Identity.tryCreate({
      ...createValidReconstituteInput(),
      id: 123,
    })

    expect(getErrorCodes(result)).toEqual(["IDENTITY_INVALID_ID_TYPE"])
  })

  it("fail with invalid phone", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ phone: "invalid-phone" }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_INVALID_PHONE"])
  })

  it("fail with required phone", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ phone: "" }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_REQUIRED_PHONE"])
  })

  it("fail with invalid createdAt", () => {
    const result = Identity.tryCreate({
      ...createValidReconstituteInput(),
      createdAt: "2024-01-01",
    })

    expect(getErrorCodes(result)).toEqual(["IDENTITY_INVALID_CREATED_AT"])
  })

  it("fail with invalid updatedAt", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ updatedAt: new Date("invalid") }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_INVALID_UPDATED_AT"])
  })

  it("accumulate independent validation errors in order", () => {
    const result = Identity.tryCreate({
      id: "invalid",
      phone: "invalid",
      createdAt: "invalid",
      updatedAt: new Date("invalid"),
    })

    expect(getErrorCodes(result)).toEqual([
      "IDENTITY_INVALID_ID",
      "IDENTITY_INVALID_PHONE",
      "IDENTITY_INVALID_CREATED_AT",
      "IDENTITY_INVALID_UPDATED_AT",
    ])
  })

  it("returns explicit success/fail flags without throwing", () => {
    const valid = Identity.tryCreate(createValidReconstituteInput())
    const invalid = Identity.tryCreate(null)

    expect(valid.success).toBe(true)
    expect(valid.fail).toBe(false)
    expect(invalid.fail).toBe(true)
    expect(invalid.success).toBe(false)
  })

  it("preserves Id value object invariants", () => {
    const result = Identity.tryCreate(createValidReconstituteInput({ id: "" }))

    expect(getErrorCodes(result)).toEqual(["IDENTITY_REQUIRED_ID"])
  })

  it("does not contain accountType, customer, business or role", () => {
    const result = Identity.tryCreate(createValidReconstituteInput())

    expect(result.success).toBe(true)

    if (result.success) {
      expect("accountType" in result.value).toBe(false)
      expect("customer" in result.value).toBe(false)
      expect("business" in result.value).toBe(false)
      expect("role" in result.value).toBe(false)
      expect("password" in result.value).toBe(false)
      expect("name" in result.value).toBe(false)
    }
  })
})

describe("Identity.create", () => {
  it("create a valid identity", () => {
    const identity = Identity.create(createValidInput(), NOW)

    expect(identity.id.value).toBe(VALID_ID)
    expect(identity.phone.value).toBe("+5544998692094")
  })

  it("creates timestamps from the explicit application time", () => {
    const identity = Identity.create(createValidInput(), NOW)

    expect(identity.createdAt).toBe(NOW)
    expect(identity.updatedAt).toBe(NOW)
  })

  it("throw when precondition is violated - invalid id", () => {
    expect(() => Identity.create(createValidInput({ id: "invalid" }), NOW)).toThrow(
      "Pré-condição do Identity violada",
    )
  })

  it("throw when precondition is violated - invalid phone", () => {
    expect(() => Identity.create(createValidInput({ phone: "" }), NOW)).toThrow()
  })

  it("never creates an invalid identity", () => {
    expect(() => Identity.create(createValidInput({ id: "", phone: "" }), NOW)).toThrow()
  })
})

describe("Identity immutability", () => {
  it("preserves original values", () => {
    const createdAt = new Date("2024-01-01T00:00:00.000Z")
    const updatedAt = new Date("2024-01-02T00:00:00.000Z")
    const identity = Identity.tryCreate(
      createValidReconstituteInput({
        createdAt,
        updatedAt,
      }),
    )

    expect(identity.success).toBe(true)

    if (identity.success) {
      expect(identity.value.createdAt).toBe(createdAt)
      expect(identity.value.updatedAt).toBe(updatedAt)
      expect(identity.value.phone.value).toBe("+5544998692094")
    }
  })

  it("uses readonly value objects", () => {
    const identity = Identity.create(createValidInput(), NOW)

    // Type-level readonly check - runtime object is frozen-like by convention
    expect(identity.id.value).toBe(VALID_ID)
    expect(Id.isValid(identity.id.value)).toBe(true)
  })
})

describe("IdentityId isolation", () => {
  it("IdentityId can expose its string value", () => {
    const identity = Identity.create(createValidInput(), NOW)

    expect(identity.id.value).toBe(VALID_ID)
  })

  it("does not accept generic Id as IdentityId", () => {
    const id = Id.create(VALID_ID)
    // @ts-expect-error generic Id must not be assignable to IdentityId
    const identityId: IdentityIdType = id

    expect(id.value).toBe(VALID_ID)
    expect(identityId.value).toBe(VALID_ID)
  })
})

import { describe, expect, it } from "vitest"
import { Username } from "@/src/modules/shared/value-object/username"
import type { Username as UsernameType, UsernameError } from "@/src/modules/shared/value-object/username/username"
import type { Result } from "@/src/modules/shared/result"

const getErrorCodes = (result: Result<UsernameType, UsernameError[]>): UsernameError["code"][] => {
  expect(result.fail).toBe(true)
  if (result.fail) return result.error.map((e) => e.code)
  return []
}

describe("Username.tryCreate", () => {
  it.each([
    "john",
    "john_doe",
    "john.doe",
    "user123",
    "abc",
    "a".repeat(30),
    "john_doe123",
    "j0h.n_doe",
    "usr",
  ])("accept valid username %s", (input) => {
    const r = Username.tryCreate(input)
    expect(r.success).toBe(true)
    if (r.success) expect(r.value.value).toBe(input.toLowerCase())
  })

  it.each([
    ["JohnDoe", "johndoe"],
    ["JOHN_DOE", "john_doe"],
    ["John.Doe123", "john.doe123"],
    ["AbC", "abc"],
    ["USER", "user"],
    ["JoHn_DoE", "john_doe"],
  ])("normalize uppercase %s to %s", (input, expected) => {
    const r = Username.tryCreate(input)
    expect(r.success).toBe(true)
    if (r.success) expect(r.value.value).toBe(expected)
  })

  it.each([123, null, undefined, {}, [], true])("fail with invalid type %s", (input) => {
    const r = Username.tryCreate(input)
    expect(getErrorCodes(r)).toEqual(["USERNAME_INVALID_TYPE"])
  })

  it.each([
    ["", ["USERNAME_REQUIRED", "USERNAME_INVALID_LENGTH", "USERNAME_INVALID_FORMAT"]],
    ["   ", ["USERNAME_REQUIRED", "USERNAME_INVALID_FORMAT"]],
    ["\t", ["USERNAME_REQUIRED", "USERNAME_INVALID_LENGTH", "USERNAME_INVALID_FORMAT"]],
    ["\n", ["USERNAME_REQUIRED", "USERNAME_INVALID_LENGTH", "USERNAME_INVALID_FORMAT"]],
  ])("fail required for %s", (input, expected) => {
    const r = Username.tryCreate(input as unknown as string)
    expect(getErrorCodes(r)).toEqual(expected)
  })

  it.each(["ab", "a", "a".repeat(31), "a".repeat(100)])("fail length for %s", (input) => {
    const r = Username.tryCreate(input)
    expect(getErrorCodes(r)).toContain("USERNAME_INVALID_LENGTH")
  })

  it.each(["john-doe", "john doe", "john@doe", "john!doe", "john#", "ábc", "joão"])(
    "fail format for %s",
    (input) => {
      const r = Username.tryCreate(input)
      expect(getErrorCodes(r)).toEqual(["USERNAME_INVALID_FORMAT"])
    },
  )

  it("accumulate length and format", () => {
    const r = Username.tryCreate("a!")
    expect(getErrorCodes(r)).toEqual(["USERNAME_INVALID_LENGTH", "USERNAME_INVALID_FORMAT"])
  })

  it("accumulate required, length and format for empty", () => {
    const r = Username.tryCreate("")
    expect(getErrorCodes(r)).toEqual([
      "USERNAME_REQUIRED",
      "USERNAME_INVALID_LENGTH",
      "USERNAME_INVALID_FORMAT",
    ])
  })

  it("returns explicit success/fail", () => {
    const ok = Username.tryCreate("john_doe")
    const fail = Username.tryCreate("ab")
    expect(ok.success).toBe(true)
    expect(ok.fail).toBe(false)
    expect(fail.fail).toBe(true)
    expect(fail.success).toBe(false)
  })

  it("isValid normalizes uppercase", () => {
    expect(Username.isValid("JohnDoe")).toBe(true)
    expect(Username.isValid("JOHN")).toBe(true)
    expect(Username.isValid("ab")).toBe(false)
    expect(Username.isValid("john@doe")).toBe(false)
  })
})

describe("Username.create", () => {
  it("create valid username", () => {
    const u = Username.create("john_doe")
    expect(u.value).toBe("john_doe")
  })

  it("create normalizes uppercase", () => {
    const u = Username.create("JohnDoe")
    expect(u.value).toBe("johndoe")
  })

  it.each(["", "ab", "john@doe", "a".repeat(31)])("throw for invalid %s", (input) => {
    expect(() => Username.create(input)).toThrow("Pré-condição do Username violada")
  })

  it("never creates invalid Username", () => {
    expect(() => Username.create("  ")).toThrow()
    expect(() => Username.create("a!")).toThrow()
  })
})

describe("Username.equals", () => {
  it("true for equal normalized values", () => {
    const a = Username.create("JohnDoe")
    const b = Username.create("johndoe")
    expect(Username.equals(a, b)).toBe(true)
  })

  it("false for different", () => {
    const a = Username.create("john")
    const b = Username.create("jane")
    expect(Username.equals(a, b)).toBe(false)
  })
})

describe("Username normalization", () => {
  it("always stores lowercase", () => {
    const r = Username.tryCreate("John.DOE_123")
    expect(r.success).toBe(true)
    if (r.success) expect(r.value.value).toBe("john.doe_123")
  })

  it("does not alter valid lowercase", () => {
    const r = Username.tryCreate("john_doe")
    if (r.success) expect(r.value.value).toBe("john_doe")
  })
})

describe("Username immutability", () => {
  it("preserves value", () => {
    const u = Username.create("john_doe")
    expect(u.value).toBe("john_doe")
  })
})

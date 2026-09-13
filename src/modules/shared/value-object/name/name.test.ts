import { describe, expect, it } from "vitest";
import { Name, type NameError } from "@/src/modules/shared/value-object/name";
import type { Result } from "@/src/modules/shared/result/result";

const getErrorCodes = (
  nameResult: Result<Name, NameError[]>,
): NameError["code"][] => {
  expect(nameResult.fail).toBe(true);

  if (nameResult.fail) {
    return nameResult.error.map((error) => error.code);
  }

  return [];
};

describe("Name.tryCreate", () => {
  it("create a valid full name", () => {
    const nameResult = Name.tryCreate("José Silva");

    expect(nameResult.success).toBe(true);

    if (nameResult.success) {
      expect(nameResult.value.value).toBe("José Silva");
    }
  });

  it("accept a valid multi-word name", () => {
    const nameResult = Name.tryCreate("José Honorio");

    expect(nameResult.success).toBe(true);

    if (nameResult.success) {
      expect(nameResult.value.value).toBe("José Honorio");
    }
  });

  it.each([
    "José Honorio",
    "João Pedro",
    "Maria da Silva",
    "José dos Santos",
    "João de Souza",
    "Carlos do Carmo",
    "Ana dos Santos",
    "José das Graças",
    "Ana Júlia",
    "Luís Felipe",
  ])("accept valid full name %s", (input) => {
    const nameResult = Name.tryCreate(input);

    expect(nameResult.success).toBe(true);

    if (nameResult.success) {
      expect(nameResult.value.value).toBe(input);
    }
  });

  it.each([
    "José Honorio",
    "João Pedro",
    "Márcio Silva",
    "Ângela Maria",
    "Luísa Clara",
    "Cecília Meireles",
    "Gonçalves Dias",
  ])("accept unicode full name %s", (input) => {
    const nameResult = Name.tryCreate(input);

    expect(nameResult.success).toBe(true);
  });

  it.each([123, null, undefined, {}, [], true])(
    "fail immediately with invalid type %s",
    (input) => {
      const nameResult = Name.tryCreate(input);

      expect(getErrorCodes(nameResult)).toEqual(["NAME_INVALID_TYPE"]);
    },
  );

  it.each(["José", "João", "Maria", "Ana"])(
    "reject name without a surname %s",
    (input) => {
      const nameResult = Name.tryCreate(input);

      expect(getErrorCodes(nameResult)).toEqual(["NAME_INVALID_WORD_COUNT"]);
    },
  );

  it("accumulate errors of independent validations in order", () => {
    const nameResult = Name.tryCreate(" joão  silva2");

    expect(getErrorCodes(nameResult)).toEqual([
      "NAME_INVALID_SPACING",
      "NAME_INVALID_FORMAT",
      "NAME_INVALID_CAPITALIZATION",
    ]);
  });

  it("accumulate required and spacing errors for whitespace only", () => {
    const nameResult = Name.tryCreate(" ");

    expect(getErrorCodes(nameResult)).toEqual([
      "NAME_REQUIRED",
      "NAME_INVALID_SPACING",
    ]);
  });

  it("reject empty string", () => {
    const nameResult = Name.tryCreate("");

    expect(getErrorCodes(nameResult)).toEqual([
      "NAME_REQUIRED",
      "NAME_INVALID_WORD_COUNT",
    ]);
  });

  it.each([
    [" João", ["NAME_INVALID_SPACING"]],
    ["João ", ["NAME_INVALID_SPACING"]],
    [" João ", ["NAME_INVALID_SPACING"]],
    ["João  Silva", ["NAME_INVALID_SPACING"]],
    ["José   Honorio", ["NAME_INVALID_SPACING"]],
    ["Ana     Paula", ["NAME_INVALID_SPACING"]],
  ])("reject invalid spacing %s", (input, expectedCodes) => {
    const nameResult = Name.tryCreate(input);

    expect(getErrorCodes(nameResult)).toEqual(expectedCodes);
  });

  it.each([
    ["josé honório", ["NAME_INVALID_CAPITALIZATION"]],
    ["ana Paula", ["NAME_INVALID_CAPITALIZATION"]],
    ["João silva", ["NAME_INVALID_CAPITALIZATION"]],
    ["João de souza", ["NAME_INVALID_CAPITALIZATION"]],
  ])("reject invalid capitalization %s", (input, expectedCodes) => {
    const nameResult = Name.tryCreate(input);

    expect(getErrorCodes(nameResult)).toEqual(expectedCodes);
  });

  it.each([
    ["joão", ["NAME_INVALID_WORD_COUNT", "NAME_INVALID_CAPITALIZATION"]],
    ["maria", ["NAME_INVALID_WORD_COUNT", "NAME_INVALID_CAPITALIZATION"]],
  ])(
    "reject a single word with invalid capitalization %s",
    (input, expectedCodes) => {
      const nameResult = Name.tryCreate(input);

      expect(getErrorCodes(nameResult)).toEqual(expectedCodes);
    },
  );

  it.each([
    ["João-Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João_Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João.Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João, Silva", ["NAME_INVALID_FORMAT"]],
    ["João/Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João@Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João#Silva", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["João! Silva", ["NAME_INVALID_FORMAT"]],
    ["João2", ["NAME_INVALID_FORMAT", "NAME_INVALID_WORD_COUNT"]],
    ["J. Silva", ["NAME_INVALID_FORMAT"]],
    ["José H. Silva", ["NAME_INVALID_FORMAT"]],
  ])("reject invalid format %s", (input, expectedCodes) => {
    const nameResult = Name.tryCreate(input);

    expect(getErrorCodes(nameResult)).toEqual(expectedCodes);
  });

  it.each([
    ["J Silva", ["NAME_ABBREVIATION_NOT_ALLOWED"]],
    ["A Silva", ["NAME_ABBREVIATION_NOT_ALLOWED"]],
    ["J Souza", ["NAME_ABBREVIATION_NOT_ALLOWED"]],
    ["M Oliveira", ["NAME_ABBREVIATION_NOT_ALLOWED"]],
  ])("reject abbreviation %s", (input, expectedCodes) => {
    const nameResult = Name.tryCreate(input);

    expect(getErrorCodes(nameResult)).toEqual(expectedCodes);
  });

  it("reject a combination of multiple independent rules", () => {
    const nameResult = Name.tryCreate("João 2");

    expect(getErrorCodes(nameResult)).toEqual([
      "NAME_INVALID_FORMAT",
      "NAME_ABBREVIATION_NOT_ALLOWED",
      "NAME_INVALID_CAPITALIZATION",
    ]);
  });

  it("does not normalize invalid input silently", () => {
    const nameResult = Name.tryCreate(" joão  da  silva ");

    expect(nameResult.fail).toBe(true);
  });

  it("returns explicit success/fail flags without throwing", () => {
    const valid = Name.tryCreate("Cecília Meireles");
    const invalid = Name.tryCreate(42);

    expect(valid.success).toBe(true);
    expect(valid.fail).toBe(false);
    expect(invalid.fail).toBe(true);
    expect(invalid.success).toBe(false);
  });
});

describe("Name.create", () => {
  it("create a valid name without validation", () => {
    const name = Name.create("José Honorio");

    expect(name.value).toBe("José Honorio");
  });

  it("throw when the precondition is violated", () => {
    expect(() => Name.create("joão")).toThrow();
  });

  it("throw for a single word", () => {
    expect(() => Name.create("José")).toThrow();
  });

  it("throw for an empty value", () => {
    expect(() => Name.create("")).toThrow();
  });

  it("never creates an invalid Name", () => {
    expect(() => Name.create("João  Silva")).toThrow();
    expect(() => Name.create(" J Silva")).toThrow();
  });
});

describe("Name.firstName", () => {
  it("exposes the first name as a property", () => {
    const name = Name.create("José Silva");

    expect(name.firstName).toBe("José");
  });

  it("exposes the first name from a multi-word name", () => {
    const name = Name.create("Maria da Silva");

    expect(name.firstName).toBe("Maria");
  });
});

describe("Name immutability", () => {
  it("preserves the original value", () => {
    const name = Name.create("João Pedro");

    expect(name.value).toBe("João Pedro");
  });
});
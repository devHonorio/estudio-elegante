import { describe, expect, it } from "vitest";
import {
  createPhone,
  createLibPhoneNumberParser,
  Phone,
  type ParsedPhone,
  type PhoneError,
  type PhoneParser,
} from "@/src/modules/shared/value-object/phone"
import type { Result } from "@/src/modules/shared/result"

const getErrorCodes = (
  phoneResult: Result<Phone, PhoneError[]>,
): PhoneError["code"][] => {
  expect(phoneResult.fail).toBe(true);

  if (phoneResult.fail) {
    return phoneResult.error.map((error) => error.code);
  }

  return [];
};

const stubParsedPhone: ParsedPhone = {
  value: "+5544111111111",
  formatted: "(44) 1 1111-1111",
  country: "BR",
  ddi: "55",
  ddd: "44",
};

const createStubParser = (): PhoneParser => {
  return {
    parse: (input: string) => {
      if (input === "unrecognized") {
        return { status: "unrecognized" };
      }

      if (input === "invalid") {
        return { status: "invalid" };
      }

      return { status: "valid", phone: stubParsedPhone };
    },
  };
};

describe("Phone.tryCreate", () => {
  it.each([
    "+5544998692094",
    "(44) 99869-2094",
    "(44) 9 9869-2094",
    "44 99869-2094",
    "+55 44 99869 2094",
  ])("create a valid Brazilian mobile phone %s", (input) => {
    const phoneResult = Phone.tryCreate(input);

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.value).toBe("+5544998692094");
      expect(phoneResult.value.country).toBe("BR");
      expect(phoneResult.value.ddi).toBe("55");
      expect(phoneResult.value.ddd).toBe("44");
    }
  });

  it("format a Brazilian mobile phone with 9 separated", () => {
    const phoneResult = Phone.tryCreate("+5544998692094");

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.formatted).toBe("(44) 9 9869-2094");
    }
  });

  it("format a Brazilian fixed phone", () => {
    const phoneResult = Phone.tryCreate("+554435211000");

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.value).toBe("+554435211000");
      expect(phoneResult.value.formatted).toBe("(44) 3521-1000");
      expect(phoneResult.value.ddd).toBe("44");
    }
  });

  it("create a valid Brazilian mobile phone from São Paulo", () => {
    const phoneResult = Phone.tryCreate("+5511987654321");

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.value).toBe("+5511987654321");
      expect(phoneResult.value.country).toBe("BR");
      expect(phoneResult.value.ddd).toBe("11");
      expect(phoneResult.value.formatted).toBe("(11) 9 8765-4321");
    }
  });

  it.each([
    ["+12125551234", "US", "1", "212", "(212) 555-1234"],
    ["+14165551234", "CA", "1", "416", "(416) 555-1234"],
    ["+16502530000", "US", "1", "650", "(650) 253-0000"],
  ])(
    "create a valid international phone %s",
    (input, country, ddi, ddd, formatted) => {
      const phoneResult = Phone.tryCreate(input);

      expect(phoneResult.success).toBe(true);

      if (phoneResult.success) {
        expect(phoneResult.value.value).toBe(input);
        expect(phoneResult.value.country).toBe(country);
        expect(phoneResult.value.ddi).toBe(ddi);
        expect(phoneResult.value.ddd).toBe(ddd);
        expect(phoneResult.value.formatted).toBe(formatted);
      }
    },
  );

  it("create a valid phone without area code", () => {
    const phoneResult = Phone.tryCreate("+351912345678");

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.value).toBe("+351912345678");
      expect(phoneResult.value.country).toBe("PT");
      expect(phoneResult.value.ddi).toBe("351");
      expect(phoneResult.value.ddd).toBeUndefined();
    }
  });

  it.each([
    "ABC",
    "not a phone",
    "+55",
    "+5544998692094 +5544998692094",
  ])("fail with unrecognized format %s", (input) => {
    const phoneResult = Phone.tryCreate(input);

    expect(getErrorCodes(phoneResult)).toEqual(["PHONE_INVALID_FORMAT"]);
  });

  it.each([
    "55",
    "44",
    "+55004998692094",
    "+559991234",
  ])("fail with invalid number %s", (input) => {
    const phoneResult = Phone.tryCreate(input);

    expect(getErrorCodes(phoneResult)).toEqual(["PHONE_INVALID_NUMBER"]);
  });

  it.each([
    "   ",
    "",
    "\t",
    "\n",
  ])("fail with required when input is %s", (input) => {
    const phoneResult = Phone.tryCreate(input);

    expect(getErrorCodes(phoneResult)).toEqual(["PHONE_REQUIRED"]);
  });

  it.each([123, null, undefined, {}, [], true])(
    "fail immediately with invalid type %s",
    (input) => {
      const phoneResult = Phone.tryCreate(input);

      expect(getErrorCodes(phoneResult)).toEqual(["PHONE_INVALID_TYPE"]);
    },
  );
});

describe("Phone.create", () => {
  it("create a valid phone", () => {
    const phone = Phone.create("+5544998692094");

    expect(phone.value).toBe("+5544998692094");
    expect(phone.formatted).toBe("(44) 9 9869-2094");
  });

  it.each(["", "58", "ABC", "999"])(
    "throw when creating an invalid phone %s",
    (input) => {
      expect(() => Phone.create(input)).toThrow(
        "Pré-condição do Phone violada",
      );
    },
  );
});

describe("Phone.isValid", () => {
  it("return true for a valid phone", () => {
    expect(Phone.isValid("+5544998692094")).toBe(true);
  });

  it("return false for an invalid phone", () => {
    expect(Phone.isValid("ABC")).toBe(false);
  });

  it("return false for a non-string", () => {
    expect(Phone.isValid(123)).toBe(false);
    expect(Phone.isValid(null)).toBe(false);
  });

  it("return false for an invalid Brazilian number", () => {
    expect(Phone.isValid("+55004998692094")).toBe(false);
  });
});

describe("Phone.equals", () => {
  it("return true for equal phones", () => {
    const first = Phone.create("+5544998692094");
    const second = Phone.create("(44) 9 9869-2094");

    expect(Phone.equals(first, second)).toBe(true);
  });

  it("return false for different phones", () => {
    const first = Phone.create("+5544998692094");
    const second = Phone.create("+5511987654321");

    expect(Phone.equals(first, second)).toBe(false);
  });
});

describe("Phone normalization", () => {
  it.each([
    "+5544998692094",
    "(44) 99869-2094",
    "(44) 9 9869-2094",
    "44 99869-2094",
    "+55 44 99869 2094",
  ])("normalize %s to the same canonical value", (input) => {
    const phoneResult = Phone.tryCreate(input);

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value.value).toBe("+5544998692094");
    }
  });

  it("consider different representations of the same number equal", () => {
    const first = Phone.create("(44) 99869-2094");
    const second = Phone.create("+55 44 99869 2094");

    expect(Phone.equals(first, second)).toBe(true);
  });

  it("return the canonical value as phone identity", () => {
    const phone = Phone.create("(44) 9 9869-2094");

    expect(phone.value).toBe("+5544998692094");
  });
});

describe("PhoneParser architecture", () => {
  it("compose Phone with any PhoneParser implementation", () => {
    const stubPhone = createPhone(createStubParser());

    expect(stubPhone.isValid("anything")).toBe(true);
    expect(stubPhone.isValid("invalid")).toBe(false);
  });

  it("map parser statuses to domain errors", () => {
    const stubPhone = createPhone(createStubParser());

    expect(getErrorCodes(stubPhone.tryCreate("unrecognized"))).toEqual([
      "PHONE_INVALID_FORMAT",
    ]);
    expect(getErrorCodes(stubPhone.tryCreate("invalid"))).toEqual([
      "PHONE_INVALID_NUMBER",
    ]);
  });

  it("respect the valid phone returned by the parser", () => {
    const stubPhone = createPhone(createStubParser());
    const phoneResult = stubPhone.tryCreate("anything");

    expect(phoneResult.success).toBe(true);

    if (phoneResult.success) {
      expect(phoneResult.value).toEqual(stubParsedPhone);
    }
  });

  it("create a parser using libphonenumber-js that satisfies the contract", () => {
    const parser = createLibPhoneNumberParser();
    const parsed = parser.parse("+5544998692094");

    expect(parsed.status).toBe("valid");

    if (parsed.status === "valid") {
      expect(parsed.phone.value).toBe("+5544998692094");
      expect(parsed.phone.country).toBe("BR");
      expect(parsed.phone.ddd).toBe("44");
    }
  });
});
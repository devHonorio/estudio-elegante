type ParsedPhone = {
  readonly value: string;
  readonly formatted: string;
  readonly country: string | undefined;
  readonly ddi: string;
  readonly ddd: string | undefined;
};

type PhoneParserOptions = {
  readonly defaultCountry?: string;
};

type PhoneParserResult =
  | {
      readonly status: "valid";
      readonly phone: ParsedPhone;
    }
  | {
      readonly status: "unrecognized";
    }
  | {
      readonly status: "invalid";
    };

type PhoneParser = {
  parse(input: string, options?: PhoneParserOptions): PhoneParserResult;
};

export type { ParsedPhone, PhoneParser, PhoneParserOptions, PhoneParserResult };
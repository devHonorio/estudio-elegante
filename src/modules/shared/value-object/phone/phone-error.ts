type PhoneErrorCode =
  | "PHONE_INVALID_TYPE"
  | "PHONE_REQUIRED"
  | "PHONE_INVALID_FORMAT"
  | "PHONE_INVALID_NUMBER";

type PhoneError = {
  readonly code: PhoneErrorCode;
  readonly message: string;
};

export type { PhoneError, PhoneErrorCode };
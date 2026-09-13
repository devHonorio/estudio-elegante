import { result, type Result } from "@/src/modules/shared/result/result";

type Name = {
  readonly value: string;
  readonly firstName: string;
};

type NameErrorCode =
  | "NAME_INVALID_TYPE"
  | "NAME_REQUIRED"
  | "NAME_INVALID_FORMAT"
  | "NAME_INVALID_SPACING"
  | "NAME_INVALID_WORD_COUNT"
  | "NAME_INVALID_CAPITALIZATION"
  | "NAME_ABBREVIATION_NOT_ALLOWED";

type NameError = {
  readonly code: NameErrorCode;
  readonly message: string;
};

const NAME_PARTICLES: readonly string[] = ["de", "da", "do", "das", "dos", "e"];

const isLetter = (char: string): boolean => {
  return /\p{L}/u.test(char);
};

const hasInvalidFormat = (value: string): boolean => {
  return [...value].some((char) => !isLetter(char) && char !== " ");
};

const hasInvalidSpacing = (value: string): boolean => {
  return value !== value.trim() || /\s{2,}/.test(value);
};

const isParticle = (word: string): boolean => {
  return NAME_PARTICLES.includes(word);
};

const isAbbreviation = (word: string): boolean => {
  return word.length === 1 && !isParticle(word);
};

const hasInvalidCapitalization = (word: string): boolean => {
  if (word.length === 0) return false;
  return !isParticle(word) && !/\p{Lu}/u.test(word[0]);
};

const isFullName = (value: string): boolean => {
  return value.split(" ").length >= 2;
};

const validateRequired = (input: string): Result<string, NameError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "NAME_REQUIRED",
      message: "O nome é obrigatório.",
    });
  }

  return result.ok(input);
};

const validateSpacing = (input: string): Result<string, NameError> => {
  if (hasInvalidSpacing(input)) {
    return result.fail({
      code: "NAME_INVALID_SPACING",
      message:
        "O nome não pode possuir espaços consecutivos, iniciais ou finais.",
    });
  }

  return result.ok(input);
};

const validateFormat = (input: string): Result<string, NameError> => {
  if (hasInvalidFormat(input)) {
    return result.fail({
      code: "NAME_INVALID_FORMAT",
      message:
        "O nome deve conter somente letras e um único espaço entre palavras.",
    });
  }

  return result.ok(input);
};

const validateWordCount = (input: string): Result<string, NameError> => {
  if (!isFullName(input)) {
    return result.fail({
      code: "NAME_INVALID_WORD_COUNT",
      message: "O nome completo deve conter nome e sobrenome.",
    });
  }

  return result.ok(input);
};

const validateAbbreviation = (input: string): Result<string, NameError> => {
  if (input.split(" ").some(isAbbreviation)) {
    return result.fail({
      code: "NAME_ABBREVIATION_NOT_ALLOWED",
      message: "Abreviaturas não são permitidas.",
    });
  }

  return result.ok(input);
};

const validateCapitalization = (input: string): Result<string, NameError> => {
  if (input.split(" ").some(hasInvalidCapitalization)) {
    return result.fail({
      code: "NAME_INVALID_CAPITALIZATION",
      message:
        "Cada palavra deve iniciar com letra maiúscula, exceto partículas permitidas.",
    });
  }

  return result.ok(input);
};

const tryCreate = (input: unknown): Result<Name, NameError[]> => {
  if (typeof input !== "string") {
    return result.fail([
      {
        code: "NAME_INVALID_TYPE",
        message: "O nome deve ser uma string.",
      },
    ]);
  }

  const validation = result.combine(
    validateRequired(input),
    validateSpacing(input),
    validateFormat(input),
    validateWordCount(input),
    validateAbbreviation(input),
    validateCapitalization(input),
  );

  if (validation.fail) {
    return validation;
  }

  return result.ok({
    value: input,
    firstName: input.split(" ")[0],
  });
};

const create = (value: string): Name => {
  const nameResult = tryCreate(value);

  if (nameResult.fail) {
    const codes = nameResult.error.map((error) => error.code).join(", ");
    throw new Error(`Pré-condição do Name violada: ${codes}.`);
  }

  return nameResult.value;
};

const Name = {
  create,
  tryCreate,
};

export { Name };
export type { NameError };
---
name: value-object
description: Creates, structures and implements Value Objects (value objects, VO, value-object, Name, Email, Phone, Cpf, Cnpj, Money, AppointmentDuration) following the project's functional and architectural conventions. Use when the user asks to create, design or implement a domain value with its own invariants and validation rules. Also use when asked to centralize validation rules that are scattered across use cases, controllers or repositories into a Value Object.
---

# Skill de Value Objects

Skill responsável por criar, estruturar e implementar **Value Objects** seguindo as convenções arquiteturais e funcionais do projeto.

Value Objects são elementos do domínio responsáveis por encapsular valores com **regras, invariantes e validações próprias**.

O objetivo é impedir que regras de validação de valores de domínio fiquem espalhadas por use cases, controllers ou outras partes da aplicação.

A skill deve seguir programação funcional e as regras de `Result` já definidas no projeto.

## 1. Conceito de Value Object

Um Value Object representa um valor do domínio que possui regras próprias e deve ser validado antes de ser utilizado pela aplicação.

Exemplos possíveis:

```text
Name
Email
Phone
Cpf
Cnpj
Money
Address
AppointmentDuration
```

Um Value Object deve proteger suas próprias invariantes.

A aplicação não deve precisar repetir suas validações em diferentes partes do código.

Exemplo:

```text
Use Case
    ↓
Name.tryCreate(...)
    ↓
Name válido
```

em vez de:

```text
Controller
    ↓
valida nome


Use Case
    ↓
valida nome novamente


Repository
    ↓
valida nome novamente
```

A validação deve estar centralizada no próprio Value Object.

## 2. Programação funcional

Value Objects devem seguir o paradigma funcional definido no projeto.

Não utilizar classes como padrão para Value Objects.

Preferir:

- tipos;
- funções puras;
- objetos imutáveis;
- composição;
- objetos literais para agrupar operações.

Evitar criar uma classe como:

```ts
class Name {
  constructor(...) {}
}
```

quando o Value Object puder ser representado funcionalmente.

## 3. Estrutura do Value Object

Um Value Object deve possuir, no mínimo, duas operações públicas:

```ts
create(...)
tryCreate(...)
```

Essas operações possuem responsabilidades diferentes e levam a resultados diferentes.

### `create`

Exige pré-condição garantida. Garante as invariantes e retorna um Value Object válido.

- Valor válido → Value Object
- Valor inválido (pré-condição violada) → `throw`

`create` NÃO é uma função que apenas empacota o valor.

### `tryCreate`

Aceita entrada potencialmente inválida (`unknown`). Retorna `Result`.

- Valor válido → `result.ok(...)`
- Valor inválido → `result.fail(...)` (podendo acumular múltiplos erros)

`tryCreate` deve obrigatoriamente utilizar o `result` compartilhado do projeto.

Exemplo:

```ts
const nameResult = Name.tryCreate(input)
```

Fluxo:

```text
valor válido
    ↓
result.ok(...)
```

```text
valor inválido
    ↓
result.fail([... erros ...])
```

Um Value Object NUNCA pode existir em estado inválido. Todas as vias de construção (`create` e `tryCreate`) devem garantir as invariantes antes de produzir o objeto.

## 4. API do Value Object

A implementação deve utilizar um objeto funcional para agrupar suas operações públicas.

Exemplo:

```ts
const Name = {
  create,
  tryCreate,
}
```

Não utilizar:

- estado mutável;
- `this`;
- construtores;
- herança;
- ciclo de vida de objetos.

O Value Object deve ser tratado como uma composição de tipos, valores imutáveis e funções puras.

## 5. `create`

`create` representa a construção de um Value Object a partir de uma pré-condição garantida.

`create` NÃO é uma função que apenas empacota o valor. Ele DEVE garantir as invariantes.

Exemplo:

```ts
const name = Name.create("José Honorio")
```

`Name.create(value)` deve resultar em um `Name` com todas as invariantes garantidas.

Fluxo:

```text
create
  ↓
valor deve ser válido
  ↓
Name
```

ou:

```text
create
  ↓
valor inválido
  ↓
throw
```

Se o valor violar uma invariante (por exemplo `Name.create("joão")`), isso representa uma violação da pré-condição de `create` e deve resultar em uma exception (`throw`).

Não utilizar `Result` como retorno normal de `create`.

Não permitir que `Name.create("joão")` produza `Name` com valor inválido.

É permitido e preferível reutilizar a validação do `tryCreate` dentro de `create` para evitar duplicação:

```ts
const create = (value: string): Name => {
  const nameResult = tryCreate(value)

  if (nameResult.fail) {
    throw new Error(...)
  }

  return nameResult.value
}
```

A mensagem da exception deve ser descritiva e apontar a violação da pré-condição.

Separação conceitual:

- `create` → falha excepcional por violação de pré-condição → `throw`
- `tryCreate` → falha esperada/previsível → `Result`

Não criar um segundo sistema de erro apenas para `create`.

Não utilizar `create` indiscriminadamente para processar entradas externas potencialmente inválidas.

Quando a validade não estiver garantida, utilizar `tryCreate`.

## 6. `tryCreate`

`tryCreate` é a porta de entrada segura para construir um Value Object a partir de um valor potencialmente inválido.

Sua entrada deve ser `unknown`, NÃO o tipo final do valor:

```ts
tryCreate(input: unknown): Result<Name, NameError[]>
```

Isso é importante porque Value Objects normalmente recebem dados provenientes de boundaries da aplicação.

Seu retorno utiliza obrigatoriamente o `Result` compartilhado:

```ts
Result<ValueObject, Errors>
```

onde `Errors` representa a lista de erros acumulados quando existem violações independentes.

Exemplo:

```ts
const nameResult = Name.tryCreate(input)
```

Com entrada válida:

```text
input válido
    ↓
result.ok(name)
```

Com entrada inválida:

```text
input inválido
    ↓
result.fail([erro1, erro2, ...])
```

Não utilizar:

```text
null
undefined
false
throw
```

como representação normal de falha.

`tryCreate` deve utilizar:

```ts
result.ok(...)
result.fail(...)
result.combine(...)
```

> O `tryCreate` deve acumular erros de validações independentes em vez de retornar apenas o primeiro erro encontrado.

### Erro estrutural / boundary

Nem toda validação pode ser executada em qualquer entrada.

Se `input` não possuir o tipo esperado (por exemplo, `typeof input !== "string"`), não é possível executar as validações específicas do Value Object que dependem do tipo.

Nesse caso, a validação deve falhar imediatamente, sem executar as demais:

```ts
if (typeof input !== "string") {
  return result.fail([
    {
      code: "NAME_INVALID_TYPE",
      message: "O nome deve ser uma string.",
    },
  ])
}
```

Não chamar `input.trim()`, `input.split(" ")` ou outro método antes de garantir o tipo esperado.

Fluxo:

```text
unknown
  ↓
tipo inválido
  ↓
falha imediata (sem executar as demais validações)
```

> Uma validação que depende de uma pré-condição não satisfeita não deve ser executada. Nesse caso, o `tryCreate` deve retornar imediatamente o erro estrutural correspondente.

### Validações independentes

Depois que a entrada possuir o tipo correto, TODAS as validações independentes possíveis devem ser executadas e combinadas.

Exemplo:

```text
input string
   ↓
├── required
├── spacing
├── format
├── abbreviation
└── capitalization
```

Não retornar o primeiro erro encontrado quando existem outros erros independentes que também poderiam ser detectados.

As validações independentes devem produzir seus próprios `Result`s e serem combinadas com `result.combine`:

```ts
const validation = result.combine(
  validateRequired(input),
  validateSpacing(input),
  validateFormat(input),
  validateAbbreviation(input),
  validateCapitalization(input),
)
```

Se todas passarem:

```text
result.ok(...)
```

Se uma ou mais falharem:

```text
result.fail([
  error1,
  error2,
  error3,
])
```

Os erros devem ser preservados na ordem das validações de origem.

### Fluxo completo do `tryCreate`

```text
unknown
  ↓
pré-condição estrutural (tipo)
  ↓
tipo inválido → result.fail([erro estrutural])
  ↓
tipo válido → validações independentes
  ↓
result.combine(...)
  ↓
com erros → result.fail(lista de erros)
  ↓
sem erros → result.ok(Value Object)
```

## 7. Result compartilhado

Todos os Value Objects devem utilizar a implementação oficial de `result` localizada em:

```text
src/modules/shared/result/
```

Não criar outra implementação de `Result` específica para o Value Object.

Não criar outro mecanismo de sucesso/falha.

A skill deve respeitar a API funcional já definida pelo projeto:

```ts
result.ok(...)
result.fail(...)
result.try(...)
result.tryAsync(...)
result.combine(...)
```

A importação deve seguir a convenção de barrel exports do projeto.

No projeto atual o alias `@/*` aponta para a raiz do repositório e os módulos ficam em `src/`:

```ts
import {
  result,
  type Result,
} from "@/src/modules/shared/result"
```

Se o diretório `src/modules/shared/result/` ainda não possuir `index.ts`, importar diretamente:

```ts
import { result } from "@/src/modules/shared/result/result"
import type { Result } from "@/src/modules/shared/result/result"
```

e, se fizer sentido, criar o `index.ts` para expor a API pública do módulo.

## 8. Modelo de erros

Os erros do Value Object devem seguir uma separação clara de responsabilidades.

O modelo é:

```text
Result<T, E>
      │
      ├── E = erro semântico do domínio
      │
      └── fail options
            ├── cause?
            └── metadata?
```

Ou seja:

```ts
result.fail(error, {
  cause?,
  metadata?,
})
```

O primeiro argumento representa **o que deu errado no domínio**.

As opções representam **informações adicionais sobre a falha**.

Não duplicar essas responsabilidades.

## 9. Erro de domínio

O erro deve representar a regra de negócio que foi violada.

Cada Value Object deve possuir códigos de erro específicos quando houver regras que possam falhar.

Exemplo:

```ts
type NameError = {
  readonly code: "NAME_INVALID_FORMAT"
  readonly message: string
}
```

Outro exemplo:

```ts
type NameError = {
  readonly code:
    | "NAME_INVALID_TYPE"
    | "NAME_REQUIRED"
    | "NAME_INVALID_FORMAT"
    | "NAME_INVALID_SPACING"
    | "NAME_INVALID_CAPITALIZATION"
    | "NAME_ABBREVIATION_NOT_ALLOWED"

  readonly message: string
}
```

O erro de domínio deve conter somente informações semânticas necessárias para identificar e descrever a falha.

Não colocar `cause` ou `metadata` no erro de domínio por padrão.

## 10. Códigos de erro

Os códigos devem representar especificamente a regra violada.

Evitar:

```text
INVALID_VALUE
VALIDATION_ERROR
BAD_REQUEST
ERROR
```

Preferir:

```text
NAME_INVALID_TYPE
NAME_REQUIRED
NAME_INVALID_FORMAT
NAME_INVALID_SPACING
NAME_INVALID_CAPITALIZATION
NAME_ABBREVIATION_NOT_ALLOWED
```

O código deve representar a regra violada.

`NAME_INVALID_TYPE` representa uma falha estrutural de entrada (o input não possui o tipo esperado) e deve ser retornado imediatamente sem executar as validações que dependem desse tipo.

O código deve ser estável.

A mensagem pode mudar sem quebrar consumidores que dependam do código.

Não utilizar a mensagem como identificador programático.

## 11. `cause`

`cause` representa a causa original ou técnica que levou à falha.

A `cause` pertence ao contexto do `result.fail`, não ao erro semântico do domínio.

Exemplo:

```ts
result.fail(error, {
  cause: originalError,
})
```

É especialmente útil para:

- exceptions;
- banco de dados;
- providers;
- APIs externas;
- bibliotecas;
- infraestrutura.

Não adicionar `cause` artificialmente.

Em Value Objects, a validação normalmente é pura. Portanto, `cause` geralmente não será necessária em `tryCreate`.

Quando existir uma causa real, ela pode ser preservada.

## 12. `metadata`

`metadata` representa contexto adicional associado à falha.

Exemplo:

```ts
result.fail(error, {
  metadata: {
    source: "user-registration",
    field: "name",
  },
})
```

Pode ser utilizado para:

- diagnóstico;
- observabilidade;
- logging;
- tracing;
- debugging.

`metadata` não deve substituir propriedades do erro de domínio.

Não utilizar `metadata` para armazenar automaticamente o valor inválido ou informações sensíveis.

Adicionar somente informações que realmente tenham utilidade.

## 13. ResultError

`ResultError` é uma abstração compartilhada opcional.

Localização:

```text
src/modules/shared/result/result-error.ts
```

Quando utilizado, deve representar somente a estrutura semântica comum de um erro.

Modelo conceitual:

```ts
type ResultError = {
  readonly code: string
  readonly message: string
}
```

Não adicionar `cause` ou `metadata` ao `ResultError` por padrão.

Essas informações pertencem às opções de:

```ts
result.fail(error, {
  cause,
  metadata,
})
```

O `ResultError` não é obrigatório para todos os Value Objects.

Quando um contexto possuir um erro específico, preferir um tipo específico:

```ts
Result<Name, NameError[]>
Result<Email, EmailError[]>
Result<AppointmentDuration, AppointmentDurationError[]>
```

O erro agrupado em array indica que validações independentes podem acumular múltiplos erros antes de retornar a falha.

> Observação: o `result-error.ts` existente no projeto declara `cause` e `metadata` como campos opcionais do `ResultError`. Isso não elimina a regra acima: para Value Objects, preferir tipos de erro específicos do contexto (`NameError`, `EmailError`, etc.) em vez de usar `ResultError` como erro de domínio.

## 14. Imutabilidade do Value Object

O Value Object deve ser imutável.

Uma vez criado, seu valor não pode ser modificado.

Exemplo:

```ts
type Name = {
  readonly value: string
}
```

Evitar:

```ts
name.value = "Outro Nome"
```

Para representar outro valor, criar um novo Value Object.

## 15. Representação do valor

O Value Object deve encapsular seu valor de forma clara.

Exemplo:

```ts
type Name = {
  readonly value: string
}
```

A representação interna pode evoluir sem que os consumidores dependam desnecessariamente de detalhes de implementação.

Quando houver necessidade real, disponibilizar funções puras para:

- obter o valor;
- comparar;
- transformar;
- serializar.

Não adicionar operações apenas por convenção.

## 16. Igualdade

Value Objects devem ser comparados pelo valor, e não pela referência do objeto.

Conceitualmente:

```text
Name("José")
==
Name("José")
```

representa igualdade de valor.

Não utilizar identidade de referência como regra de negócio.

Quando houver necessidade explícita de comparação, disponibilizar uma função pura, por exemplo:

```ts
Name.equals(nameA, nameB)
```

Criar `equals` apenas quando necessário.

## 17. Separação entre validação e construção

A validação deve ser uma função pura.

Fluxo:

```text
pré-condição estrutural
  ↓
validações independentes
  ↓
result.combine
  ↓
Result
```

A construção do Value Object ocorre somente após as invariantes terem sido satisfeitas.

Conceitualmente:

```text
input válido
    ↓
Value Object imutável
```

Nunca:

```text
input
  ↓
Value Object
  ↓
validação
```

porque isso permitiria a existência de Value Objects inválidos.

Não misturar acesso a banco, APIs ou outros efeitos externos à validação do Value Object.

## 18. Nenhum acesso à infraestrutura

Value Objects devem ser independentes de:

- banco de dados;
- HTTP;
- filesystem;
- Redis;
- filas;
- APIs externas;
- providers.

Um Value Object deve poder ser executado e testado isoladamente.

## 19. Exemplo: Value Object `Name`

Utilizar `Name` como exemplo de implementação para a skill.

O `Name` possui regras específicas de domínio.

A entrada deve conter somente caracteres alfabéticos e espaços simples.

### Caracteres permitidos

Permitir:

- letras;
- letras com acentuação;
- caracteres Unicode que sejam letras;
- um único espaço entre palavras.

Exemplos válidos:

```text
José
João
Márcio
André
João Pedro
José Honorio
Ana Júlia
Luís Felipe
Cecília
Gonçalves
```

Caracteres como:

```text
á à â ã ä
é è ê ë
í ì î ï
ó ò ô õ ö
ú ù û ü
ç
```

e outros caracteres Unicode que sejam efetivamente letras devem ser aceitos.

Não limitar a validação a ASCII:

```text
A-Z
a-z
```

## 20. Caracteres proibidos em `Name`

Não aceitar símbolos, pontuação ou números.

Exemplos inválidos:

```text
João-Silva
João_Silva
João.Silva
João, Silva
João/Silva
João@Silva
João#Silva
João! Silva
João2
123
João 2
```

Não permitir:

- hífen;
- underscore;
- ponto;
- vírgula;
- barra;
- arroba;
- símbolos;
- números;
- pontuação em geral.

## 21. Espaçamento em `Name`

Não permitir múltiplos espaços consecutivos.

Inválidos:

```text
João  Silva
José   Honorio
Ana     Paula
```

Também rejeitar espaços no início ou no final:

```text
" João"
"João "
" João "
```

O formato válido deve possuir exatamente um espaço entre palavras.

Exemplos:

```text
João
João Pedro
José Honorio
Ana Paula Silva
```

## 22. Capitalização em `Name`

A primeira letra de cada nome deve ser maiúscula.

Exemplos:

```text
João
Maria
José Honorio
Ana Paula
Carlos Eduardo
```

Inválidos:

```text
joão
maria
josé honório
ana Paula
```

Partículas e conectores comuns de nomes podem permanecer em minúsculo.

Exemplos válidos:

```text
João de Souza
Maria da Silva
Carlos do Carmo
Ana dos Santos
José das Graças
```

Partículas permitidas em minúsculo:

```text
de
da
do
das
dos
e
```

Não assumir que toda palavra curta deve ser minúscula.

Não utilizar `capitalize()` de forma ingênua em cada palavra.

Por exemplo, não transformar:

```text
João de Souza
```

em:

```text
João De Souza
```

## 23. Abreviações em `Name`

Não permitir abreviações.

Inválidos:

```text
J. Silva
J Silva
José H. Silva
J. H. Oliveira
A Silva
J Souza
M Oliveira
```

Uma palavra com apenas uma letra deve ser considerada inválida, salvo se uma regra explícita do domínio determinar o contrário.

No `Name`, a partícula `e` é a única exceção explícita de palavra com uma letra.

## 24. Normalização de `Name`

Não transformar silenciosamente uma entrada inválida em válida.

Não converter automaticamente:

```text
" joão  da  silva "
```

em:

```text
"João da Silva"
```

apenas para fazer a validação passar.

A entrada inválida deve gerar o erro correspondente.

Normalização somente pode existir quando fizer parte explícita da regra de domínio.

## 25. Unicode em `Name`

A validação deve tratar Unicode corretamente.

Não remover acentos.

Não converter caracteres Unicode para ASCII.

Não assumir que caracteres válidos pertencem somente ao intervalo ASCII.

Exemplos que devem poder ser aceitos:

```text
José
João
Ângela
Érico
Luísa
Gonçalves
Cássia
```

Verificar letras maiúsculas/minúsculas via propriedades Unicode:

```ts
/\p{L}/u   // letra
/\p{Lu}/u  // letra maiúscula
```

## 26. Implementação de referência do `Name`

`Name` é um Value Object compartilhado: representa o conceito de nome de pessoas e pode ser reutilizado por `users`, `customers`, `employees`, `suppliers`, etc.

Estrutura:

```text
src/modules/shared/value-object/name/
├── index.ts
├── name.ts
└── name.test.ts
```

Implementação de referência de `src/modules/shared/value-object/name/name.ts`:

```ts
import {
  result,
  type Result,
} from "@/src/modules/shared/result"

type Name = {
  readonly value: string
}

type NameErrorCode =
  | "NAME_INVALID_TYPE"
  | "NAME_REQUIRED"
  | "NAME_INVALID_FORMAT"
  | "NAME_INVALID_SPACING"
  | "NAME_INVALID_CAPITALIZATION"
  | "NAME_ABBREVIATION_NOT_ALLOWED"

type NameError = {
  readonly code: NameErrorCode
  readonly message: string
}

const NAME_PARTICLES: readonly string[] = [
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
]

const isLetter = (char: string): boolean => {
  return /\p{L}/u.test(char)
}

const hasInvalidFormat = (value: string): boolean => {
  return [...value].some((char) => !isLetter(char) && char !== " ")
}

const hasInvalidSpacing = (value: string): boolean => {
  if (value !== value.trim()) return true
  return /\s{2,}/.test(value)
}

const isParticle = (word: string): boolean => {
  return NAME_PARTICLES.includes(word)
}

const isAbbreviation = (word: string): boolean => {
  return word.length === 1 && !isParticle(word)
}

const hasInvalidCapitalization = (word: string): boolean => {
  if (word.length === 0) return false
  if (isParticle(word)) return false
  return !/\p{Lu}/u.test(word[0])
}

const validateRequired = (input: string): Result<string, NameError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "NAME_REQUIRED",
      message: "O nome é obrigatório.",
    })
  }

  return result.ok(input)
}

const validateSpacing = (input: string): Result<string, NameError> => {
  if (hasInvalidSpacing(input)) {
    return result.fail({
      code: "NAME_INVALID_SPACING",
      message: "O nome não pode possuir espaços consecutivos, iniciais ou finais.",
    })
  }

  return result.ok(input)
}

const validateFormat = (input: string): Result<string, NameError> => {
  if (hasInvalidFormat(input)) {
    return result.fail({
      code: "NAME_INVALID_FORMAT",
      message: "O nome deve conter somente letras e um único espaço entre palavras.",
    })
  }

  return result.ok(input)
}

const validateAbbreviation = (input: string): Result<string, NameError> => {
  if (input.split(" ").some(isAbbreviation)) {
    return result.fail({
      code: "NAME_ABBREVIATION_NOT_ALLOWED",
      message: "Abreviaturas não são permitidas.",
    })
  }

  return result.ok(input)
}

const validateCapitalization = (input: string): Result<string, NameError> => {
  if (input.split(" ").some(hasInvalidCapitalization)) {
    return result.fail({
      code: "NAME_INVALID_CAPITALIZATION",
      message: "Cada palavra deve iniciar com letra maiúscula, exceto partículas permitidas.",
    })
  }

  return result.ok(input)
}

const tryCreate = (input: unknown): Result<Name, NameError[]> => {
  if (typeof input !== "string") {
    return result.fail([
      {
        code: "NAME_INVALID_TYPE",
        message: "O nome deve ser uma string.",
      },
    ])
  }

  const validation = result.combine(
    validateRequired(input),
    validateSpacing(input),
    validateFormat(input),
    validateAbbreviation(input),
    validateCapitalization(input),
  )

  if (validation.fail) {
    return validation
  }

  return result.ok({ value: input })
}

const create = (value: string): Name => {
  const nameResult = tryCreate(value)

  if (nameResult.fail) {
    const codes = nameResult.error.map((error) => error.code).join(", ")
    throw new Error(`Pré-condição do Name violada: ${codes}.`)
  }

  return nameResult.value
}

const Name = {
  create,
  tryCreate,
}

export { Name }
export type { NameError }
```

Observações sobre a implementação:

- `create` SEMPRE garante as invariantes antes de produzir o `Name`; se a pré-condição for violada, lança exception (`throw`).
- `tryCreate` aceita `unknown`, valida estruturalmente o tipo e acumula erros de validações independentes com `result.combine`, retornando `Result<Name, NameError[]>`.
- Quando o input possui tipo inválido, `tryCreate` retorna imediatamente `NAME_INVALID_TYPE` sem executar as validações que dependem de string.
- As funções de validação são puras, independentes e não dependem de infraestrutura.
- A capitalização usa `\p{Lu}`, que cobre letras maiúsculas Unicode (`Ângela`, `Érico`, `Cecília`).
- Uma palavra de uma letra é rejeitada como abreviação, exceto partículas como `e`.
- Palavras vazias (originadas de espaços extras) não geram erros falsos de capitalização: o erro de espaçamento já cobre esses casos.
- Nenhum valor inválido é normalizado silenciosamente.
- O `Name` nunca existe em estado inválido.

## 27. Testabilidade

Todo Value Object deve possuir testes cobrindo:

- valores válidos;
- valores inválidos;
- limites;
- invariantes;
- códigos de erro;
- imutabilidade;
- Unicode quando aplicável;
- `create`;
- `tryCreate`.

Para `Name`, testar como válidos:

```text
José
João
José Honorio
João Pedro
Maria da Silva
José dos Santos
João de Souza
Carlos do Carmo
```

Como inválidos:

```text
""
" "
" João"
"João "
"João  Silva"
"joão"
"João silva"
"João-Silva"
"João_Silva"
"João.Silva"
"João2"
"J. Silva"
"J Silva"
"José H. Silva"
```

Testar também os caracteres Unicode:

```text
José
João
Márcio
Ângela
Luísa
Cecília
Gonçalves
```

Cada caso inválido deve também verificar o código de erro correspondente:

```text
NAME_INVALID_TYPE
NAME_REQUIRED
NAME_INVALID_FORMAT
NAME_INVALID_SPACING
NAME_INVALID_CAPITALIZATION
NAME_ABBREVIATION_NOT_ALLOWED
```

Testar também o acúmulo de erros de validações independentes:

```text
" joão  silva2"  →  [NAME_INVALID_SPACING, NAME_INVALID_FORMAT, NAME_INVALID_CAPITALIZATION]
```

Testar a falha estrutural de tipo com retorno imediato:

```text
123 → [NAME_INVALID_TYPE]
null → [NAME_INVALID_TYPE]
undefined → [NAME_INVALID_TYPE]
{} → [NAME_INVALID_TYPE]
```

Testar também `create`:

```ts
Name.create("José Silva") // → Name válido
Name.create("joão")       // → throw (pré-condição violada)
Name.create("")           // → throw
```

Verificar que o Value Object criado é imutável (`readonly value`) e que `tryCreate` sempre retorna `success`/`fail` explícitos, sem `null`, `undefined`, `false` ou `throw`.

A validação de erros acumulados deve verificar tanto a lista de códigos quanto a ordem deles.

Os testes devem utilizar o framework de testes do projeto. Se o projeto ainda não possuir um framework configurado, verificar com o usuário antes de adicionar um.

## 28. Localização

A localização de um Value Object depende do escopo do conceito, não do fato de uma entidade utilizá-lo.

### Value Object compartilhado

Quando o conceito possui significado de domínio reutilizável por múltiplos contextos, ele deve residir em:

```text
src/modules/shared/value-object/
```

Exemplo:

```text
src/modules/
├── shared/
│   ├── result/
│   └── value-object/
│       ├── name/
│       ├── email/
│       ├── phone/
│       └── ...
│
├── users/
├── customers/
└── orders/
```

Um Value Object compartilhado pode ser utilizado por diversos contextos:

```text
users
customers
employees
suppliers
orders
```

`Name` não pertence arquiteturalmente ao contexto `users` apenas porque `users` utiliza `Name`.

O local correto é:

```text
Name
↓
src/modules/shared/value-object/name/
```

e não:

```text
src/modules/users/name.ts
```

O contexto consumidor utiliza o Value Object, mas não é o proprietário arquitetural dele.

### Value Object específico de contexto

Se o Value Object representa um conceito exclusivo de um único contexto de negócio, ele deve permanecer dentro desse contexto:

```text
src/modules/orders/order-number/
src/modules/production/cutting-plan/
src/modules/production/furniture-dimensions/
```

### Decisão

Não mover um Value Object para `shared` porque é tecnicamente conveniente ou porque alguma entidade utiliza o conceito.

A pergunta deve ser:

> Esse conceito possui significado de domínio reutilizável por mais de um contexto?

Se sim:

```text
shared/value-object/
```

Se não:

```text
contexto específico
```

Resumo:

```text
conceito compartilhado
        ↓
src/modules/shared/value-object/

conceito específico
        ↓
src/modules/<context>/
```

### `shared` não é depósito genérico

`shared` não deve se transformar em um depósito para qualquer código.

Ele contém somente conceitos que realmente possuem escopo compartilhado entre diferentes contextos.

A regra global do projeto (`AGENTS.md`) estabelece que `shared` deve conter somente abstrações realmente compartilhadas e não deve ser utilizado como depósito genérico de código.

### Dependência

Colocar um Value Object em `shared` significa que ele não deve depender de um contexto específico.

Evitar:

```text
shared/value-object/name
        ↓
users
```

porque `shared` passaria a depender de `users`.

A direção correta é:

```text
users ──────────┐
customers ──────┼──→ shared/value-object/name
employees ──────┘
```

> Contextos podem depender de Value Objects compartilhados, mas um Value Object compartilhado não deve depender de um contexto de negócio específico.

## 29. Nomenclatura

Seguir as convenções de nomenclatura do projeto.

Arquivos devem utilizar `kebab-case`.

Exemplos:

```text
name.ts
email.ts
phone.ts
appointment-duration.ts
```

Um Value Object compartilhado fica em um diretório próprio dentro de `src/modules/shared/value-object/<nome>/`:

```text
src/modules/shared/value-object/name/
src/modules/shared/value-object/email/
src/modules/shared/value-object/phone/
```

Evitar nomes genéricos:

```text
value.ts
object.ts
generic-value.ts
utils.ts
```

quando o conceito puder ser identificado diretamente.

## 30. API pública

Todo Value Object compartilhado deve possuir um `index.ts` próprio, seguindo a regra de barrel exports do projeto.

Exemplo:

```text
src/modules/shared/value-object/name/
├── index.ts
├── name.ts
└── name.test.ts
```

Export (preferir exports explícitos e evitar `export *` quando contrariar as regras do projeto):

```ts
export { Name } from "./name"
export type { NameError } from "./name"
```

O consumo deve preferencialmente utilizar a API pública:

```ts
import { Name } from "@/src/modules/shared/value-object/name"
```

em vez de depender diretamente da implementação interna:

```ts
import { Name } from "@/src/modules/shared/value-object/name/name"
```

quando o `index.ts` já expuser o Value Object.

Sempre verificar se o `index.ts` do diretório do Value Object foi atualizado com os novos exports.

## 31. Regra para criação de um novo Value Object

Antes de criar um Value Object, identificar:

1. O conceito de domínio representado.
2. As invariantes.
3. Entradas válidas.
4. Entradas inválidas.
5. Códigos de erro.
6. Necessidade de `create`.
7. Necessidade de `tryCreate`.
8. O conceito é compartilhado por múltiplos contextos ou exclusivo de um contexto?
9. Localização resultante:
   - compartilhado → `src/modules/shared/value-object/`
   - específico → `src/modules/<context>/`
10. API pública.
11. Testes necessários.

Não criar um Value Object apenas para encapsular um `string` ou `number` sem possuir regras ou invariantes relevantes.

Não mover um Value Object para `shared` apenas por conveniência técnica: o conceito deve possuir significado reutilizável por mais de um contexto.

## 32. Regra para `create` e `tryCreate`

Manter uma distinção clara:

```text
create
  ↓
pré-condição válida
  ↓
Value Object
```

ou:

```text
create
  ↓
pré-condição violada
  ↓
throw
```

```text
tryCreate
  ↓
entrada potencialmente inválida (unknown)
  ↓
pré-condição estrutural
  ↓
tipo inválido → result.fail([erro estrutural]) imediatamente
  ↓
tipo válido → validações independentes
  ↓
result.combine(...)
  ↓
Result<ValueObject, Erros[]>
```

`tryCreate` deve obrigatoriamente utilizar o `result` compartilhado.

`create` deve obrigatoriamente garantir as invariantes; uma pré-condição violada em `create` é uma exceção verdadeira e deve usar `throw`.

Não utilizar exceptions, `null`, `undefined` ou `false` como retorno normal de `tryCreate`.

Acumular erros de validações independentes em `tryCreate`; não retornar apenas o primeiro erro.

## 33. Regra contra duplicação

Depois que um Value Object validar uma regra, outras camadas não devem repetir a mesma validação sem necessidade específica.

Exemplo:

Se:

```ts
Name.tryCreate()
```

garante as invariantes de `Name`, não duplicar as mesmas regras em:

```text
Controller
Use Case
Repository
```

O Value Object é responsável por suas próprias invariantes.

## 34. Fluxo de criação de um Value Object

Ao implementar um novo Value Object, seguir este fluxo:

```text
Identificar conceito de domínio
      ↓
Definir invariantes
      ↓
Listar entradas válidas
      ↓
Listar entradas inválidas
      ↓
Definir códigos de erro (incluindo erro estrutural de tipo)
      ↓
Escolher o contexto de negócio
      ↓
Definir o tipo imutável
      ↓
Implementar validações puras e independentes
      ↓
Implementar pré-condição estrutural (tipo) em tryCreate
      ↓
Combinar validações independentes (result.combine)
      ↓
Implementar create (garantindo invariantes) / tryCreate
      ↓
Agrupar no objeto funcional
      ↓
Atualizar índice público (index.ts)
      ↓
Escrever testes
      ↓
Verificar lint e typecheck
```

Antes de finalizar, verificar:

1. O arquivo está no local correto: `src/modules/shared/value-object/` (compartilhado) ou `src/modules/<context>/` (específico).
2. O nome está em `kebab-case`.
3. O tipo é imutável (`readonly`).
4. `tryCreate` usa o `result` compartilhado.
5. `tryCreate` aceita `unknown` e valida o tipo antes das demais validações.
6. `tryCreate` acumula erros com `result.combine` quando existem validações independentes.
7. `create` garante as invariantes e lança exception apenas quando a pré-condição é violada.
8. Os erros são específicos do domínio.
9. Não há acesso à infraestrutura.
10. O `index.ts` do diretório do Value Object foi atualizado.
11. Existem testes para os valores válidos, inválidos, limites, acúmulo de erros e tipo inválido.

## 35. Verificação final

Após criar o Value Object, rodar as checagens do projeto:

```bash
npm run lint
npx tsc --noEmit
```

e os comandos de teste existentes no projeto, quando presentes.

## 36. Princípio final

Todo Value Object deve seguir:

```text
Entrada
   ↓
Validação pura
   ↓
Invariantes do domínio
   ↓
create / tryCreate
   ↓
Value Object imutável (nunca inválido)
```

Quando a entrada puder ser inválida:

```text
tryCreate(unknown)
   ↓
pré-condição estrutural (tipo)
   ↓
tipo inválido → result.fail([erro estrutural]) imediatamente
   ↓
tipo válido → validações independentes
   ↓
result.combine(...)
   ↓
result.ok(...)   ou   result.fail([...erros...])
```

Quando a pré-condição de `create` for violada:

```text
create
   ↓
pré-condição violada
   ↓
throw
```

A arquitetura de erros deve seguir:

```text
Erro
  ↓
O que deu errado no domínio?
```

quando existirem validações independentes, a falha pode conter uma lista de erros:

```text
result.fail([erro1, erro2, ...])
```

`cause` e `metadata` seguem o modelo do `result` compartilhado.

O Value Object deve:

- proteger suas invariantes;
- nunca existir em estado inválido;
- ser imutável;
- ser funcional;
- ser fortemente tipado;
- não depender de infraestrutura;
- possuir erros específicos e identificáveis;
- ser facilmente testável;
- possuir `create` (garante invariantes; pré-condição violada → `throw`) e `tryCreate` (aceita `unknown`; acumula erros e retorna `Result`);
- utilizar o `result` compartilhado em `tryCreate`;
- não duplicar suas validações em outras camadas.

A skill deve sempre criar Value Objects de forma consistente com estas regras e com as demais convenções arquiteturais do projeto.
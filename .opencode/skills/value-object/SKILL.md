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

Essas operações possuem responsabilidades diferentes.

### `create`

Utilizar quando o código já possui garantia de que o valor atende às invariantes do Value Object ou quando a violação representar uma condição excepcional.

### `tryCreate`

Utilizar quando o valor vier de uma fonte potencialmente inválida ou quando a falha fizer parte do fluxo normal da aplicação.

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
result.fail(...)
```

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

`create` representa a construção de um Value Object assumindo uma pré-condição válida.

Exemplo:

```ts
const name = Name.create("José Honorio")
```

A entrada utilizada por `create` deve possuir garantia prévia de validade ou estar em um contexto onde uma violação represente uma condição excepcional.

Não utilizar `create` indiscriminadamente para processar entradas externas potencialmente inválidas.

Quando a validade não estiver garantida, utilizar `tryCreate`.

## 6. `tryCreate`

`tryCreate` é a porta de entrada segura para construir um Value Object a partir de um valor potencialmente inválido.

Seu retorno deve utilizar obrigatoriamente o `Result` compartilhado:

```ts
Result<ValueObject, Error>
```

ou um tipo equivalente utilizando a implementação oficial do projeto.

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
result.fail(error)
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

A importação deve seguir a convenção de barrel exports do projeto:

```ts
import {
  result,
  type Result,
} from "@/modules/shared/result"
```

Se o diretório `src/modules/shared/result/` ainda não possuir `index.ts`, importar diretamente:

```ts
import { result } from "@/modules/shared/result/result"
import type { Result } from "@/modules/shared/result/result"
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
NAME_REQUIRED
NAME_INVALID_FORMAT
NAME_INVALID_SPACING
NAME_INVALID_CAPITALIZATION
NAME_ABBREVIATION_NOT_ALLOWED
```

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
Result<Name, NameError>
Result<Email, EmailError>
Result<AppointmentDuration, AppointmentDurationError>
```

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
input
  ↓
validate
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

Estrutura:

```text
src/modules/users/
├── index.ts
├── name.ts
└── name.test.ts
```

Implementação de referência de `src/modules/users/name.ts`:

```ts
import {
  result,
  type Result,
} from "@/modules/shared/result"

type Name = {
  readonly value: string
}

type NameErrorCode =
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
  if (isParticle(word)) return false
  return !/\p{Lu}/u.test(word[0])
}

const validateName = (input: string): Result<Name, NameError> => {
  if (input.trim().length === 0) {
    return result.fail({
      code: "NAME_REQUIRED",
      message: "O nome é obrigatório.",
    })
  }

  if (hasInvalidSpacing(input)) {
    return result.fail({
      code: "NAME_INVALID_SPACING",
      message: "O nome não pode possuir espaços consecutivos, iniciais ou finais.",
    })
  }

  if (hasInvalidFormat(input)) {
    return result.fail({
      code: "NAME_INVALID_FORMAT",
      message: "O nome deve conter somente letras e um único espaço entre palavras.",
    })
  }

  const words = input.split(" ")

  if (words.some(isAbbreviation)) {
    return result.fail({
      code: "NAME_ABBREVIATION_NOT_ALLOWED",
      message: "Abreviaturas não são permitidas.",
    })
  }

  if (words.some(hasInvalidCapitalization)) {
    return result.fail({
      code: "NAME_INVALID_CAPITALIZATION",
      message: "Cada palavra deve iniciar com letra maiúscula, exceto partículas permitidas.",
    })
  }

  return result.ok({ value: input })
}

const create = (value: string): Name => {
  return { value }
}

const tryCreate = (input: string): Result<Name, NameError> => {
  return validateName(input)
}

const Name = {
  create,
  tryCreate,
}

export { Name }
export type { Name, NameError }
```

Observações sobre a implementação:

- `create` não valida: assume pré-condição válida ou contexto excepcional.
- `tryCreate` valida e retorna `Result<Name, NameError>`.
- As funções de validação são puras e não dependem de infraestrutura.
- A capitalização usa `\p{Lu}`, que cobre letras maiúsculas Unicode (`Ângela`, `Érico`, `Cecília`).
- Uma palavra de uma letra é rejeitada como abreviação, exceto partículas como `e`.
- Nenhum valor inválido é normalizado silenciosamente.

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
NAME_REQUIRED
NAME_INVALID_FORMAT
NAME_INVALID_SPACING
NAME_INVALID_CAPITALIZATION
NAME_ABBREVIATION_NOT_ALLOWED
```

Verificar que o Value Object criado é imutável (`readonly value`) e que `tryCreate` sempre retorna `success`/`fail` explícitos, sem `null`, `undefined`, `false` ou `throw`.

Os testes devem utilizar o framework de testes do projeto. Se o projeto ainda não possuir um framework configurado, verificar com o usuário antes de adicionar um.

## 28. Localização

O Value Object deve ser colocado no contexto de negócio ao qual pertence.

Exemplo:

```text
src/modules/users/
```

para um `Name` relacionado diretamente ao usuário.

Não colocar automaticamente todos os Value Objects em `shared`.

Um Value Object só deve estar em uma área compartilhada quando representar um conceito realmente compartilhado por múltiplos contextos.

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

Evitar nomes genéricos:

```text
value.ts
object.ts
generic-value.ts
utils.ts
```

quando o conceito puder ser identificado diretamente.

## 30. API pública

Quando o Value Object for consumido por outros arquivos, ele deve ser exportado pelo `index.ts` correspondente, seguindo a regra de barrel exports do projeto.

Exemplo:

```text
src/modules/users/
├── index.ts
└── name.ts
```

Export:

```ts
export { Name } from "./name"
export type { Name, NameError } from "./name"
```

O consumo deve preferencialmente utilizar a API pública:

```ts
import { Name } from "@/modules/users"
```

em vez de depender diretamente da implementação interna:

```ts
import { Name } from "@/modules/users/name"
```

quando o `index.ts` já expuser o Value Object.

Sempre verificar se o `index.ts` do contexto foi atualizado com os novos exports.

## 31. Regra para criação de um novo Value Object

Antes de criar um Value Object, identificar:

1. O conceito de domínio representado.
2. As invariantes.
3. Entradas válidas.
4. Entradas inválidas.
5. Códigos de erro.
6. Necessidade de `create`.
7. Necessidade de `tryCreate`.
8. Contexto de negócio responsável.
9. Necessidade de compartilhamento.
10. API pública.
11. Testes necessários.

Não criar um Value Object apenas para encapsular um `string` ou `number` sem possuir regras ou invariantes relevantes.

## 32. Regra para `create` e `tryCreate`

Manter uma distinção clara:

```text
create
  ↓
pré-condição válida
  ↓
Value Object
```

```text
tryCreate
  ↓
entrada potencialmente inválida
  ↓
Result
```

`tryCreate` deve obrigatoriamente utilizar o `result` compartilhado.

Não utilizar exceptions, `null`, `undefined` ou `false` para comunicar falhas esperadas.

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
Definir códigos de erro
      ↓
Escolher o contexto de negócio
      ↓
Definir o tipo imutável
      ↓
Implementar validação pura
      ↓
Implementar create / tryCreate
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

1. O arquivo está dentro de `src/modules/<context>/`.
2. O nome está em `kebab-case`.
3. O tipo é imutável (`readonly`).
4. `tryCreate` usa o `result` compartilhado.
5. Os erros são específicos do domínio.
6. Não há acesso à infraestrutura.
7. O `index.ts` do contexto foi atualizado.
8. Existem testes para os valores válidos, inválidos e limites.

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
Value Object imutável
```

Quando a entrada puder ser inválida:

```text
tryCreate
   ↓
result.ok(...)
   ou
result.fail(...)
```

A arquitetura de erros deve seguir:

```text
Erro
  ↓
O que deu errado no domínio?


cause
  ↓
Qual foi a causa original?


metadata
  ↓
Qual contexto adicional é útil?
```

O Value Object deve:

- proteger suas invariantes;
- ser imutável;
- ser funcional;
- ser fortemente tipado;
- não depender de infraestrutura;
- possuir erros específicos e identificáveis;
- ser facilmente testável;
- possuir `create` e `tryCreate`;
- utilizar o `result` compartilhado em `tryCreate`;
- não duplicar suas validações em outras camadas.

A skill deve sempre criar Value Objects de forma consistente com estas regras e com as demais convenções arquiteturais do projeto.
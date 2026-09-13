<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:folder-structure-and-naming -->
# Estrutura de Pastas e Nomenclatura de Arquivos

Este contexto define as regras de organização do código e nomenclatura de arquivos do projeto.
Agentes de IA devem seguir estas regras ao criar ou modificar código.

## Estrutura de módulos

Todo código de regras de negócio deve ficar dentro de `src/modules/`.

Cada contexto de negócio possui seu próprio diretório:

```text
src/modules/<context>/
```

Exemplos:

```text
src/modules/users/
src/modules/appointments/
src/modules/services/
src/modules/notifications/
src/modules/financial/
```

Um `<context>` representa uma área de negócio do sistema.
Todo código deve ser colocado no contexto ao qual pertence.

**Não criar** estrutura global organizada apenas por tipo técnico:

```text
src/entities/         # ERRADO
src/repositories/     # ERRADO
src/usecases/         # ERRADO
src/services/         # ERRADO
src/controllers/      # ERRADO
```

**Prefira**:

```text
src/modules/users/user.entity.ts
src/modules/users/user.repository.ts
src/modules/users/usecase/create-user.ts
```

## Estrutura interna do contexto

Cada contexto pode possuir subdiretórios quando isso ajudar a organizar responsabilidades:

```text
src/modules/users/
├── usecase/
├── user.entity.ts
├── user.repository.ts
├── user.provider.ts
└── user.mapper.ts
```

Não criar subpastas apenas por organização estética.
Criar uma pasta somente quando representar uma separação real de responsabilidade ou quando houver quantidade suficiente de arquivos que justifique a organização.

## Casos de uso

Os casos de uso devem ficar dentro de `src/modules/<context>/usecase/`.

Cada arquivo dentro de `usecase/` representa uma ação específica do sistema:

```text
src/modules/users/usecase/create-user.ts
src/modules/users/usecase/update-user.ts
src/modules/users/usecase/delete-user.ts
src/modules/users/usecase/list-users.ts
```

### Regra importante

Não utilizar `.usecase.ts` nos arquivos que já estão dentro da pasta `usecase/`.

Correto: `src/modules/users/usecase/create-user.ts`
Incorreto: `src/modules/users/usecase/create-user.usecase.ts`

A pasta `usecase/` já identifica a responsabilidade do arquivo.

## Nomenclatura

Todos os nomes de arquivos e diretórios devem utilizar `kebab-case`.

Correto: `create-user.ts`, `send-message.ts`, `check-available-time.ts`
Incorreto: `createUser.ts`, `CreateUser.ts`, `create_user.ts`, `CREATE_USER.ts`

Evite nomes genéricos como `utils.ts`, `helper.ts`, `common.ts`, `manager.ts`, `handler.ts`, `service.ts` quando for possível utilizar um nome que descreva claramente a responsabilidade.

## Sufixos de responsabilidade

Formato: `<name>.<responsibility>.ts`

```text
user.entity.ts
user.repository.ts
user.provider.ts
user.mapper.ts
user.controller.ts
user.schema.ts
user.dto.ts
```

O sufixo deve representar a responsabilidade real do arquivo.
Não utilizar sufixos apenas por convenção quando não representarem uma responsabilidade existente.

### Entidades

`<name>.entity.ts` — Exemplos: `user.entity.ts`, `appointment.entity.ts`, `financial-entry.entity.ts`

### Repositórios

`<name>.repository.ts` — Exemplos: `user.repository.ts`, `appointment.repository.ts`

### Providers

`<name>.provider.ts` — Exemplos: `whatsapp.provider.ts`, `email.provider.ts`, `payment.provider.ts`

### Controllers

`<name>.controller.ts` — Exemplos: `user.controller.ts`, `appointment.controller.ts`

Controllers não devem ser utilizados para concentrar regras de negócio.

### Mappers

`<name>.mapper.ts` — Exemplos: `user.mapper.ts`, `appointment-response.mapper.ts`

### Schemas

`<name>.schema.ts` — Exemplos: `create-user.schema.ts`, `update-user.schema.ts`

### DTOs

`<name>.dto.ts` — Exemplos: `create-user.dto.ts`, `appointment-response.dto.ts`

## Funcionalidades

Quando o arquivo representar uma funcionalidade ou ação específica, o nome deve descrever essa ação em `kebab-case`:

```text
send-message.ts
create-appointment.ts
cancel-appointment.ts
calculate-appointment-price.ts
check-available-time.ts
```

## Regra para novos arquivos

Antes de criar um novo arquivo:

1. Identificar o contexto de negócio ao qual o código pertence.
2. Colocar o código dentro de `src/modules/<context>/`.
3. Identificar a responsabilidade do arquivo.
4. Verificar se já existe um arquivo com a mesma responsabilidade.
5. Escolher um nome descritivo em `kebab-case`.
6. Utilizar o sufixo apropriado quando possuir responsabilidade arquitetural específica.
7. Verificar se a criação de uma nova pasta é realmente necessária.
8. Seguir as convenções existentes no contexto.

Não criar arquivos duplicados ou estruturas paralelas para resolver o mesmo problema.

## Regra para novos contextos

Um novo contexto deve ser criado somente quando existir uma área de negócio claramente separada.
Não criar contextos excessivamente pequenos apenas para separar arquivos tecnicamente.
O contexto deve representar uma responsabilidade de negócio, não uma tecnologia ou tipo de arquivo.

## Regra de localização

Ao implementar uma nova funcionalidade:

1. Qual é o contexto de negócio?
2. Qual é a responsabilidade do arquivo?
3. Qual é o caminho e o nome do arquivo?

Exemplo: enviar mensagem de notificação pertence ao contexto `notifications`:

```text
src/modules/notifications/usecase/send-message.ts
src/modules/notifications/whatsapp.provider.ts
```

## Regra de consistência

Ao criar código novo, seguir estas convenções mesmo que existam arquivos antigos com nomenclatura diferente.
Não espalhar inconsistências existentes para código novo.
Não realizar refatoração de arquivos existentes para aplicar estas regras, a menos que solicitado.

## Regra contra abstrações artificiais

Não criar:

- Pastas vazias.
- Arquivos genéricos.
- Camadas sem responsabilidade real.
- Abstrações apenas para seguir um padrão.
- Interfaces desnecessárias.
- Providers desnecessários.
- Services genéricos apenas para encapsular uma função pequena.

A estrutura deve refletir o domínio e as responsabilidades reais do sistema.

## Regra final

A estrutura de arquivos deve permitir que um desenvolvedor descubra rapidamente:

1. A qual contexto de negócio o código pertence.
2. Qual é a responsabilidade daquele arquivo.
3. Onde encontrar os casos de uso daquele contexto.
4. Onde encontrar entidades, repositórios, providers, controllers, mappers e demais componentes.

Priorizar: **Contexto de negócio → Responsabilidade → Nome descritivo**

A estrutura deve ser previsível, consistente, simples e preparada para o crescimento do projeto.
<!-- END:folder-structure-and-naming -->

<!-- BEGIN:coding-rules -->
# Regras de Codificação

Este contexto define as regras de codificação do projeto.
Agentes de IA devem seguir estas regras ao criar ou modificar código.

O projeto adota **programação funcional como paradigma principal**.

Decisões de implementação devem priorizar:

- funções puras;
- imutabilidade;
- composição;
- tipagem forte;
- dados como valores;
- efeitos colaterais isolados;
- tratamento explícito de erros;
- baixo acoplamento;
- código previsível e testável.

Classes não devem ser utilizadas como padrão de implementação.
Elas só devem existir quando houver uma necessidade técnica clara ou quando forem exigidas por uma biblioteca ou framework.

## 1. Programação funcional

Todo código novo deve seguir programação funcional por padrão.

Preferir funções:

```ts
const calculateTotal = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.price, 0)
}
```

em vez de criar classes apenas para encapsular funções.

Não criar classes somente por tradição arquitetural.

Classes podem ser utilizadas quando:

- uma biblioteca exigir;
- um framework exigir;
- houver estado interno realmente necessário;
- houver uma necessidade técnica clara;
- uma API externa possuir uma interface obrigatoriamente orientada a objetos.

## 2. Imutabilidade

Priorizar estruturas imutáveis.

Não modificar objetos ou arrays recebidos como argumentos.

Evitar:

```ts
user.name = "John"
items.push(item)
```

Preferir:

```ts
const updatedUser = {
  ...user,
  name: "John",
}

const updatedItems = [
  ...items,
  item,
]
```

Quando apropriado, utilizar `readonly` e estruturas imutáveis do TypeScript.

## 3. Funções puras

Funções puras devem ser utilizadas sempre que possível.

Uma função pura deve:

- produzir o mesmo resultado para a mesma entrada;
- não alterar estado externo;
- não depender de efeitos colaterais ocultos.

Quando uma função depender de informação externa, preferir recebê-la explicitamente através dos argumentos.

Evitar dependências ocultas como:

- estado global mutável;
- variáveis globais;
- `Date.now()`;
- `Math.random()`;
- environment variables;
- singletons mutáveis.

## 4. Separação entre lógica pura e efeitos colaterais

Efeitos colaterais devem permanecer isolados sempre que possível.

Exemplos:

```text
Database
HTTP
Filesystem
External APIs
Queues
Messaging
Current Date/Time
Randomness
Environment
Cache
```

Preferir uma arquitetura onde:

```text
efeito externo
      ↓
dados
      ↓
função pura
      ↓
resultado
```

em vez de misturar regras de negócio com acesso externo dentro da mesma função.

## 5. Result

O projeto deve utilizar um `Result` funcional para representar explicitamente operações que podem produzir **sucesso ou falha previsível**.

O `Result` é uma abstração transversal e deve ser utilizado de forma consistente em toda a aplicação.

### 5.1 Separação entre tipo e objeto funcional

Existem dois conceitos distintos:

**Tipo:** `Result` representa o tipo.

```ts
Result<User, UserError>
Result<Appointment, AppointmentError>
```

**Objeto funcional:** `result` representa um objeto literal que agrupa funções puras relacionadas ao tipo.

```ts
result.ok(...)
result.fail(...)
result.try(...)
result.tryAsync(...)
result.combine(...)
```

A diferença de capitalização deve ser mantida em todo o projeto:

```text
Result = tipo
result = objeto funcional
```

Não criar uma classe `Result`.
Não utilizar `result` para armazenar estado mutável.
O objeto `result` funciona apenas como um namespace funcional para funções puras.

## 6. Localização do Result

O `Result` é uma abstração compartilhada e não pertence a um contexto específico de negócio.

Sua implementação deve ficar em:

```text
src/modules/shared/result/
```

Estrutura:

```text
src/modules/
└── shared/
    └── result/
        ├── result.ts
        └── result-error.ts
```

Não colocar o `Result` dentro de módulos específicos como:

```text
src/modules/users/
src/modules/appointments/
src/modules/services/
src/modules/notifications/
```

O diretório `shared` deve conter somente abstrações realmente compartilhadas por diferentes contextos.
Não utilizar `shared` como depósito genérico de código.

## 7. Tipo Result

O `Result` deve representar exatamente dois estados:

```text
Success
Failure
```

Cada estado deve possuir obrigatoriamente duas propriedades booleanas explícitas:

```text
success
fail
```

Essas propriedades devem ser complementares e mutuamente exclusivas.

Estado de sucesso:

```ts
{
  readonly success: true
  readonly fail: false
  readonly value: T
}
```

Estado de falha:

```ts
{
  readonly success: false
  readonly fail: true
  readonly error: E
}
```

Essas propriedades existem para permitir verificações explícitas e evitar negações desnecessárias.

Preferir:

```ts
if (result.fail) {
  return result.error
}
```

em vez de:

```ts
if (!result.success) {
  return result.error
}
```

Preferir:

```ts
if (result.success) {
  return result.value
}
```

em vez de:

```ts
if (!result.fail) {
  return result.value
}
```

O tipo deve utilizar uma união discriminada ou mecanismo equivalente que permita narrowing seguro pelo TypeScript.

Estrutura conceitual:

```ts
type Result<T, E> =
  | {
      readonly success: true
      readonly fail: false
      readonly value: T
    }
  | {
      readonly success: false
      readonly fail: true
      readonly error: E
    }
```

A implementação deve garantir que somente esses dois estados possam existir.

Nunca permitir:

```ts
{
  success: true,
  fail: true,
}
```

ou:

```ts
{
  success: false,
  fail: false,
}
```

## 8. Objeto funcional `result`

O objeto funcional `result` deve agrupar as funções relacionadas ao tipo `Result`.

Estrutura conceitual:

```ts
const result = {
  ok,
  fail,
  try,
  tryAsync,
  combine,
}
```

O objeto `result`:

- não deve possuir estado mutável;
- não deve utilizar `this`;
- não deve possuir construtor;
- não deve possuir herança;
- não deve possuir ciclo de vida;
- deve apenas agrupar funções.

O uso esperado é:

```ts
result.ok(...)
result.fail(...)
result.try(...)
result.tryAsync(...)
result.combine(...)
```

## 9. API do `result`

A API funcional mínima e oficial deve possuir:

```ts
result.ok(...)
result.fail(...)
result.try(...)
result.tryAsync(...)
result.combine(...)
```

Funções adicionais como:

```text
map
flatMap
mapError
match
```

podem ser adicionadas quando houver necessidade real de composição funcional.
Não adicionar funções apenas para aumentar a API.

## 10. `result.ok`

`result.ok` deve criar um resultado de sucesso.

Exemplo:

```ts
return result.ok(user)
```

Resultado:

```ts
{
  success: true,
  fail: false,
  value: user,
}
```

A função deve ser pura, imutável e preservar o tipo do valor.

## 11. `result.fail`

`result.fail` deve criar um resultado de falha.

Exemplo:

```ts
return result.fail(error)
```

Resultado:

```ts
{
  success: false,
  fail: true,
  error,
}
```

A função deve aceitar opções adicionais:

```ts
result.fail(error, {
  cause,
  metadata,
})
```

Preferir objeto de opções em vez de múltiplos parâmetros posicionais.

### `cause`

`cause` representa a causa original de uma falha.
Deve ser preservada quando relevante, especialmente em erros provenientes de:

- banco de dados;
- providers;
- APIs externas;
- bibliotecas;
- filesystem;
- infraestrutura;
- exceptions convertidas para `Result`.

Não descartar a causa original sem necessidade.
A causa técnica não deve ser exposta automaticamente ao cliente final.

### `metadata`

`metadata` representa dados estruturados adicionais relacionados ao erro.

Exemplo:

```ts
result.fail(error, {
  metadata: {
    userId,
    appointmentId,
    provider: "whatsapp",
  },
})
```

Utilizar `metadata` para:

- diagnóstico;
- observabilidade;
- logging;
- tracing;
- debugging;
- tratamento específico.

Os metadados devem ser imutáveis.
Não utilizar `metadata` para substituir propriedades que deveriam pertencer ao próprio tipo do erro.
Não armazenar informações sensíveis desnecessariamente.

## 12. ResultError

Quando for necessário um erro compartilhado e estruturado, utilizar `ResultError`.

Localização:

```text
src/modules/shared/result/result-error.ts
```

`ResultError` deve ser um tipo ou estrutura de dados funcional e imutável.
Não criar uma hierarquia extensa de classes de erro.

Estrutura conceitual:

```ts
type ResultError = {
  readonly code: string
  readonly message: string
  readonly cause?: unknown
  readonly metadata?: Readonly<Record<string, unknown>>
}
```

O uso de `ResultError` não é obrigatório para todos os resultados.
O tipo `Result` deve continuar genérico:

```ts
Result<T, E>
```

permitindo erros específicos por contexto.

Exemplos:

```ts
Result<User, UserError>
Result<Appointment, AppointmentError>
Result<void, NotificationError>
```

## 13. Códigos de erro

Quando um erro precisar ser identificado programaticamente, utilizar códigos estáveis.

Exemplos:

```text
USER_NOT_FOUND
EMAIL_ALREADY_EXISTS
APPOINTMENT_CONFLICT
APPOINTMENT_NOT_AVAILABLE
EMPLOYEE_NOT_AVAILABLE
SERVICE_NOT_AVAILABLE
INVALID_APPOINTMENT_TIME
```

Não utilizar mensagens como identificadores.

Preferir:

```ts
if (error.code === "USER_NOT_FOUND") {
  ...
}
```

A mensagem descreve o erro.
O código identifica o erro.

## 14. `result.try`

`result.try` deve executar uma função síncrona e converter exceptions em `Result.fail`.

Exemplo:

```ts
const parsed = result.try(() => {
  return JSON.parse(value)
})
```

Comportamento:

```text
função executada com sucesso
        ↓
result.ok(value)
```

```text
função lança exception
        ↓
result.fail(...)
```

Quando apropriado, preservar a exception original como `cause`.

Não utilizar `try/catch` manualmente somente para converter uma exception em `Result` quando `result.try` for suficiente.

## 15. `result.tryAsync`

`result.tryAsync` deve executar uma operação assíncrona e converter rejeições ou exceptions em `Result.fail`.

Exemplo:

```ts
const user = await result.tryAsync(async () => {
  return await repository.findById(id)
})
```

Comportamento:

```text
Promise resolvida
      ↓
result.ok(value)
```

```text
Promise rejeitada
      ↓
result.fail(...)
```

```text
throw dentro da função async
      ↓
result.fail(...)
```

Quando apropriado, preservar a causa original como `cause`.

A assinatura conceitual deve ser equivalente a:

```ts
result.try<T>(
  fn: () => T
): Result<T, E>
```

```ts
result.tryAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, E>>
```

`tryAsync` deve retornar:

```text
Promise<Result<T, E>>
```

e não:

```text
Result<Promise<T>, E>
```

## 16. `result.combine`

`result.combine` deve combinar múltiplos `Result` em uma única operação funcional.

Seu objetivo é combinar **operações independentes**.

Exemplo:

```ts
const validation = result.combine(
  validateName(),
  validateEmail(),
  validatePhone(),
)
```

### Entrada

`result.combine` deve aceitar um ou mais `Result`.
Os resultados podem possuir valores de tipos diferentes, desde que os tipos sejam preservados.

### Quando todos forem sucesso

Quando todos os `Result` forem `success`, `combine` deve retornar `result.ok(...)`.
Os valores devem ser preservados na mesma ordem dos argumentos.

Exemplo:

```ts
const name = result.ok("John")
const age = result.ok(30)
const active = result.ok(true)

const combined = result.combine(
  name,
  age,
  active,
)
```

Resultado conceitual:

```ts
{
  success: true,
  fail: false,
  value: ["John", 30, true],
}
```

Sempre que possível, preservar os tipos utilizando tuplas.

Conceitualmente:

```ts
Result<[string, number, boolean], ...>
```

### Quando existir uma ou mais falhas

Quando um ou mais `Result` forem `fail`, `combine` deve retornar `result.fail(...)`.
Todos os erros dos resultados que falharam devem ser preservados.

Exemplo:

```ts
const name = result.fail(nameError)
const age = result.ok(30)
const phone = result.fail(phoneError)

const combined = result.combine(
  name,
  age,
  phone,
)
```

Resultado conceitual:

```ts
{
  success: false,
  fail: true,
  error: [
    nameError,
    phoneError,
  ],
}
```

Somente os erros dos resultados que falharam devem ser incluídos.

### Ordem dos erros

Os erros devem preservar a ordem dos `Result` de origem.

Exemplo:

```ts
result.combine(
  result.fail(errorA),
  result.ok(valueB),
  result.fail(errorC),
  result.fail(errorD),
)
```

deve produzir:

```ts
[
  errorA,
  errorC,
  errorD,
]
```

Não reordenar nem deduplicar erros automaticamente.

### Cause e metadata

Os erros acumulados devem preservar suas respectivas informações de `cause` e `metadata`.
`combine` não deve destruir ou substituir essas informações.

### Quando utilizar

Utilizar `combine` quando as operações forem independentes.

Exemplo:

```ts
result.combine(
  validateName(input),
  validateEmail(input),
  validatePhone(input),
)
```

### Quando não utilizar

Não utilizar `combine` quando uma operação depender do resultado de outra.

Exemplo:

```text
buscar usuário
      ↓
obter permissões do usuário
      ↓
validar permissões
```

Nesse caso, utilizar composição sequencial com:

```text
result.flatMap(...)
```

ou mecanismo funcional equivalente.

A regra é:

```text
Operações independentes
        ↓
result.combine(...)

Operações dependentes
        ↓
result.flatMap(...) / composição sequencial
```

`result.combine` deve ser:

- funcional;
- determinístico;
- imutável;
- sem efeitos colaterais;
- sem descarte silencioso de erros.

Não utilizar `combine` para executar efeitos colaterais. Ele deve combinar resultados já produzidos.

## 17. Erros previsíveis e exceptions

Erros previsíveis de negócio devem utilizar `result.fail`.

Exemplos:

```text
USER_NOT_FOUND
EMAIL_ALREADY_EXISTS
APPOINTMENT_CONFLICT
APPOINTMENT_NOT_AVAILABLE
SERVICE_NOT_AVAILABLE
EMPLOYEE_NOT_AVAILABLE
INVALID_APPOINTMENT_TIME
```

Não utilizar exceptions para representar condições normais e previsíveis do domínio.
Exceptions devem representar situações excepcionais, bugs ou falhas inesperadas.

Quando uma exception precisar entrar no fluxo funcional, utilizar:

```text
result.try
```

ou:

```text
result.tryAsync
```

## 18. Propagação de Result

Quando uma função chamar outra função que retorna `Result`, o resultado deve ser tratado explicitamente.

Não descartar falhas.

O fluxo deve permanecer explícito:

```text
Repository
    ↓
Result
    ↓
Use Case
    ↓
Result
```

A camada superior deve:

- propagar;
- transformar;
- ou tratar a falha.

Nunca ignorá-la silenciosamente.

## 19. Use Cases

Casos de uso devem preferencialmente ser funções.

Exemplo:

```ts
const createAppointment = async (
  input: CreateAppointmentInput,
): Promise<Result<Appointment, AppointmentError>> => {
  // ...
}
```

Evitar criar uma classe somente para conter um método `execute`.

O caso de uso deve coordenar:

```text
Input
  ↓
Validações
  ↓
Regras de negócio
  ↓
Efeitos externos
  ↓
Result
```

Quando houver etapas independentes de validação, utilizar `result.combine`.
Quando houver etapas dependentes, utilizar composição sequencial como `flatMap`.

## 20. Validações

Validações puras devem permanecer separadas de efeitos externos.

Exemplo:

```ts
const validateAppointmentInput = (
  input: AppointmentInput,
): Result<void, AppointmentError> => {
  // ...
}
```

Validações puramente estruturais não devem acessar banco de dados.

Quando uma regra depender de informação externa:

```text
consulta externa
      ↓
dados
      ↓
função pura
      ↓
Result
```

## 21. Repositories e Providers

Repositories e providers representam integração com efeitos externos.

Eles podem retornar `Result` quando existirem falhas esperadas que precisem ser comunicadas à camada de aplicação.

Erros específicos de bibliotecas ou infraestrutura devem ser convertidos antes de chegarem às regras de negócio quando necessário.

## 22. Isolamento de infraestrutura

Regras de negócio não devem depender diretamente de detalhes de infraestrutura.

Evitar verificar tipos específicos de bibliotecas externas dentro do domínio.

Preferir:

```text
Infrastructure Error
       ↓
Infrastructure
       ↓
ResultError / erro contextual
       ↓
Application
```

## 23. Tipagem forte

Não utilizar `any` para contornar problemas de tipagem.
Evitar casts desnecessários.

O `Result` deve permitir narrowing seguro utilizando `success` e `fail`.

Preferir:

```ts
if (result.fail) {
  return result.error
}

return result.value
```

ou:

```ts
if (result.success) {
  return result.value
}

return result.error
```

Evitar negações desnecessárias:

```ts
if (!result.success)
if (!result.fail)
```

quando a propriedade complementar estiver disponível.

## 24. Estado e dependências

Funções devem receber explicitamente os valores dos quais dependem.

Preferir:

```ts
calculatePrice(input, configuration)
```

em vez de depender de estado global oculto.

Evitar singletons mutáveis e estado global sem necessidade real.

## 25. Não esconder efeitos colaterais

Funções que possuem efeitos colaterais devem deixar isso claro através de sua responsabilidade e localização.

Não esconder operações de banco, HTTP, filas ou APIs externas dentro de funções que aparentam ser puras.

## 26. Funções pequenas e composáveis

Preferir funções com uma responsabilidade clara.

Quando uma função acumular responsabilidades independentes, dividir em funções menores e composáveis.

Não fragmentar artificialmente funções simples apenas para seguir uma regra.

## 27. Abstrações

Não criar abstrações funcionais sem necessidade.

Evitar abstrações genéricas sem responsabilidade real.

Criar abstrações quando elas:

- reduzirem acoplamento;
- melhorarem composição;
- representarem um conceito real;
- eliminarem duplicação relevante;
- melhorarem testabilidade;
- resolverem uma necessidade arquitetural concreta.

## 28. Processo para implementação

Antes de implementar uma nova funcionalidade, analisar:

1. A lógica pode ser uma função pura?
2. Existe estado mutável desnecessário?
3. Existe dependência oculta?
4. Existe efeito colateral misturado à lógica?
5. Existe uma falha previsível?
6. Essa falha deve ser representada por `result.fail`?
7. Preciso de `result.try`?
8. Preciso de `result.tryAsync`?
9. Existem múltiplos `Result` independentes que devem ser combinados?
10. Existem operações dependentes que exigem composição sequencial?
11. Os erros independentes devem ser acumulados?
12. Existe implementação existente que pode ser reutilizada?
13. Estou criando uma abstração sem necessidade?

## 29. Boundary da aplicação

O `Result` pode ser utilizado livremente nas camadas internas.

A camada de entrada deve transformar o resultado no protocolo correspondente.

Exemplo:

```text
Use Case
   ↓
Result
   ↓
Controller
   ↓
HTTP Response
```

Não expor automaticamente para o cliente:

```text
cause
metadata interno
stack trace
detalhes de infraestrutura
```

A interface externa deve decidir quais informações são públicas.

## 30. Logs e observabilidade

`cause` e `metadata` podem ser utilizados para observabilidade.

Nunca registrar desnecessariamente:

- senhas;
- tokens;
- credenciais;
- segredos;
- dados sensíveis.

## 31. Consistência

Todo código novo deve utilizar a estratégia de tratamento de erros definida neste contexto.

Não criar:

- outro tipo `Result`;
- outro objeto para representar sucesso/falha;
- outra implementação paralela de `try`;
- outra implementação paralela de `tryAsync`;
- outro `combine`;
- outro formato incompatível de erro.

A implementação oficial está em:

```text
src/modules/shared/result/
```

## 32. Princípio geral

O padrão de codificação deste projeto deve seguir:

```text
Programação funcional
        +
Imutabilidade
        +
Funções puras
        +
Composição
        +
Tipagem forte
        +
Efeitos colaterais isolados
        +
Result para falhas previsíveis
```

A separação conceitual deve permanecer:

```text
Result<T, E>
    = tipo

result
    = objeto literal funcional
```

Estrutura:

```text
src/modules/shared/result/
├── result.ts
└── result-error.ts
```

API oficial:

```ts
result.ok(...)
result.fail(error, {
  cause?,
  metadata?,
})
result.try(...)
await result.tryAsync(...)
result.combine(...)
```

Estados:

```text
Success
├── success: true
├── fail: false
└── value

Failure
├── success: false
├── fail: true
└── error
```

O objetivo é produzir código previsível, composável, fortemente tipado, imutável, testável, seguro e fácil de manter.

## 33. Barrel exports e `index.ts`

Diretórios que representarem uma **API pública ou uma unidade reutilizável do sistema** devem possuir um `index.ts` responsável por centralizar seus exports públicos.

O `index.ts` deve funcionar como a **fronteira pública do diretório**, evitando que consumidores dependam diretamente da estrutura interna de arquivos.

Exemplo:

```text
src/modules/users/
├── index.ts
├── user.entity.ts
├── user.repository.ts
├── user.mapper.ts
└── usecase/
    ├── index.ts
    ├── create-user.ts
    └── update-user.ts
```

O `src/modules/users/index.ts` deve expor somente a API pública do contexto.

Exemplo:

```ts
export { createUser, updateUser } from "./usecase"
export { userRepository } from "./user.repository"
export type { User } from "./user.entity"
```

### Subdiretórios públicos

Quando um subdiretório possuir uma API própria consumida externamente, ele também deve possuir seu próprio `index.ts`.

Exemplo:

```text
src/modules/users/usecase/
├── index.ts
├── create-user.ts
└── update-user.ts
```

```ts
export { createUser } from "./create-user"
export { updateUser } from "./update-user"
```

### Imports

Quando existir um `index.ts` que exponha determinada funcionalidade, preferir importar através desse ponto de entrada em vez de realizar deep imports.

Preferir:

```ts
import {
  createUser,
  updateUser,
} from "@/modules/users"
```

em vez de:

```ts
import { createUser } from "@/modules/users/usecase/create-user"
```

quando `createUser` fizer parte da API pública de `users`.

Dentro do próprio contexto, imports diretos de arquivos internos são permitidos quando isso fizer sentido.

### Exports explícitos

Preferir exports explícitos:

```ts
export { createUser } from "./create-user"
export type { CreateUserInput } from "./create-user"
```

Evitar `export *` indiscriminadamente.

O objetivo é evitar:

- exposição acidental de APIs internas;
- colisões de nomes;
- dificuldade para rastrear exports;
- acoplamento desnecessário.

### Tipos

Quando um tipo fizer parte da API pública, exportá-lo pelo `index.ts`.

Utilizar `export type` quando a exportação for exclusivamente de tipos.

Exemplo:

```ts
export type { User } from "./user.entity"
export type { CreateUserInput } from "./usecase/create-user"
```

### Shared

A regra também deve ser aplicada aos módulos compartilhados.

Exemplo:

```text
src/modules/shared/result/
├── index.ts
├── result.ts
└── result-error.ts
```

O consumo preferencial deve ser:

```ts
import {
  result,
  type Result,
  type ResultError,
} from "@/modules/shared/result"
```

em vez de depender diretamente de:

```ts
import { result } from "@/modules/shared/result/result"
```

### Atualização dos index.ts

Sempre que um arquivo passar a fazer parte da API pública de um diretório:

1. Verificar o `index.ts` correspondente.
2. Adicionar o export necessário.
3. Manter os exports organizados e explícitos.

Nunca criar uma funcionalidade pública e esquecer de adicioná-la ao ponto de entrada do contexto.

### Novos diretórios

Quando um novo diretório representar uma unidade pública/reutilizável, criar seu `index.ts` desde o início.

Exemplo:

```text
src/modules/notifications/
├── index.ts
├── notification.provider.ts
└── usecase/
    ├── index.ts
    └── send-message.ts
```

### Exceção

Não é obrigatório criar `index.ts` em toda pasta.

Pastas exclusivamente internas, utilizadas por uma única implementação e que não representam uma API pública reutilizável não necessitam de `index.ts`.

Exemplo de pasta que dispensa `index.ts`:

```text
src/modules/users/usecase/
├── create-user.ts
└── update-user.ts
```

Criar `index.ts` apenas quando o diretório representar uma fronteira pública real.
<!-- END:coding-rules -->

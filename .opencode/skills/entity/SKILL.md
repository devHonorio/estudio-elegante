---
name: entity
description: Cria, estrutura ou modifica entidades de domínio em TypeScript segundo os bounded contexts, a linguagem ubíqua, a programação funcional e as convenções arquiteturais do projeto. Use quando a tarefa envolver entidade, aggregate entity, identidade de domínio, invariantes, comportamentos ou reconstituição de um modelo com identidade própria.
---

# Entidade de domínio

Crie e modifique entidades a partir do significado do negócio dentro de um bounded context. Preserve identidade ao longo do tempo, invariantes, linguagem ubíqua, imutabilidade, programação funcional e isolamento de efeitos externos.

Antes de agir, leia o `AGENTS.md` aplicável ao diretório de destino e inspecione o contexto existente. Use `src/modules/identity/` como referência de organização e estilo, sem transformar decisões específicas de autenticação em regras universais.

Quando a tarefa também exigir criar ou modificar um Value Object, leia integralmente a skill canônica [`../value-object/SKILL.md`](../value-object/SKILL.md) e aplique suas regras ao VO. Não recrie validação, geração ou infraestrutura já fornecida por um Value Object existente.

## 1. Entidade, identidade e ciclo de vida

Uma entidade representa um conceito do domínio que:

- possui identidade própria e estável;
- continua sendo a mesma apesar da alteração de atributos;
- protege invariantes durante todo o ciclo de vida;
- possui estados e comportamentos com significado para o negócio.

Não criar uma entidade apenas porque existe uma tabela, payload ou tela. Se dois valores com os mesmos atributos forem indistinguíveis para o negócio, o conceito pode ser um Value Object. Se o conceito for apenas uma estrutura de transporte, utilizar DTO ou input, não uma entidade.

Comparação conceitual:

```text
Entity
    → igualdade por identidade
    → possui ciclo de vida
    → pode mudar de estado preservando sua identidade

Value Object
    → igualdade por valor
    → não possui identidade própria
    → representa um valor e suas invariantes
```

## 2. Bounded context antes do código

Toda entidade deve pertencer a um contexto de negócio explícito:

```text
src/modules/<context>/
```

Antes de escolher nome, propriedades ou estrutura, determine o bounded context e descreva a responsabilidade da entidade em uma frase. Se a frase reunir responsabilidades de áreas distintas, separe os modelos antes de implementar.

Não criar um modelo global apenas porque a mesma pessoa ou organização aparece em várias partes do sistema. Por exemplo, evitar uma entidade universal `User` que concentre autenticação, cliente, funcionário, empresa e administração da plataforma.

Preferir modelos contextuais relacionados por identificadores ou contratos explícitos:

```text
Authentication.Identity
Customer.Customer
Workforce.Employee
Business.Business
PlatformAdministration.Administrator
```

Esses modelos podem referir-se ao mesmo ator do mundo real sem serem a mesma entidade de domínio.

## 3. Linguagem ubíqua é contextual

Nomear entidade, propriedades, estados, comportamentos e erros com os termos utilizados pelo negócio naquele contexto.

Um mesmo nome técnico não garante o mesmo significado:

```text
Customer.name
    = nome pessoal do cliente

Employee.name
    = nome pessoal do funcionário

Business.name
    = nome da empresa
```

Não compartilhar automaticamente um tipo, atributo ou Value Object porque os valores usam `string`, `number` ou o mesmo nome. Compartilhar somente quando significado, invariantes, comportamento e evolução esperada forem equivalentes.

Quando os significados forem diferentes, criar modelos contextuais distintos, mesmo que a representação atual seja igual. Quando forem realmente equivalentes em múltiplos contextos, reutilizar a abstração compartilhada oficial.

Não transportar atributos de outro bounded context para tornar uma entidade “completa”. Uma entidade precisa ser completa para suas próprias invariantes, não representar todos os dados conhecidos sobre o ator.

## 4. Processo obrigatório de modelagem

Antes da implementação, responda com base no código existente e no pedido do usuário:

1. A qual bounded context a entidade pertence?
2. Como ela é chamada na linguagem ubíqua desse contexto?
3. O que lhe confere identidade ao longo do tempo?
4. Quais atributos realmente pertencem a esse contexto?
5. Quais atributos são Value Objects?
6. Quais invariantes devem ser sempre verdadeiras?
7. Quais estados são possíveis e quais transições são permitidas?
8. Quais comportamentos pertencem à própria entidade?
9. Quais falhas são previsíveis e quais códigos as identificam?
10. Quais operações dependem de banco, relógio, aleatoriedade, filesystem, rede ou providers e devem ficar fora da entidade ou ser recebidas explicitamente?
11. Existe implementação reutilizável com o mesmo significado e as mesmas invariantes?
12. A solução criaria duplicação ou misturaria significados contextuais?

Se alguma resposta indispensável não puder ser inferida com segurança, inspecione usos, testes e modelos vizinhos. Só peça esclarecimento quando escolhas plausíveis produzirem modelos de domínio materialmente diferentes.

## 5. Estrutura funcional

Entidades devem seguir programação funcional por padrão. Representar dados com tipos imutáveis e agrupar operações puras em um objeto literal.

Estrutura conceitual:

```ts
type Appointment = {
  readonly id: AppointmentId
  readonly status: AppointmentStatus
  readonly scheduledAt: Date
}

const create = (...): Appointment => {
  // garante as invariantes ou lança por pré-condição violada
}

const tryCreate = (
  input: unknown,
): Result<Appointment, AppointmentError[]> => {
  // valida a entrada e acumula falhas previsíveis independentes
}

const cancel = (
  appointment: Appointment,
  cancelledAt: Date,
): Result<Appointment, AppointmentError> => {
  // transição pura e imutável
}

const Appointment = {
  create,
  tryCreate,
  cancel,
}
```

Não utilizar classe, construtor, `this`, herança ou estado interno mutável como padrão. Classes são permitidas somente quando uma biblioteca ou framework exigir ou quando existir necessidade técnica clara.

## 6. Imutabilidade

Todos os atributos da entidade devem ser `readonly`. Comportamentos retornam uma nova entidade ou um `Result` contendo uma nova entidade; nunca alteram o argumento recebido.

Preferir:

```ts
return result.ok({
  ...appointment,
  status: "CANCELLED",
  updatedAt: now,
})
```

Não fazer:

```ts
appointment.status = "CANCELLED"
```

`readonly` não torna objetos mutáveis internamente, como `Date`, verdadeiramente imutáveis. Não exponha ou reutilize referências mutáveis quando isso permitir quebrar invariantes. Quando necessário, use cópias defensivas, representação primitiva imutável ou Value Object apropriado.

## 7. Construção segura

A API da entidade deve oferecer `create` e `tryCreate` quando houver entrada potencialmente inválida ou reconstituição.

### `tryCreate`

`tryCreate` é a entrada segura para valores não confiáveis:

```ts
tryCreate(input: unknown): Result<Entity, EntityError[]>
```

Fluxo:

```text
unknown
    ↓
validação estrutural
    ↓
validações independentes
    ↓
result.combine(...)
    ↓
result.ok(entity) ou result.fail(errors)
```

Se a estrutura básica não permitir continuar, retorne imediatamente o erro estrutural. Depois dessa barreira, execute e acumule todas as validações independentes possíveis com `result.combine`, preservando a ordem dos erros.

Não retornar `null`, `undefined`, `false` nem lançar exception para falhas previsíveis de entrada em `tryCreate`.

### `create`

`create` recebe dados cuja pré-condição o chamador afirma garantir. Mesmo assim, deve assegurar as invariantes antes de produzir a entidade. Pode reutilizar `tryCreate` para evitar duplicação.

```text
create com entrada válida
    → Entity

create com pré-condição violada
    → throw descritivo
```

O `throw` representa erro de programação do chamador. Entradas externas potencialmente inválidas devem passar por `tryCreate`.

### Reconstituição

Dados recuperados de persistência não devem contornar invariantes. Use `tryCreate` ou uma operação explícita de reconstituição que valide todos os campos persistidos.

Separe inputs quando criação e reconstituição exigirem informações diferentes:

```ts
type CreateEntityInput = { ... }

type ReconstituteEntityInput = CreateEntityInput & {
  readonly createdAt: Date
  readonly updatedAt: Date
}
```

## 8. Invariantes e comportamentos

Uma entidade nunca deve ser produzida em estado inválido. Valide tanto atributos isolados quanto relações entre atributos, por exemplo:

- `updatedAt` não pode preceder `createdAt`;
- quantidade consumida não pode exceder a disponível;
- uma transição só pode partir de estados permitidos;
- datas de término não podem preceder datas de início.

Não limitar a entidade a um recipiente de propriedades quando existirem decisões que dependam apenas do próprio estado. Comportamentos como `cancel`, `consume`, `activate` ou `canAttempt` pertencem à entidade quando expressam suas regras internas sem coordenar infraestrutura.

Não forçar comportamento artificial. Consultas ou alterações triviais sem significado de domínio não precisam virar operações apenas para evitar um modelo anêmico.

Operações dependentes devem ser tratadas sequencialmente. Validações independentes podem ser combinadas com `result.combine`.

## 9. Result e erros

Utilize exclusivamente o `Result` compartilhado:

```ts
import {
  result,
  type Result,
} from "@/src/modules/shared/result"
```

Manter a distinção:

```text
Result<T, E>
    = tipo

result
    = objeto funcional
```

Falhas previsíveis de criação, validação ou transição devem retornar `result.fail`. Sucesso deve retornar `result.ok`.

Defina erros semânticos e códigos estáveis:

```ts
type AppointmentError = {
  readonly code:
    | "APPOINTMENT_INVALID_TYPE"
    | "APPOINTMENT_INVALID_STATUS"
    | "APPOINTMENT_ALREADY_CANCELLED"
  readonly message: string
}
```

A mensagem descreve; o código identifica programaticamente. Não usar mensagens como identificadores.

O erro semântico deve explicar o que falhou no domínio. Causas técnicas e metadados pertencem às opções de `result.fail` e não devem ser duplicados dentro do erro semântico sem uma necessidade contextual explícita.

Não utilizar exceptions para recusas normais do domínio. Reserve `throw` para violações de pré-condição de `create`, bugs e situações realmente excepcionais.

## 10. Value Objects e identificadores

Use Value Objects para atributos que possuem significado, invariantes ou operações próprias. Não repita dentro da entidade a validação já garantida por um VO.

Value Objects compartilhados ficam em:

```text
src/modules/shared/value-object/<name>/
```

Value Objects exclusivos do contexto ficam em:

```text
src/modules/<context>/value-object/
```

Um identificador contextual, como `IdentityId`, pode existir para impedir que IDs de entidades diferentes sejam confundidos. Isso não autoriza copiar regex, geração, parsing ou regras de UUID já fornecidas pelo `Id` compartilhado. Reutilize a implementação comum e acrescente somente a semântica contextual necessária.

Não crie um VO apenas para encapsular um primitivo sem invariantes ou significado adicional.

## 11. Efeitos externos e Clean Architecture

A entidade não deve acessar diretamente:

- banco de dados;
- HTTP;
- filesystem;
- filas ou mensageria;
- cache;
- variáveis de ambiente;
- relógio global;
- aleatoriedade global;
- bibliotecas de infraestrutura.

Receba explicitamente valores necessários às regras puras:

```ts
Identity.create(input, now)
VerificationCode.isExpired(code, now)
```

Geração de ID, hora atual e aleatoriedade devem ocorrer na camada de aplicação ou ser fornecidas por capacidades explícitas. O domínio recebe o resultado necessário e continua determinístico.

Persistência e integrações são portas externas à entidade. A direção de dependência deve apontar para os conceitos do domínio, nunca da entidade para implementações concretas.

## 12. Repositories e providers

Não criar repository ou provider automaticamente junto com toda entidade. Crie apenas quando um caso de uso real precisar daquela capacidade.

Repositories devem ser pequenos e segregados por capacidade:

```ts
type FindAppointmentByIdRepository = {
  findById(
    id: AppointmentId,
  ): Promise<Result<Appointment | null, AppointmentRepositoryError>>
}
```

Não criar CRUD completo por convenção. Não obrigar consumidores a depender de métodos que não utilizam.

Contratos e erros de persistência pertencem a:

```text
src/modules/<context>/repository/
```

Providers específicos de um conceito secundário devem permanecer próximos desse conceito. Implementações concretas pertencem à infraestrutura e não devem vazar tipos de bibliotecas para o domínio.

## 13. Organização de arquivos

Siga a estrutura existente do contexto e crie apenas diretórios justificados:

```text
src/modules/<context>/
├── index.ts
├── <entity>.entity.ts
├── <entity>-error.ts
├── <entity>.test.ts
├── repository/
├── value-object/
└── <secondary-concept>/
```

O conceito principal pode permanecer na raiz. Conceitos secundários com vários arquivos coesos podem ter pasta própria. Não crie `usecase/`, `repository/`, `provider/` ou qualquer outra pasta vazia ou sem responsabilidade concreta.

Todos os arquivos e diretórios devem usar `kebab-case`. Use sufixos apenas quando representarem a responsabilidade real:

```text
appointment.entity.ts
appointment-error.ts
appointment.repository.ts
appointment.provider.ts
appointment.mapper.ts
```

Diretórios que representem API pública ou unidade reutilizável devem possuir `index.ts` com exports explícitos. Atualize o barrel do contexto quando a entidade ou seus tipos fizerem parte da API pública. Prefira o barrel disponível a deep imports externos.

## 14. Testes

Crie ou atualize testes próximos à entidade. Cubra, conforme aplicável:

- construção válida com `create`;
- violação de pré-condição em `create`;
- entrada estrutural inválida em `tryCreate`;
- cada invariante e código de erro;
- acúmulo e ordem de erros independentes;
- estados válidos e inválidos;
- transições permitidas e recusadas;
- preservação da identidade durante mudanças;
- imutabilidade do valor original;
- reconstituição válida e inválida;
- ausência de atributos pertencentes a outros contextos quando essa fronteira for relevante;
- isolamento nominal de IDs quando existir.

Não teste apenas a tipagem `readonly` como se ela congelasse objetos em runtime. Teste o comportamento observável e as invariantes que a implementação realmente garante.

## 15. Fluxo de implementação

1. Leia o `AGENTS.md` aplicável e inspecione o contexto, barrels, testes e abstrações existentes.
2. Responda ao processo de modelagem antes de criar arquivos.
3. Defina identidade, atributos contextuais, invariantes, estados, transições e falhas.
4. Reutilize somente conceitos semanticamente equivalentes.
5. Implemente tipos imutáveis, validações puras, `tryCreate`, `create` e comportamentos necessários.
6. Isole efeitos externos e crie portas somente quando houver consumidor real.
7. Coloque os arquivos no contexto e na responsabilidade corretos.
8. Atualize barrels públicos explicitamente.
9. Escreva testes proporcionais às invariantes e aos comportamentos.
10. Execute testes, lint e typecheck do escopo alterado e, quando viável, do projeto inteiro.
11. Procure imports antigos, deep imports evitáveis, referências órfãs e duplicações introduzidas.

## 16. Checklist final

Antes de concluir, confirme:

- [ ] bounded context identificado;
- [ ] significado definido na linguagem ubíqua;
- [ ] entidade diferenciada de DTO e Value Object;
- [ ] identidade estável e corretamente tipada;
- [ ] somente atributos pertencentes ao contexto;
- [ ] invariantes garantidas em todas as construções e transições;
- [ ] operações funcionais e imutáveis;
- [ ] falhas previsíveis representadas pelo `Result` oficial;
- [ ] códigos de erro semânticos e estáveis;
- [ ] efeitos externos ausentes ou explicitamente isolados;
- [ ] nenhuma validação ou geração existente foi duplicada;
- [ ] repositories e providers existem somente por necessidade real;
- [ ] estrutura de pastas segue o contexto e as responsabilidades;
- [ ] barrels públicos atualizados com exports explícitos;
- [ ] testes cobrem invariantes, estados e comportamentos relevantes;
- [ ] lint, testes e typecheck executados;
- [ ] falhas preexistentes ou fora do escopo foram identificadas separadamente.

## Princípio final

Modele primeiro o significado no contexto e somente depois a estrutura técnica:

```text
Bounded Context
    +
Linguagem Ubíqua
    +
Identidade e Ciclo de Vida
    +
Invariantes e Comportamentos
    +
Programação Funcional e Imutabilidade
    +
Result e Efeitos Isolados
```

Uma entidade deve representar um conceito coeso do negócio, não uma coleção global de dados tecnicamente relacionados.

# Implementação funcional de entidades

Leia esta referência ao escrever construção, validações, invariantes, estados ou comportamentos.

## Representação

Use tipos imutáveis e operações puras agrupadas em objeto literal. Não use classes, `this` ou herança sem exigência técnica real.

```ts
type Appointment = {
  readonly id: AppointmentId
  readonly status: AppointmentStatus
}

const Appointment = {
  create,
  tryCreate,
  cancel,
}
```

Comportamentos retornam nova entidade ou `Result`; nunca alteram o argumento. `readonly` não congela `Date` ou objetos aninhados, então use cópias defensivas ou representações imutáveis quando necessário.

## Construção

`tryCreate(input: unknown)` é a entrada segura para dados não confiáveis ou reconstituição. Faça primeiro a barreira estrutural e depois acumule validações independentes com `result.combine`.

```text
unknown → estrutura → validações → result.ok ou result.fail(errors)
```

`create` recebe uma pré-condição declarada pelo chamador, mas ainda garante todas as invariantes. Pode reutilizar `tryCreate`; se a pré-condição for violada, lança erro descritivo. Não use `create` diretamente para entrada externa potencialmente inválida.

Separe `CreateEntityInput` de `ReconstituteEntityInput` quando timestamps ou dados persistidos forem diferentes. Reconstituição não pode contornar invariantes.

## Invariantes e comportamentos

Valide atributos e relações entre eles, como ordem temporal, limites quantitativos e transições permitidas. A entidade nunca deve ser produzida em estado inválido.

Comportamentos como `cancel`, `consume`, `activate` ou `canAttempt` pertencem à entidade quando expressam regras internas sem coordenar infraestrutura. Não invente operações triviais sem significado apenas para evitar um modelo anêmico.

## Result e erros

Falhas previsíveis usam o `Result` oficial. Códigos são estáveis; mensagens são descritivas. Cause e metadata pertencem às opções de `result.fail` e não devem ser duplicados no erro semântico.

Exceptions ficam reservadas para bugs, situações inesperadas e pré-condições violadas de `create`.

## Identificadores

Um ID contextual pode impedir mistura entre entidades, mas deve reutilizar validação e geração compartilhadas. Não copie regex, parsing ou provider de UUID apenas para adicionar uma marca nominal.

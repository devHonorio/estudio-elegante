---
name: result
description: Cria, modifica ou aplica o Result funcional do projeto, incluindo sucesso/falha, códigos de erro, cause, metadata, try, tryAsync, combine e propagação explícita. Use em tarefas de tratamento funcional de falhas previsíveis ou evolução de src/modules/shared/result.
---

# Result funcional

Use exclusivamente a implementação em `src/modules/shared/result/`. Não crie outro tipo de resultado, classe `Result` ou mecanismo paralelo.

## Contrato

```ts
type Result<T, E> =
  | { readonly success: true; readonly fail: false; readonly value: T }
  | { readonly success: false; readonly fail: true; readonly error: E }
```

`Result` é o tipo; `result` é o objeto funcional sem estado que expõe `ok`, `fail`, `try`, `tryAsync` e `combine`.

Use a propriedade afirmativa apropriada para narrowing:

```ts
if (operation.fail) return operation.error
return operation.value
```

## Falhas e erros

Falhas previsíveis de domínio retornam `result.fail`; exceptions ficam reservadas para bugs, pré-condições violadas e situações inesperadas.

Erros semânticos possuem código estável e mensagem descritiva. A mensagem não é identificador. `cause` preserva a causa técnica e `metadata` adiciona contexto estruturado nas opções de `result.fail`; não duplique esses papéis no erro semântico. Não exponha causas técnicas, stack traces ou metadados internos automaticamente no boundary.

## Operações

- `result.ok(value)` preserva o valor e seu tipo.
- `result.fail(error, { cause?, metadata? })` preserva erro e diagnóstico.
- `result.try(fn)` converte throw síncrono em falha e preserva a causa.
- `result.tryAsync(fn)` retorna `Promise<Result<T, E>>`, nunca `Result<Promise<T>, E>`.
- `result.combine(...results)` combina operações independentes, preserva tupla de valores ou acumula todos os erros em ordem.

Não use `combine` para operações dependentes ou para executar efeitos. Para dependências sequenciais, trate o resultado anterior explicitamente ou use composição funcional equivalente.

## Propagação

Toda camada que recebe um `Result` deve propagar, transformar ou tratar a falha. Repositories, providers e casos de uso não podem ignorar falhas.

Controllers e outros boundaries convertem `Result` para o protocolo externo sem vazar causas ou detalhes de infraestrutura.

## Checklist

- [ ] usa o `Result` oficial e seu barrel;
- [ ] estados success/fail são mutuamente exclusivos;
- [ ] falhas previsíveis não usam exception;
- [ ] códigos são estáveis e semânticos;
- [ ] cause e metadata não são duplicados;
- [ ] `combine` só reúne resultados independentes;
- [ ] tipos de tupla e erros são preservados;
- [ ] falhas são propagadas explicitamente;
- [ ] testes cobrem sucesso, falha, narrowing e ordem de erros.

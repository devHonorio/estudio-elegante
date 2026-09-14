# Regras de codificação

Leia este documento ao implementar ou modificar código de aplicação.

## Paradigma

Programação funcional é o padrão. Priorize funções puras, composição, imutabilidade, tipagem forte, dados como valores e efeitos colaterais isolados.

Não criar classes apenas por convenção. Use classe somente quando biblioteca ou framework exigir, ou quando houver necessidade técnica clara de estado interno.

## Imutabilidade e pureza

- Não altere objetos ou arrays recebidos como argumentos.
- Prefira `readonly`, spread, `map`, `filter` e `reduce`.
- Receba dependências explicitamente.
- Não esconda `Date.now()`, `Math.random()`, ambiente ou singletons mutáveis em lógica que aparenta ser pura.
- Lembre que `readonly` não congela objetos mutáveis como `Date`; proteja invariantes com cópias ou representações imutáveis quando necessário.

## Efeitos

Banco, HTTP, filesystem, filas, cache, relógio, aleatoriedade e ambiente são efeitos externos. Isole-os em repositories, providers, adapters ou na camada de aplicação:

```text
efeito externo → dados → função pura → resultado
```

Regras de negócio não devem conhecer tipos ou erros específicos de bibliotecas de infraestrutura.

## Erros

Falhas previsíveis usam o `Result` oficial. Exceptions representam violações de pré-condição, bugs ou situações inesperadas. Nunca descarte silenciosamente um `Result` de falha.

Não use `any` para contornar tipagem. Prefira narrowing pelas propriedades explícitas `success` e `fail`.

## Design

Crie funções pequenas e composáveis quando houver responsabilidades reais separáveis, sem fragmentar artificialmente código simples. Não crie interfaces, providers ou abstrações genéricas sem consumidor e benefício concreto.

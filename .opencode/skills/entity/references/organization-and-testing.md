# Organização, efeitos e testes de entidades

Leia esta referência ao criar arquivos relacionados, portas externas ou cobertura de testes.

## Efeitos e dependências

Entidades não acessam banco, HTTP, filesystem, cache, filas, ambiente, relógio global, aleatoriedade global ou bibliotecas de infraestrutura. Receba valores necessários explicitamente:

```ts
Identity.create(input, now)
VerificationCode.isExpired(code, now)
```

Repositories e providers são portas externas. Crie-os somente quando um consumidor real precisar da capacidade e mantenha contratos pequenos. Para detalhes, use a skill `repository`.

## Arquivos

Siga `.opencode/rules/project-structure.md`. Em geral:

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

O conceito principal pode ficar na raiz. Conceitos secundários coesos podem ter pasta própria. Não crie diretórios vazios ou antecipados. Atualize barrels com exports explícitos e evite deep imports externos.

## Testes

Cubra conforme aplicável:

- construção válida e pré-condição inválida em `create`;
- barreira estrutural de `tryCreate`;
- cada invariante e código de erro;
- acúmulo e ordem de erros independentes;
- estados e transições válidas e recusadas;
- preservação de identidade;
- imutabilidade do valor original;
- reconstituição válida e inválida;
- ausência de atributos de outros contextos;
- isolamento nominal de IDs.

Teste comportamento observável. Não trate `readonly` como garantia de congelamento em runtime.

Execute testes, lint e typecheck do escopo e, quando viável, do projeto. Procure imports antigos, referências órfãs e duplicações.

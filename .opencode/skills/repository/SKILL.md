---
name: repository
description: Cria, divide ou modifica contratos de repository seguindo DDD, Clean Architecture, Interface Segregation e Result. Use em tarefas de persistência de domínio, portas de dados, find/create/update/delete repositories ou erros de repository.
---

# Repository

Repositories são portas do domínio para capacidades de persistência. Não são implementações de banco e não devem revelar ORM, driver, query builder ou estruturas técnicas.

Antes de criar um contrato, leia o `AGENTS.md` aplicável e `.opencode/rules/architecture.md`.

## Decisão

Responda antes de implementar:

1. Qual contexto possui a responsabilidade?
2. Qual consumidor ou caso de uso precisa da capacidade?
3. Qual é a operação mínima necessária?
4. Quais tipos semânticos entram e saem?
5. Quais falhas previsíveis precisam ser comunicadas?
6. Já existe uma porta equivalente que pode ser reutilizada sem aumentar acoplamento?

Não crie repository sem consumidor real nem CRUD completo por convenção.

## Interface Segregation

Prefira contratos pequenos por capacidade:

```ts
type FindIdentityByIdRepository = {
  findById(
    id: IdentityId,
  ): Promise<Result<Identity | null, IdentityRepositoryError>>
}
```

Consumidores podem compor capacidades quando precisam de mais de uma. Não obrigue um caso de uso somente de leitura a depender de `create`, `update` e `delete`.

Use generics apenas quando preservarem a semântica. Evite contratos genéricos como `Repository<T>` quando eles escondem operações, inputs ou erros relevantes ao domínio.

## Tipos e Result

Inputs devem conter somente os dados necessários à operação. Outputs usam entidades, VOs ou DTOs internos apropriados. Falhas previsíveis retornam o `Result` oficial; erros técnicos são adaptados para erros contextuais na implementação.

`findById` pode retornar sucesso com `null` quando ausência for resultado normal da consulta. Decida no caso de uso se ausência é falha de negócio.

## Organização

```text
src/modules/<context>/repository/
├── index.ts
├── <operation>.repository.ts
└── <context>-repository-error.ts
```

Arquivos e diretórios usam `kebab-case`. O `index.ts` expõe explicitamente a API pública. Implementações concretas pertencem à infraestrutura e dependem do contrato, não o contrário.

## Checklist

- [ ] contexto e consumidor identificados;
- [ ] capacidade mínima e semanticamente nomeada;
- [ ] nenhuma dependência de infraestrutura vazou;
- [ ] input e output preservam significado;
- [ ] falhas usam o `Result` oficial;
- [ ] contrato não impõe CRUD desnecessário;
- [ ] arquivo está em `repository/` e exportado pelo barrel;
- [ ] testes ou fakes cobrem o consumidor quando aplicável.

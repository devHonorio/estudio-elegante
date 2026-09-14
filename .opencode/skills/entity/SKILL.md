---
name: entity
description: Cria, estrutura ou modifica entidades de domínio em TypeScript segundo bounded contexts, linguagem ubíqua, programação funcional e as convenções arquiteturais do projeto. Use quando a tarefa envolver entidade, identidade de domínio, invariantes, comportamentos ou reconstituição de um modelo com identidade própria.
---

# Entidades de domínio

Use esta skill para modelar e implementar entidades sem transportar decisões específicas de um contexto para outro.

## Carregamento progressivo

Leia somente as referências necessárias:

- Para criar ou revisar o modelo, seus atributos ou seu bounded context, leia [modeling.md](references/modeling.md).
- Para implementar tipos, `create`, `tryCreate`, invariantes ou comportamentos, leia [implementation.md](references/implementation.md).
- Para organizar arquivos, definir portas externas ou criar testes, leia [organization-and-testing.md](references/organization-and-testing.md).
- Se a tarefa criar ou alterar um Value Object, use também a skill `value-object`.
- Se criar ou alterar persistência, use também a skill `repository`.
- Para falhas previsíveis, use a skill `result`.

Leia antes as regras aplicáveis em `.opencode/rules/` e o contexto específico em `.opencode/contexts/`, quando existir.

## Processo obrigatório

Antes de implementar, responda:

1. A qual bounded context a entidade pertence?
2. Como ela é chamada na linguagem ubíqua?
3. O que lhe confere identidade ao longo do tempo?
4. Quais atributos pertencem realmente ao contexto?
5. Quais atributos são Value Objects?
6. Quais invariantes devem ser sempre verdadeiras?
7. Quais comportamentos pertencem à entidade?
8. Quais falhas são previsíveis?
9. Quais operações dependem de efeitos externos?
10. O que pode ser reutilizado sem misturar significados contextuais?

## Regras essenciais

- Modele dentro da linguagem do contexto, não como um modelo global do ator.
- Preserve identidade, invariantes e comportamentos reais; não reproduza apenas tabelas ou payloads.
- Prefira tipos `readonly`, funções puras e objetos literais funcionais.
- Use o `Result` oficial para falhas previsíveis.
- Passe relógio, aleatoriedade e dados externos explicitamente.
- Mantenha persistência, providers e infraestrutura fora da entidade.
- Não crie pastas, portas ou abstrações sem necessidade concreta.
- Atualize testes e barrels públicos afetados.

Use `Identity` apenas como referência de estilo e organização. Suas regras particulares pertencem ao contexto de autenticação e não são universais.

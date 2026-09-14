# Instruções globais do projeto

Este arquivo contém somente regras sempre aplicáveis e encaminha instruções especializadas. Leia apenas os documentos e skills relevantes à tarefa atual.

As instruções explícitas do usuário prevalecem sobre orientações de skills quando houver conflito. Preserve alterações existentes do usuário e não amplie o escopo sem autorização.

## Next.js

Esta versão possui mudanças incompatíveis com versões conhecidas anteriormente. Antes de alterar código Next.js, leia o guia relevante em `node_modules/next/dist/docs/` e respeite avisos de depreciação.

## Regras sempre aplicáveis

- Todo código de negócio pertence a `src/modules/<context>/`.
- Contextos representam áreas de negócio, não tipos técnicos.
- Arquivos e diretórios usam `kebab-case`.
- Programação funcional, imutabilidade, tipagem forte e funções puras são o padrão.
- Efeitos externos devem ficar explícitos e isolados.
- Falhas previsíveis usam o `Result` oficial em `src/modules/shared/result/`.
- Não criar pastas, interfaces, providers, services ou abstrações sem responsabilidade e consumidor reais.
- Não duplicar validações, geração ou infraestrutura já oferecidas por uma abstração oficial.
- APIs públicas de diretórios reutilizáveis usam `index.ts` com exports explícitos.

## Regras canônicas

Leia conforme o tipo de trabalho:

- Criação, movimentação ou organização de arquivos: [estrutura do projeto](.opencode/rules/project-structure.md).
- Implementação ou refatoração de código: [regras de codificação](.opencode/rules/coding.md).
- Decisões de domínio, dependências ou bounded contexts: [arquitetura](.opencode/rules/architecture.md).

## Skills

Use a skill correspondente quando a tarefa envolver:

- entidades, identidade, ciclo de vida ou invariantes: `entity`;
- Value Objects ou validação de valores de domínio: `value-object`;
- `Result`, erros funcionais, `try`, `tryAsync` ou `combine`: `result`;
- repositories, persistência ou Interface Segregation: `repository`;
- organização e criação de commits: `git-commit`.

As implementações canônicas ficam em `.opencode/skills/`. Os arquivos em `.agents/skills/` existem somente para descoberta e encaminhamento.

## Contextos específicos

Ao trabalhar em um diretório que possua `AGENTS.md`, leia-o integralmente. Decisões exclusivas de um bounded context não devem ser promovidas automaticamente a regras globais.

O contexto `identity` possui documentação canônica em [.opencode/contexts/identity.md](.opencode/contexts/identity.md), encaminhada por `src/modules/identity/AGENTS.md`.

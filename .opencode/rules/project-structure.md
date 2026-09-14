# Estrutura e nomenclatura do projeto

Leia este documento ao criar, mover ou organizar arquivos e módulos.

## Organização por contexto

Todo código de negócio pertence a `src/modules/<context>/`. O contexto representa uma área de negócio, não um tipo técnico.

Não criar estruturas globais como `src/entities`, `src/repositories`, `src/usecases` ou `src/services`. Conceitos genuinamente compartilhados podem ficar em `src/modules/shared/`, que não deve funcionar como depósito genérico.

O conceito principal pode permanecer na raiz do contexto. Conceitos secundários com vários arquivos coesos podem possuir pasta própria:

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

Crie diretórios somente quando houver arquivos e separação real de responsabilidade. Não criar pastas vazias ou antecipar camadas.

## Responsabilidades

- Casos de uso: `src/modules/<context>/usecase/<action>.ts`. Não usar `.usecase.ts` dentro de `usecase/`.
- Value Objects contextuais: `src/modules/<context>/value-object/`.
- Value Objects realmente compartilhados: `src/modules/shared/value-object/<name>/`.
- Contratos e erros de persistência: `src/modules/<context>/repository/`.
- Providers específicos de um conceito secundário: próximos ao conceito, por exemplo `<secondary-concept>/provider/`.

## Nomenclatura

Todos os arquivos e diretórios usam `kebab-case`. Use nomes descritivos e evite `utils.ts`, `helper.ts`, `common.ts`, `manager.ts`, `handler.ts` ou `service.ts` quando houver um nome de domínio mais preciso.

Use sufixos somente quando representarem a responsabilidade real:

```text
user.entity.ts
user.repository.ts
payment.provider.ts
user.mapper.ts
create-user.schema.ts
create-user.dto.ts
```

## API pública

Diretórios que representem API pública ou unidade reutilizável devem possuir `index.ts`. Use exports explícitos e `export type` para tipos. Prefira o barrel público a deep imports externos.

Antes de criar um arquivo, confirme contexto, responsabilidade, implementação existente reutilizável, nome e necessidade real da pasta.

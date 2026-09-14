---
name: value-object
description: Creates, structures and implements Value Objects (value objects, VO, Name, Email, Phone, Cpf, Cnpj, Money, AppointmentDuration) following the project's functional and architectural conventions. Use when creating a domain value with its own invariants or centralizing value validation scattered across the application.
---

# Value Objects

Use esta skill para modelar valores de domínio imutáveis, sem identidade própria e válidos por construção.

## Carregamento progressivo

Leia somente o necessário:

- Para conceito, localização, compartilhamento, invariantes, construção, erros e testes, leia [modeling-and-validation.md](references/modeling-and-validation.md).
- Quando houver biblioteca, parser, gerador ou integração, leia [external-dependencies.md](references/external-dependencies.md).
- Para distinguir conceitos por exemplos, leia [examples.md](references/examples.md).
- Para o contrato completo de falhas previsíveis, use a skill `result`.

Leia também as regras aplicáveis em `.opencode/rules/` e o contexto em `.opencode/contexts/`, quando existir.

## Processo obrigatório

Antes de implementar, determine:

1. Qual valor do domínio está sendo representado?
2. Em qual bounded context ele possui esse significado?
3. Ele é definido apenas por valores ou possui identidade e ciclo de vida?
4. Quais invariantes e normalizações são exigidas?
5. O conceito e as invariantes são equivalentes em mais de um contexto?
6. Quais falhas são previsíveis?
7. Existe dependência externa que deve ficar atrás de um contrato?
8. Já existe capacidade reutilizável sem conflito semântico?

## Regras essenciais

- Não compartilhe um VO apenas porque valores usam o mesmo tipo primitivo ou nome de atributo.
- Centralize invariantes e impeça a criação de estados inválidos.
- Prefira tipos `readonly`, marcas nominais, funções puras e objetos literais funcionais.
- Use `tryCreate(input: unknown)` para dados não confiáveis e `create` para pré-condições explícitas.
- Acumule validações independentes com `result.combine`.
- Use o `Result` oficial e erros semânticos com códigos estáveis.
- Isole efeitos e receba dependências externas explicitamente.
- Evite abstrações, arquivos e pastas sem necessidade concreta.
- Atualize testes e barrels públicos afetados.

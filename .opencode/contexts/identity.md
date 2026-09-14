# Contexto Identity

Leia este documento antes de modificar `src/modules/identity/` ou modelar sua relação com perfis de negócio.

## Responsabilidade

`Identity` representa exclusivamente uma identidade autenticável. Mantém apenas dados e invariantes necessários à autenticação, como `IdentityId`, telefone e ciclo de vida.

Não adicionar a `Identity`:

```text
name
accountType
role
customer
employee
business
administrator
```

Cliente, funcionário, proprietário, membro de empresa e administrador pertencem a outros bounded contexts e se relacionam com autenticação por `IdentityId` quando necessário.

## Nomes e perfis

Nome pessoal de cliente ou funcionário pode reutilizar o VO compartilhado `Name` somente se significado e invariantes forem equivalentes. Nome empresarial é outro conceito e deve usar `BusinessName`, `LegalName` ou `TradeName` apenas quando houver invariantes e consumidor reais.

Uma empresa não se autentica diretamente. Uma pessoa autenticada acessa a empresa por uma relação contextual:

```text
Identity → BusinessOwner / BusinessMember / Employee → Business
```

Uma identidade pode possuir múltiplos perfis quando o negócio permitir. Não inferir perfil a partir de `Identity` nem armazenar uma classificação global nela.

## Fluxo

```text
verificação do telefone
        ↓
autenticação / Identity
        ↓
criação ou localização do perfil no contexto proprietário
```

Dados coletados durante onboarding pertencem ao contexto que lhes dá significado; proximidade temporal com o login não os torna atributos de `Identity`.

## Organização

`identity.entity.ts`, `identity-error.ts` e `identity.test.ts` permanecem na raiz como conceito principal. `value-object/` contém VOs contextuais; `repository/` contém contratos e erros de persistência; `verification-code/` agrupa o conceito secundário e seus providers.

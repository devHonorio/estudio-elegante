# Modelagem e validação de Value Objects

Leia esta referência ao definir o conceito, suas invariantes ou sua construção.

Um Value Object é definido pelo valor, não possui identidade própria e protege invariantes do domínio. Não o crie apenas para envolver um tipo primitivo.

Antes de compartilhar um VO, confirme equivalência de significado, invariantes, comportamento e evolução. A mesma representação técnica não basta. `CustomerName` e `EmployeeName` podem compartilhar `Name` quando ambos significarem nome pessoal sob as mesmas regras; nomes empresariais podem exigir `LegalName` ou `TradeName` contextuais.

Coloque VOs realmente compartilhados em `src/modules/shared/value-object/<name>/`. VOs exclusivos ficam em `src/modules/<context>/value-object/`. Exponha APIs reutilizáveis por `index.ts` explícito.

## Representação e construção

Prefira tipo imutável com marca nominal e objeto literal de operações. Não use classes, `this`, herança ou estado mutável sem exigência técnica real. Não exponha uma construção que permita forjar valores inválidos.

`tryCreate(input: unknown)` é a fronteira segura:

```text
unknown → estrutura → normalização → invariantes → Result
```

Use `result.combine` para validações independentes, preservando a ordem dos erros. Validações dependentes são sequenciais.

`create` recebe uma pré-condição explícita e ainda garante invariantes. Pode lançar exception descritiva se o chamador quebrar a pré-condição; isso é erro de programação, não falha normal de entrada.

Normalize somente quando a linguagem do domínio determinar. A normalização deve ser pura, determinística e testada. Igualdade compara o valor semântico normalizado.

## Erros e testes

Defina erros semânticos, imutáveis e códigos estáveis. Falhas previsíveis retornam o `Result` oficial.

Cubra entradas válidas, cada invariante, estrutura inválida, normalização, igualdade, imutabilidade, acúmulo e ordem de erros, além da violação de pré-condição de `create` quando aplicável.

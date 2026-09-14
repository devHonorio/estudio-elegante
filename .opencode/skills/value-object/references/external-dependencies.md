# Dependências externas em Value Objects

Leia somente quando o valor exigir biblioteca, parser, gerador, relógio ou outra integração.

O VO deve permanecer independente de infraestrutura. Separe apenas quando necessário:

- `Provider`: contrato mínimo de capacidade externa.
- `Parser`: converte representação externa em primitivos do domínio.
- `Factory`: coordena dependência externa e construção do VO.
- infraestrutura: adapta biblioteca ou serviço concreto.

Não crie essas abstrações antecipadamente. Uma função pura local é preferível quando suficiente.

Receba dependências explicitamente, preserve falhas previsíveis em `Result` e converta erros de bibliotecas na fronteira. O domínio não importa SDKs nem acessa ambiente, `Date.now()` ou `Math.random()` implicitamente.

Mantenha contratos pequenos e arquivos relacionados próximos ao VO. Exponha somente a API pública necessária.

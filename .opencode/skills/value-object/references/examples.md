# Exemplos de decisão para Value Objects

Use como orientação, não como regras universais.

## Nome

Um `Name` compartilhado pode servir cliente e funcionário se ambos usam exatamente o conceito de nome pessoal e as mesmas invariantes. O nome empresarial não deve reutilizá-lo automaticamente: razão social, nome fantasia e nome pessoal evoluem de modo diferente, embora sejam `string`.

## Telefone

`Phone` pode representar um número normalizado e válido. Se a validação depender de biblioteca, mantenha parsing externo ao núcleo e injete a capacidade na factory ou criação apropriada. Envio de SMS, verificação de posse, consulta de operadora e persistência não pertencem ao VO.

## Identificador contextual

`IdentityId` expressa a identidade do modelo de autenticação, mesmo reutilizando o mecanismo compartilhado de geração e validação de IDs. Reutilize a capacidade técnica sem apagar o significado contextual do tipo.

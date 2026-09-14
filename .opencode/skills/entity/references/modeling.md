# Modelagem de entidades

Leia esta referência ao definir uma entidade nova, revisar seus atributos ou decidir fronteiras de contexto.

## Entidade versus Value Object

Uma entidade possui identidade estável, ciclo de vida e continuidade apesar de mudanças de atributos. Um Value Object é definido por seus valores e não possui identidade própria. Uma tabela, payload ou tela não justifica uma entidade por si só.

## Bounded context

Toda entidade pertence a `src/modules/<context>/`. Defina sua responsabilidade em uma frase antes de nomear propriedades. Se a frase reunir responsabilidades de áreas diferentes, separe os modelos.

Não crie um `User` global reunindo autenticação, cliente, funcionário, empresa e administração. Modelos distintos podem representar o mesmo ator do mundo real:

```text
Authentication.Identity
Customer.Customer
Workforce.Employee
Business.Business
PlatformAdministration.Administrator
```

## Linguagem ubíqua

Interprete nomes exclusivamente no contexto:

```text
Customer.name = nome pessoal do cliente
Employee.name = nome pessoal do funcionário
Business.name = nome da empresa
```

Não compartilhe tipo ou VO somente pela mesma representação técnica. Compartilhe quando significado, invariantes, comportamento e evolução esperada forem equivalentes.

## Perguntas de modelagem

1. Qual é o bounded context?
2. Qual é o termo da linguagem ubíqua?
3. O que preserva a identidade ao longo do tempo?
4. Quais atributos pertencem realmente ao contexto?
5. Quais atributos são Value Objects?
6. Quais invariantes são sempre verdadeiras?
7. Quais estados e transições existem?
8. Quais comportamentos dependem somente do estado da entidade?
9. Quais falhas são previsíveis?
10. Quais operações dependem de efeitos externos?
11. Existe conceito semanticamente equivalente que pode ser reutilizado?
12. A solução introduziria duplicação ou mistura de contextos?

Inspecione modelos, usos e testes existentes antes de responder. Peça esclarecimento apenas quando alternativas plausíveis produzirem domínios materialmente diferentes.

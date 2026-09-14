# Arquitetura de domínio

Leia este documento ao tomar decisões de domínio, dependência ou comunicação entre módulos.

## DDD e linguagem ubíqua

Modele primeiro o significado no negócio e somente depois a estrutura técnica. Toda entidade, Value Object, comportamento e erro deve ser interpretado dentro de seu bounded context.

Um mesmo nome pode representar conceitos diferentes:

```text
Customer.name = nome pessoal do cliente
Employee.name = nome pessoal do funcionário
Business.name = nome da empresa
```

Não compartilhar tipos apenas por terem o mesmo nome ou representação primitiva. Compartilhe somente quando significado, invariantes e evolução esperada forem equivalentes.

## Bounded contexts

Não criar um `User` global reunindo autenticação, cliente, funcionário, empresa e administração. Prefira modelos contextuais relacionados por IDs ou contratos explícitos.

Uma mesma pessoa do mundo real pode aparecer como modelos diferentes em autenticação, atendimento, força de trabalho e administração. Cada contexto é proprietário de seus dados e regras.

## Clean Architecture

A direção das dependências aponta para o domínio:

```text
infraestrutura → portas do domínio → regras de negócio
```

Entidades e Value Objects não dependem de banco, HTTP, filesystem ou bibliotecas concretas. Implementações técnicas adaptam seus resultados para tipos internos antes de alcançar o domínio.

## Interfaces

Aplique Interface Segregation: contratos representam capacidades necessárias a consumidores reais. Prefira interfaces pequenas e composáveis a CRUDs ou providers monolíticos. Não generalize inputs, outputs ou erros a ponto de perder semântica.

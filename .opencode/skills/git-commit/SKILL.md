---
name: git-commit
description: Use when the user asks to prepare, organize, analyze and commit Git changes, e.g. "commit", "conventional commit", "fazer commit", "organizar commits", "preparar commit", "git add", "git commit". Inspects the repository state, groups related changes into logically independent Conventional Commits with emojis, presents a summary, and only stages and commits after explicit user authorization. Triggers on any request to create or plan commits.
---

# Git Commit Organizer

Skill responsável por analisar, organizar e realizar commits Git seguindo **Conventional Commits**, com uma identidade visual através de um **emoji/ícone no início da mensagem de commit**.

A skill deve ser utilizada para preparar commits de forma segura, organizada e coerente com o contexto das alterações.

## 1. Objetivo

A skill deve:

1. Inspecionar o estado atual do Git.
2. Identificar todas as alterações existentes.
3. Analisar os arquivos modificados.
4. Agrupar alterações relacionadas em commits logicamente independentes.
5. Determinar o tipo adequado de cada commit.
6. Selecionar apenas os arquivos pertencentes ao contexto daquele commit.
7. Apresentar um resumo do que será commitado.
8. Solicitar autorização explícita do usuário.
9. Somente após a autorização, colocar em stage os arquivos correspondentes.
10. Criar os commits planejados.

Nunca realizar commits automaticamente sem autorização explícita do usuário.

## 2. Regra de segurança

A skill deve ser **read-only até receber autorização**.

Antes da autorização, pode executar comandos de leitura e análise, como:

```bash
git status
git diff
git diff --cached
git log
git ls-files
```

Não executar operações destrutivas ou que alterem o estado do Git antes da autorização.

Antes da confirmação do usuário, não executar:

```bash
git add
git commit
git reset
git restore
git checkout
git clean
```

A exceção é qualquer comando estritamente necessário para inspeção que não modifique o estado do repositório.

## 3. Inspeção das modificações

A skill deve começar verificando o estado atual do repositório.

Analisar:

```bash
git status --short
```

Depois analisar as diferenças relevantes:

```bash
git diff
git diff --cached
```

Quando necessário, inspecionar arquivos individualmente.

Também considerar:

```bash
git diff --stat
```

O objetivo é descobrir:

- arquivos modificados;
- arquivos novos;
- arquivos removidos;
- arquivos renomeados;
- alterações staged;
- alterações unstaged;
- contexto das alterações;
- possíveis grupos independentes de mudanças.

A skill não deve assumir que todos os arquivos modificados pertencem ao mesmo commit.

## 4. Agrupamento por contexto

As alterações devem ser agrupadas por **contexto lógico**.

Exemplo:

```text
Contexto A
├── src/modules/users/...
└── testes relacionados

Contexto B
├── src/modules/appointments/...
└── testes relacionados
```

Se existirem alterações de naturezas diferentes, criar commits separados.

Exemplo:

```text
Feature
Bug fix
Refactor
Documentation
Tests
Chore
```

Não juntar alterações sem relação apenas porque ocorreram na mesma sessão de desenvolvimento.

## 5. Alterações parcialmente relacionadas

Quando um mesmo arquivo possuir alterações pertencentes a contextos diferentes, a skill deve identificar essa situação.

Não adicionar automaticamente o arquivo inteiro ao stage se isso fizer com que um commit contenha alterações de outro contexto.

Quando necessário, utilizar staging parcial/hunk staging para separar as alterações.

Preferir comandos como:

```bash
git add -p
```

quando isso permitir separar corretamente os contextos.

Nunca remover ou descartar silenciosamente alterações do usuário para conseguir separar commits.

## 6. Não alterar código para fazer commit

A responsabilidade desta skill é organizar e criar commits.

A skill não deve:

- modificar código;
- corrigir bugs;
- formatar arquivos;
- refatorar;
- remover alterações;
- reescrever arquivos;
- alterar conteúdo apenas para adequá-lo ao commit.

Ela pode somente organizar as alterações existentes no Git.

## 7. Conventional Commits

Todas as mensagens devem seguir o padrão:

```text
<emoji> <type>(<scope>): <description>
```

Exemplo:

```text
🐛 fix(appointments): prevent overlapping appointments
```

Formato:

```text
<emoji> <type>(<scope>): <description>
```

O `scope` é opcional quando não houver um contexto claro.

Exemplo:

```text
📝 docs: update project context
```

## 8. Tipos de Conventional Commits

Utilizar os tipos convencionais apropriados.

### feat

Nova funcionalidade.

Emoji padrão:

```text
✨
```

Exemplo:

```text
✨ feat(appointments): add appointment scheduling
```

### fix

Correção de bug.

Emoji padrão:

```text
🐛
```

Exemplo:

```text
🐛 fix(appointments): prevent overlapping appointments
```

### refactor

Mudança estrutural que não adiciona funcionalidade nem corrige bug.

Emoji padrão:

```text
♻️
```

Exemplo:

```text
♻️ refactor(users): simplify user repository flow
```

### perf

Melhoria de performance.

Emoji padrão:

```text
⚡
```

Exemplo:

```text
⚡ perf(appointments): optimize availability query
```

### test

Adição ou alteração de testes.

Emoji padrão:

```text
🧪
```

Exemplo:

```text
🧪 test(appointments): add conflict validation tests
```

### docs

Alteração de documentação.

Emoji padrão:

```text
📝
```

Exemplo:

```text
📝 docs(context): update coding conventions
```

### chore

Tarefas de manutenção que não alteram diretamente uma funcionalidade.

Emoji padrão:

```text
🔧
```

Exemplo:

```text
🔧 chore: update development dependencies
```

### build

Alterações relacionadas ao processo de build ou dependências de build.

Emoji padrão:

```text
📦
```

Exemplo:

```text
📦 build: update production build configuration
```

### ci

Alterações relacionadas a CI/CD.

Emoji padrão:

```text
👷
```

Exemplo:

```text
👷 ci: update deployment workflow
```

### style

Alterações puramente relacionadas a estilo/formatação sem mudança de comportamento.

Emoji padrão:

```text
🎨
```

Exemplo:

```text
🎨 style: format source files
```

### revert

Reversão de um commit anterior.

Emoji padrão:

```text
⏪
```

Exemplo:

```text
⏪ revert: revert appointment availability change
```

## 9. Emoji

Todo commit deve obrigatoriamente começar com um emoji.

O emoji deve corresponder ao tipo do Conventional Commit.

Mapeamento padrão:

```text
✨ feat
🐛 fix
♻️ refactor
⚡ perf
🧪 test
📝 docs
🔧 chore
📦 build
👷 ci
🎨 style
⏪ revert
```

Não adicionar múltiplos emojis.

Não colocar emoji no final da mensagem.

Formato obrigatório:

```text
<emoji> <type>(<scope>): <description>
```

## 10. Scope

Quando possível, utilizar o contexto afetado como `scope`.

Exemplos:

```text
✨ feat(appointments): add appointment reminders
🐛 fix(users): prevent duplicate email registration
♻️ refactor(notifications): isolate messaging provider
🧪 test(appointments): cover schedule conflicts
```

O scope deve ser curto e representar o contexto real.

Evitar scopes genéricos como:

```text
misc
stuff
changes
update
general
```

Quando uma alteração realmente afetar múltiplos contextos e não existir um scope apropriado, omitir o scope.

## 11. Descrição do commit

A descrição deve:

- ser curta;
- estar no imperativo ou forma de ação;
- explicar o resultado da alteração;
- não descrever detalhes irrelevantes de implementação;
- não terminar com ponto.

Preferir:

```text
🐛 fix(appointments): prevent overlapping bookings
```

Evitar:

```text
🐛 fix(appointments): changed some appointment code.
```

A mensagem deve responder:

> O que este commit muda?

## 12. Um commit deve representar uma unidade lógica

Cada commit deve representar uma mudança coerente.

Preferir:

```text
✨ feat(appointments): add appointment availability
```

e:

```text
🧪 test(appointments): cover availability conflicts
```

quando as alterações forem suficientemente independentes.

Porém, se os testes fizerem parte inseparável da própria implementação e não houver benefício em separá-los, eles podem permanecer no mesmo commit.

A divisão deve ser lógica, não mecânica.

## 13. Resumo antes do commit

Depois de analisar as alterações, a skill deve apresentar ao usuário um resumo **antes de modificar o stage ou criar qualquer commit**.

O resumo deve informar:

### Commit 1

```text
🐛 fix(appointments): prevent overlapping appointments
```

Arquivos:

```text
M src/modules/appointments/usecase/create-appointment.ts
M src/modules/appointments/appointment.repository.ts
M tests/appointments/create-appointment.test.ts
```

Resumo:

```text
Impede a criação de agendamentos conflitantes e adiciona cobertura para o cenário.
```

### Commit 2

```text
📝 docs(context): update coding conventions
```

Arquivos:

```text
M .context/coding.md
```

Resumo:

```text
Atualiza as regras de codificação funcional e Result.
```

## 14. Autorização obrigatória

Após apresentar o resumo, a skill deve solicitar **autorização explícita** antes de continuar.

Exemplo:

```text
Analisei as alterações e preparei os seguintes commits:

1. 🐛 fix(appointments): prevent overlapping appointments
2. 🧪 test(appointments): cover conflict validation
3. 📝 docs(context): update coding conventions

Posso colocar os arquivos correspondentes em stage e criar esses commits?
```

A skill deve aguardar uma confirmação clara.

Exemplos de autorização válida:

```text
sim
pode fazer
aprovado
pode commitar
faça
```

Não considerar silêncio ou mensagens ambíguas como autorização.

## 15. Após autorização

Somente depois da autorização explícita:

1. Colocar em stage apenas os arquivos pertencentes ao commit atual.
2. Conferir o conteúdo staged.
3. Criar o commit.
4. Repetir o processo para o próximo commit.

Preferir verificar:

```bash
git diff --cached
```

antes de executar:

```bash
git commit
```

O conteúdo staged deve corresponder exatamente ao resumo apresentado ao usuário.

## 16. Nunca commitar alterações fora do contexto

Se houver alterações que não façam parte dos commits aprovados:

- deixá-las fora do stage;
- não descartá-las;
- não modificá-las;
- não incluí-las por conveniência.

Exemplo:

```text
Alterações encontradas:

✅ appointments → commit aprovado
✅ tests → commit aprovado
⚠️ local configuration → não incluído
⚠️ experimental UI → não incluído
```

Somente as alterações explicitamente agrupadas nos commits aprovados devem ser commitadas.

## 17. Verificação pós-commit

Depois de cada commit, verificar o resultado com:

```bash
git status --short
git log -1 --oneline
```

Quando necessário, verificar:

```bash
git show --stat --oneline HEAD
```

Garantir que:

- o commit foi criado;
- a mensagem está correta;
- somente os arquivos esperados foram incluídos;
- alterações não relacionadas continuam preservadas.

## 18. Falha durante o processo

Se qualquer comando de Git falhar:

- interromper o processo;
- não executar comandos destrutivos para tentar corrigir automaticamente;
- informar o erro ao usuário;
- preservar as alterações existentes.

Não utilizar:

```bash
git reset --hard
git clean -fd
git restore .
```

para resolver conflitos ou problemas automaticamente.

## 19. Histórico existente

Antes de criar mensagens que dependam de convenções específicas do repositório, verificar o histórico recente:

```bash
git log --oneline -10
```

O padrão definido nesta skill tem prioridade para novos commits, mas o histórico pode ajudar a identificar:

- scopes já utilizados;
- nomenclatura;
- organização existente;
- convenções específicas do projeto.

Não copiar mensagens antigas cegamente.

## 20. Regra de decisão do tipo

Ao escolher o tipo do commit, aplicar esta ordem de raciocínio:

```text
Nova funcionalidade?
    ↓
feat

Correção de comportamento incorreto?
    ↓
fix

Mudança estrutural sem alteração funcional?
    ↓
refactor

Melhoria de performance?
    ↓
perf

Testes?
    ↓
test

Documentação?
    ↓
docs

Build/dependências de build?
    ↓
build

CI/CD?
    ↓
ci

Formatação/estilo sem comportamento?
    ↓
style

Manutenção geral?
    ↓
chore

Reversão?
    ↓
revert
```

Não escolher o tipo baseado apenas nos arquivos alterados.

Considerar a **intenção da alteração**.

## 21. Commit message deve ser em inglês

As mensagens de commit devem ser escritas em inglês, seguindo a convenção internacional do Conventional Commits.

Exemplo:

```text
🐛 fix(appointments): prevent overlapping bookings
```

Não utilizar:

```text
🐛 fix(appointments): corrigir conflito de horários
```

O resumo apresentado ao usuário antes da confirmação pode ser escrito no idioma da conversa.

## 22. Resultado final

Ao terminar, apresentar um resumo curto dos commits criados.

Exemplo:

```text
Commits created:

✨ feat(appointments): add appointment availability
🐛 fix(appointments): prevent overlapping bookings
🧪 test(appointments): cover scheduling conflicts
```

Também informar se permaneceram alterações não commitadas:

```text
Remaining changes:
M src/...
?? ...
```

Nunca afirmar que tudo foi commitado sem verificar o estado final do Git.

## 23. Princípio final

A skill deve seguir este fluxo obrigatório:

```text
Inspecionar Git
      ↓
Analisar alterações
      ↓
Agrupar por contexto lógico
      ↓
Definir Conventional Commits
      ↓
Apresentar resumo
      ↓
PEDIR AUTORIZAÇÃO
      ↓
Aguardar confirmação
      ↓
Stage apenas do contexto aprovado
      ↓
Verificar staged diff
      ↓
Commit
      ↓
Verificar resultado
      ↓
Próximo commit
```

A regra mais importante é:

**Nunca realizar `git add` ou `git commit` antes da autorização explícita do usuário.**
---
name: project-knowledge
description: Registra e organiza conhecimento persistente do projeto no menor escopo canônico adequado. Use quando o usuário pedir para anotar, registrar, documentar, guardar uma referência, lembrar uma decisão em futuras implementações ou adicionar algo às regras do projeto. Não use para informações temporárias de uma única tarefa.
---

# Conhecimento do projeto

Transforme pedidos de memória persistente em documentação curta, normativa e localizada no proprietário correto. Não use `AGENTS.md` como depósito geral.

## Classificação e destino

Classifique o conteúdo antes de editar:

| Escopo | Destino preferencial |
| --- | --- |
| Regra global, curta e sempre aplicável | `AGENTS.md` |
| Codificação, imutabilidade, efeitos ou erros | `.opencode/rules/coding.md` |
| Estrutura, nomenclatura, localização ou barrels | `.opencode/rules/project-structure.md` |
| DDD, Clean Architecture, dependências ou fronteiras | `.opencode/rules/architecture.md` |
| Decisão exclusiva de bounded context | `.opencode/contexts/<context>.md` |
| Procedimento de uma atividade recorrente | `.opencode/skills/<skill>/SKILL.md` |
| Detalhe condicional, exemplo ou referência extensa de skill | `.opencode/skills/<skill>/references/<topic>.md` |
| Preferência temporária ou detalhe de uma única tarefa | Não persistir |

Use o menor escopo capaz de alcançar os agentes que realmente precisam da informação.

## Processo

1. Determine se o pedido expressa memória persistente ou apenas uma instrução para a tarefa atual.
2. Identifique o assunto, os consumidores e o menor escopo correto.
3. Procure primeiro o documento canônico que já é proprietário do assunto.
4. Verifique se a informação já existe, se complementa uma regra ou se a contradiz.
5. Em caso de contradição material ou ambiguidade que altere a decisão arquitetural, apresente o conflito ao usuário antes de sobrescrever.
6. Atualize a regra existente quando a nova decisão a substituir; não mantenha versões incompatíveis.
7. Escreva a orientação de modo normativo, independente da conversa e tão curto quanto possível.
8. Crie ou ajuste um roteador somente se o conteúdo não for descoberto pelo fluxo atual.
9. Valide os arquivos alterados e informe onde e por que o conhecimento foi registrado.

Antes de registrar, responda internamente:

1. Isto precisa continuar válido em tarefas futuras?
2. É regra, decisão contextual, procedimento ou referência?
3. Quem precisa carregar essa informação?
4. Em quais tarefas ela é relevante?
5. Qual é o menor escopo correto?
6. Já existe um proprietário canônico?
7. Algum roteador precisa ser atualizado?
8. Haverá duplicação ou contradição?
9. A redação pode ser mais curta e normativa?
10. Alguma instrução antiga deve ser substituída?

## Restrições

- `.opencode` contém as implementações canônicas de regras, contextos e skills.
- `.agents/skills/<skill>/SKILL.md` contém somente frontmatter de descoberta e encaminhamento para `.opencode`.
- Um `AGENTS.md` contextual deve ser curto e encaminhar para o documento do contexto.
- Não replique a mesma regra em `AGENTS.md`, rules, contexts e skills.
- Não promova uma decisão contextual a regra global sem evidência de aplicação geral.
- Não crie `notes.md`, `misc.md`, `general.md` ou arquivos genéricos equivalentes.
- Não crie arquivo novo quando um proprietário adequado já existir.
- Não registre hipóteses, preferências efêmeras, estado de execução ou detalhes que envelhecem imediatamente.
- Não transforme um exemplo isolado em regra universal.
- Não altere código ou documentação fora do necessário para registrar e tornar descobrível o conhecimento solicitado.

## Validação e entrega

- Verifique links relativos e referências afetadas.
- Execute `git diff --check`.
- Quando criar ou modificar qualquer `SKILL.md`, execute o validador oficial de skills para cada skill afetada.
- Informe o arquivo canônico escolhido, o motivo do escopo, consolidações ou substituições realizadas e as validações executadas.

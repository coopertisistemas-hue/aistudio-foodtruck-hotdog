# QUALITY GUIDELINES – ECOSSISTEMA CONNECT

## 1. Objetivo

Garantir que todos os projetos do ecossistema Connect  
(Delivery Connect, UPH, Portais, etc.) mantenham:

- Padrão profissional de **código**, **UX**, **segurança** e **consistência de negócio**.
- Arquitetura previsível e fácil de manter.
- Base sólida para evolução com IA (Antigravity, ChatGPT, Gemini, etc.), sem virar “gambiarra as-a-service”.

Sempre que uma IA for usada para alterar o projeto, o prompt deve incluir:

> “Siga o QUALITY_GUIDELINES.md deste projeto e não quebre padrões já existentes.”

---

## 2. Arquitetura & Camadas

### 2.1. Separação de responsabilidades

- **Frontend (React + TypeScript)**  
  - Páginas em `src/pages/...`
  - Componentes reutilizáveis em `src/components/...`
  - Hooks em `src/hooks/...`
  - Camada de API em `src/lib/api/...`

  **Regra:**  
  Nenhum componente de página deve fazer `fetch` direto.  
  Sempre usar **hooks** ou **serviços de API**.

- **Backend (Supabase + Edge Functions)**  
  - Lógica de negócio sensível sempre em Edge Functions, não no frontend.
  - Validação de entrada e regras críticas acontecem no backend.

- **Banco (Supabase)**  
  - Tabelas com nomes em `snake_case` e plural (ex.: `orders`, `orgs`, `kanban_cards`).
  - Campos padrão:
    - `id` (UUID PK),
    - `created_at` (timestamptz),
    - `updated_at` quando necessário,
    - `org_id` em tabelas multi-tenant.

---

## 3. Frontend (React + TypeScript)

### 3.1. Estilo de código

- Sempre **TypeScript**, com tipos explícitos para:
  - respostas de API,
  - props de componentes,
  - dados de hooks.
- Evitar `any`. Só usar quando inevitável, com comentário explicando o motivo.
- Evitar componentes “monolíticos”:
  - Se um componente passar de ~200 linhas, considerar extrair sub-componentes ou hooks.

### 3.2. Hooks & API

- Todo acesso a Supabase/Edge Functions deve ser centralizado:
  - Hooks como `useOrders`, `useOperationalKpis`, `useOperationalAlerts`, `useMenu`, etc.
  - Serviços em `src/lib/api/...` quando fizer sentido.

**Regras:**

- Nunca duplicar chamadas de API: se já existe um hook, reaproveite.
- Tratar sempre:
  - `loading`
  - `error`
  - `empty state`
- Exibir feedback visual:
  - Spinner ou skeleton para loading.
  - Mensagem clara para erro.
  - Mensagem amigável para estado vazio.

### 3.3. UX/Interface

- Layout **mobile-first** em todos os projetos,  
  e **mobile-only** onde especificado (ex.: app cliente Delivery Connect).
- Usar componentes de UI padronizados (botões, cards, inputs etc.).
- Padrão de mensagens:
  - Sucesso: curto e direto.  
    Ex.: `Configurações salvas com sucesso.`
  - Erro: claro, sem jargão técnico.  
    Ex.: `Não foi possível salvar. Verifique os dados e tente novamente.`

- Formulários:
  - Com validação no frontend + mensagens claras.
  - Sem “submit mudo”: sempre informar o motivo de falha.

---

## 4. Edge Functions & Backend

### 4.1. Regras de negócio no backend

- Toda lógica crítica deve existir **no backend**, mesmo que também esteja no front:
  - Cálculo de totais.
  - Aplicação de cupom.
  - Strict Mode (loja fechada).
  - Validação de permissão (owner/admin/operador/cozinha).
- Edge Functions devem:
  - Validar payload de entrada.
  - Retornar erros estruturados.
  - Nunca expor segredos ou detalhes internos de erro.

### 4.2. Padrão de erros

Formato sugerido:

```json
{
  "success": false,
  "error": {
    "code": "LOJA_FECHADA",
    "message": "A loja está fechada. Não é possível criar pedidos."
  }
}
```
O frontend usa code para tratar cenários específicos
(ex.: CUPOM_INVALIDO, LOJA_FECHADA, PERMISSAO_NEGADA).

## 5. Banco de Dados (Supabase)
### 5.1. Schema
Nomes consistentes entre:
- tabela,
- coluna,
- tipo TypeScript.

Campos obrigatórios com default quando fizer sentido (created_at, is_active, etc.).

Tabelas multi-tenant:
- org_id obrigatório, com FK para orgs.

Pergunta constante:
“Esse dado pertence a qual organização/usuário? Está protegido por RLS?”

### 5.2. Índices & Performance
Criar índices em colunas frequentemente usadas em:
- WHERE org_id = ...
- filtros por data (created_at)
- buscas por slug, code de cupom, etc.

Evitar varrer tabelas grandes sem índice.

Quando IA sugerir mudar schema:
- primeiro criar plano/migration nomeada,
- depois executar (add_coupon_columns.sql, etc.).

### 5.3. RLS (Row Level Security)
RLS sempre habilitado em tabelas com dados sensíveis ou multi-tenant.

Policies:
- SELECT: usuário só vê dados da própria org.
- INSERT/UPDATE/DELETE: apenas papéis autorizados.

Nunca confiar apenas no frontend para limitar acesso.

## 6. UX & Padrões de Produto
### 6.1. Jornadas principais
Para Delivery Connect:

Cliente:
Home → Cardápio → Carrinho → Checkout → Acompanhamento

Operação (Admin):
Status da Loja → Novo Pedido → Resumo do Dia → Alertas

Cozinha (KDS):
Fila de Pedidos → Atualização de status

### 6.2. Estados importantes
Sempre tratar:

Empty state (sem pedidos, sem produtos, sem tarefas):
- Mensagens amigáveis e opções do que fazer.

Erro de rede:
- Mensagem clara e opção “Tentar novamente”.

Loading:
- Skeleton/spinner; nunca deixar a tela “morta”.

### 6.3. Acessibilidade & Legibilidade
Bom contraste para botões e textos.
Tamanhos de fonte confortáveis, especialmente em mobile.
Área de toque adequada (mínimo ~40–48px de altura).

## 7. Git, Branches & Commits
main/master sempre estável.

Para mudanças grandes, usar branches de feature (quando possível).

Commits claros, por exemplo:
- feat: add operational alerts module
- fix: adjust RLS for orgs settings
- refactor: extract useOperationalKpis hook

Nunca subir código que quebre:
- npm run build
- npm run lint (quando existir).

## 8. Uso de IA (Antigravity, ChatGPT, Gemini)
### 8.1. Princípios
IA = assistente, não “dono do projeto”.

Para mudanças grandes:
- Sempre pedir primeiro um plano de execução/sprints.
- Só depois autorizar a execução de uma sprint específica.

Em todo prompt relevante, reforçar:
- “Não quebre padrões existentes.”
- “Respeite QUALITY_GUIDELINES.md deste projeto.”

### 8.2. Modelos de prompt
Mudança grande:
- Leia o projeto e o QUALITY_GUIDELINES.md.
- Proponha um plano de execução por sprints.
- Só depois, execute a sprint X, listando arquivos alterados.

Mudança pontual:
- “Ajuste apenas o módulo X para fazer Y, seguindo o QUALITY_GUIDELINES.md, sem alterar outras partes.”

## 9. Checklist de Qualidade antes de dar “DONE”
Antes de marcar uma feature como concluída:

- [ ] UI funciona em mobile (e desktop, se aplicável).
- [ ] Mensagens de erro e sucesso em PT-BR, claras e curtas.
- [ ] Sem console.error novo relacionado à feature.
- [ ] Chamadas de API passam pelos hooks/serviços corretos.
- [ ] Edge Functions validam payload e retornam erros estruturados.
- [ ] RLS não foi afrouxado sem necessidade.
- [ ] Se mexeu em schema:
  - [ ] Existe migration nomeada.
  - [ ] O walkthrough/documentação foi atualizado.

## 10. Evolução deste documento
Sempre que um novo padrão importante for definido, atualizar este arquivo.

Commits relacionados:
- docs: update QUALITY_GUIDELINES for <projeto>

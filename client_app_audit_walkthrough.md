# Auditoria do App Web Cliente (Delivery Connect)

## 1. Visão Geral da Arquitetura

O projeto é uma SPA (Single Page Application) construída com:
- **Framework**: React + Vite (rápido e leve).
- **Roteamento**: `react-router-dom` com `HashRouter` ( bom para PWAs/simplicidade, mas atenção a SEO se for requisito forte).
- **Estilização**: TailwindCSS (classes utilitárias).
- **Gerenciamento de Estado**: Context API (`CartContext`, `AuthContext`, `OrgContext`).
- **Backend**: Integração híbrida com Supabase:
  - **Edge Functions**: Usadas para `readdy-menu` (cardápio) e `create-order` (criação de pedido).
  - **Leitura Direta**: Usada para `fetchOrders` (lê tabela `orders` diretamente via cliente `supabase-js`).

### Estrutura de Pastas Identificada
O projeto tem uma estrutura levemente confusa na raiz, misturando arquivos de configuração com arquivos de código fonte antigos (`App.tsx` na raiz vs `src/App.tsx`). O código "vivo" parece estar em `src/`.

- `src/services/menuApi.ts`: Já consome a Edge Function `readdy-menu`.
- `src/services/orderApi.ts`: Consome `create-order`, mas faz leitura direta insegura de pedidos.
- `src/screens/CheckoutScreen.tsx`: Contém lógica de checkout com taxa de entrega hardcoded (R$ 5,00) e validação básica.

## 2. Divergências em Relação ao Backend/Painel Admin

A auditoria revelou pontos onde o cliente está desalinhado com as regras de negócio consolidadas no Admin:

| Feature | Estado no Admin (Regra Oficial) | Estado Atual no App Cliente | Risco / Ação Necessária |
| :--- | :--- | :--- | :--- |
| **Taxa de Entrega** | Calculada por bairro ou fixa configurável | **Hardcoded R$ 5,00** | **Crítico**: Prejuízo ou cobrança indevida. Precisa buscar do backend. |
| **Cupons** | Validação complexa (valor min., uso único, validade) | **Inexistente** | Implementar UI e validação via Edge Function. |
| **Status da Loja** | Bloqueia pedidos se fechada (Opening Hours) | **Não verificado** | Cliente consegue pedir com loja fechada. |
| **Histórico de Pedidos** | Filtrado por Cliente | **Busca TODOS os pedidos da loja** | **Crítico (Privacidade)**: Cliente vê pedidos de outros. Precisa filtrar por ID do usuário. |
| **Autenticação** | Auth Real / Perfil de Cliente | `LoginScreen` existe mas checkout usa dados manuais | Checkout deve pré-preencher e salvar dados no perfil do usuário seguro. |

## 3. Análise de UX e Jornada do Usuário

A jornada atual é funcional (Happy Path), mas carece de refinamento para conversão:

1.  **Entrada**: Usuário cai em `/foodtruck/home`.
2.  **Cardápio**: Carrega itens. Falta feedback visual rico (loading skeletons) durante o fetch.
3.  **Carrinho**: Funcional.
4.  **Checkout**:
    - Formulário longo e manual a cada pedido (não salva endereço).
    - Feedback de erro usa `alert()` nativo do navegador (experiência ruim).
    - Upsell (venda de bebidas) já existe, o que é ótimo!
5.  **Pós-Pedido**:
    - Redireciona para tela de sucesso.
    - Tela de "Meus Pedidos" é estática e insegura.

## 4. Plano de Execução (Sprints Recomendados)

Foco total em alinhar com o Admin e melhorar conversão.

### Sprint 1: Arquitetura, Limpeza e Segurança (Foundation)
- **Objetivo**: Limpar a estrutura de pastas e garantir que o cliente só veja SEUS dados.
- **Tarefas**:
  - Remover arquivos mortos da raiz (`screens.tsx`, `components.tsx` soltos).
  - Implementar/Refatorar `AuthContext` para usar Supabase Auth (anônimo ou OTP) de verdade.
  - Corrigir `fetchOrders` para filtrar por `user_id` ou telefone autenticado.
  - Centralizar constantes (ex: `ORG_ID` deve vir da URL/subdomínio e não .env estático para permitir multi-tenant real).

### Sprint 2: Loja Fechada & Cardápio Inteligente
- **Objetivo**: Impedir pedidos fora de hora e melhorar exibição de produtos.
- **Tarefas**:
  - Consumir status (Aberto/Fechado) do estabelecimento.
  - Bloquear botão de adicionar/checkout se fechado (com aviso claro e horário de reabertura).
  - Melhorar cards de produto (tratamento de imagem, badges de promoção).

### Sprint 3: Checkout Realista & Endereço
- **Objetivo**: Resolver o problema da taxa de entrega e salvar dados do cliente.
- **Tarefas**:
  - Remover taxa fixa de R$ 5,00.
  - Implementar lógica de taxa (pode ser via EF `calculate-cart-totals` que retorna subtotal, taxa e total).
  - Salvar endereço no perfil do usuário após compra para preenchimento automático no próximo pedido.
  - Substituir `alert()` por Toasts elegantes.

### Sprint 4: Cupons de Desconto
- **Objetivo**: Ativar funcionalidade de marketing.
- **Tarefas**:
  - Criar campo de "Inserir Cupom" no Carrinho/Checkout.
  - Integrar com tabela `coupons` (via EF para validar regras e segurança).
  - Exibir desconto aplicado nos totais.

### Sprint 5: Refinamento de UX (Acompanhamento)
- **Objetivo**: Reduzir ansiedade do cliente após o pedido.
- **Tarefas**:
  - Melhorar tela de `OrderDetail`: mostrar status com steps visuais (Recebido -> Em Preparo -> Saiu para Entrega).
  - Polling suave ou Realtime v2 para atualizar status sem recarregar página.
  - Botão de "Repetir Pedido" (conveniência).

### Sprint 6: Otimização de Conversão (CRO)
- **Objetivo**: Remover atritos finais.
- **Tarefas**:
  - Skeleton Loading screen ao abrir o app.
  - Empty States amigáveis (carrinho vazio, sem pedidos).
  - Melhorar responsividade em dispositivos muito pequenos.

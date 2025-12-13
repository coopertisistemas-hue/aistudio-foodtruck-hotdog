# Auditoria de APIs e Edge Functions

**Data:** 12/12/2025
**Objetivo:** Mapear consumo de dados e identificar código morto/duplicado.

---

## 1. Mapeamento Geral (API Client -> Backend)

| API Client File | Função | Destino (Edge Function / Tabela) | Status |
| :--- | :--- | :--- | :--- |
| `homeApi.ts` | `fetchHomeData` | `readdy-home-data` | ✅ Em uso. Traz dados da Home + Tema + Produtos. |
| `menuApi.ts` | `fetchMenu` | `get-menu` | ✅ Em uso. Cache local implementado. |
| `orderApi.ts` | `createOrderApi` | `create-order` | ✅ Em uso. Criação transacional. |
| `orderApi.ts` | `fetchOrdersApi` | Tabela `orders` (Select direto) | ✅ **Duplicidade de Busca de Pedidos**: RESOLVIDO. `CartContext` agora usa `getCustomerOrders` (wrapper da Edge Function) assim como `OrdersScreen`. `fetchOrdersApi` foi depreciado. |
| `orders.ts` | `getCustomerOrders` | `public-get-customer-orders` | ✅ **Em uso pela OrdersScreen e CartContext**. Unificado. |
| `orders.ts` | `getOrderDetail` | `public-get-order-detail` | ⚠️ Verificar uso. O front geralmente não detalha pedido via função pública, mas via ID direto. |
| `branding.ts` | *Gerenciamento de Tema* | Tabela `orgs` | ✅ Contexto de Branding. |
| `customers.ts` | `identifyCustomer` | Tabela `customers` | ✅ Identificação no checkout. |

---

## 2. Análise de Edge Functions

### `create-order` (`supabase/functions/create-order`)
- **Parâmetros**: `order`, `items`, `loyalty_amount`.
- **Validação**: Verifica `loyalty_balance` e faz transação.
- **Tabelas**: `orders` (INSERT), `order_items` (INSERT), `profiles` (UPDATE), `loyalty_transactions` (INSERT).
- **Obs**: Código de notificação (OneSignal) é Mock/Placeholder.

### `get-menu` (`supabase/functions/get-menu`)
- **Parâmetros**: `orgId`.
- **Retorno**: Categorias e Produtos.
- **Tabelas**: `categories` (SELECT), `products` (SELECT).
- **Obs**: Filtra `is_active` e `is_available` corretamente.

### `readdy-home-data` (Chamado por `homeApi.ts`)
- **Obs**: Função agregadora para a Home. Retorna estrutura complexa (Hero, Shortcuts, Categories).

---

## 3. Discrepâncias e Código Morto Identificado

### ⚠️ Duplicidade Ativa em Pedidos
Detectei que **ambas** as abordagens estão em uso:
1.  `CartContext.tsx` usa `orderApi.ts -> fetchOrdersApi` (Select Direto) para carregar pedidos na sessão.
2.  `OrdersScreen.tsx` usa `orders.ts -> getCustomerOrders` (Edge Function) para exibir lista visual.

**Risco**: Inconsistência. Se a Edge Function aplicar filtros diferentes do Select direto, o usuário vê coisas diferentes no histórico vs contexto.

### ✅ Hardcoded Tenant ID (RESOLVED)
- **Status**: Fixed. `VITE_ORG_ID_FOODTRUCK` usage removed from `homeApi`, `menuApi`, `orderApi`, and `orders.ts`.
- **Implementation**: All APIs now accept `orgId` as a parameter. Consumers (Screens/Contexts) pass `branding.id` or `org.id`.

---

## 4. Plano de Ação

1.  **Unificar Pedidos**: Recomendo migrar `OrdersScreen` para usar `orderApi.ts` e depreciar `orders.ts`. O acesso direto (com RLS) é mais rápido e consistente com o `CartContext`.
2.  **Contexto Dinâmico**: Remover dependência de `import.meta.env.VITE_ORG_ID_FOODTRUCK` dentro das APIs e passar `orgId` como parâmetro vindo do Contexto.
3.  **Limpeza**: Remover arquivos não usados em `src/lib/api` após validação de importações.

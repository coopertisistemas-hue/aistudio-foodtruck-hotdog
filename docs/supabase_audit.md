# Auditoria de Schema Supabase

**Data:** 12/12/2025
**Objetivo:** Validar consistência entre o código (App Cliente) e o banco de dados (Supabase).

---

## 1. Tabelas Críticas Analisadas

### `orgs`
- **Status**: ✅ Parcialmente Coerente.
- **Campos Encontrados**: `id`, `slug`, `name`, `accent_color`, `background_video_url`, `background_image_url` (vistos em `supabase_branding.sql`).
- **Discrepâncias**:
    - O código (`OrgContext.tsx`) espera campos como `logo_url`, `whatsapp`, `address`, `status`. É necessário confirmar se eles existem na tabela base (que não foi vista por completo nos arquivos SQL parciais, mas é referenciada).
    - **Ação Recomendada**: Verificar existência de `whatsapp` e `address` na tabela `orgs` em produção.

### `orders`
- **Status**: ⚠️ Discrepância de Tipos e FKs.
- **Definição Atual** (via `supabase_orders.sql`):
    - `id` (uuid)
    - `org_id` (text) -> ⚠️ Deveria ser UUID e FK para `public.orgs(id)`.
    - `status` (text)
    - `total` (numeric)
    - `payment_method` (text)
- **Código Espera** (`types.ts`):
    - `status`: Enum (`Recebido`, `Em Preparo`, etc). O banco usa `text`, o que é aceitável, mas sem check constraint.
    - `items`: O código junta `orders` e `order_items`.
- **Ação Recomendada**:
    - Alterar `org_id` para `uuid` com FK para `orgs(id)`.
    - Adicionar Check Constraint para `status` se possível, ou garantir validação via Edge Function.

### `order_items`
- **Status**: ⚠️ FKs Ausentes.
- **Definição Atual**:
    - `product_id` (text) -> ⚠️ Deveria ser FK para `products(id)` (se products for centralizado) ou manter text se produtos são jsonb.
    - `price` (numeric)
- **Código Espera** (`types.ts`):
    - `notes`, `quantity` (Presentes).
- **Ação Recomendada**: Validar se `product_id` deve ser chave estrangeira estrita.

### `customers` & `customer_addresses`
- **Status**: ✅ Coerente.
- **Definição Atual** (`supabase_customers.sql`):
    - `customers`: `phone` (unique), `name`.
    - `customer_addresses`: `customer_id` (FK), `street`, `number`, `label`.
- **Código Espera**: Compatível com o fluxo de checkout.

### `monetization_slots`
- **Status**: ✅ Coerente.
- **Definição Atual**: `org_id` (FK), `slot_key`, `cta_type`, `cta_value`.
- **Código Espera**: O código usa esses exatos campos para renderizar banners.

---

## 2. Pendências e Ações de Correção

Prioridade Alta:
1.  **Corrigir `orders.org_id`**: Migrar de `text` para `uuid references orgs(id)`. Isso garante integridade referencial e evita pedidos "órfãos".
2.  **Validar `orgs`**: Confirmar que colunas críticas de contato (`whatsapp`, `address`) existem no banco. Se não, criar migration.

Prioridade Média:
3.  **Padronizar `product_id`**: Decidir se `order_items.product_id` deve ser chave estrangeira estrita.
4.  **Enums no Banco**: Criar tipos `ENUM` no Postgres para `order_status` e `payment_method` para evitar strings inválidas.

---

**Conclusão**: O schema suporta a operação básica, mas a tabela `orders` está com tipagem "frouxa" (`org_id` text) que pode gerar problemas de consistência a longo prazo. O restante (Monetização, Clientes) parece sólido e alinhado com as migrations recentes.

# Auditoria de Schema Supabase

**Data:** 12/12/2025
**Objetivo:** Validar consistência entre o código (App Cliente) e o banco de dados (Supabase).

---

## 1. Tabelas Críticas Analisadas

### `orgs`
- **Status**: ✅ Resolvido (Migration Criada).
- **Campos**: `logo_url`, `whatsapp`, `address`, `status` adicionados via migration `20251213120000_schema_fixes_f3_1.sql`.
- **Status Check**: Constraint Check adicionada.

### `orders`
- **Status**: ✅ Resolvido (Migration Criada).
- **Correção**: Migration converte `org_id` de text para UUID (sanitizando slugs antigos) e adiciona FK `fk_orders_org`.
- **Status**: Mantido como text mas indexado. Validação de enum feita via aplicação/Edge Function.

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

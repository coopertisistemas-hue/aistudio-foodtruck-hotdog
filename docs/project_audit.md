# Relatório de Auditoria do Projeto: Delivery Connect

**Data do Relatório:** 12/12/2025
**Versão:** 1.0
**Contexto:** Análise da arquitetura atual do Repositório `aistudio-delivery-connect-cliente`.

---

## 1. Visão Geral da Arquitetura

O projeto é uma aplicação web **Single Page Application (SPA)** construída com **React + Vite + TypeScript**. O backend é servido primariamente pelo **Supabase** (PostgreSQL) e **Edge Functions** (Deno/Node logic) para regras de negócio complexas.

### Estrutura de Diretórios Macro
- `src/`: Código fonte do Client App (Web).
    - `pages/`: Telas principais da aplicação.
    - `context/`: Gerenciamento de estado global (Auth, Carrinho, Org).
    - `lib/api/`: Camada de serviço que comunica com Supabase e Edge Functions.
- `supabase/`: Definições de infraestrutura backend.
    - `functions/`: Código fonte das Edge Functions.
    - `migrations/`: Scripts SQL de versionamento do banco.
    - `*.sql`: Arquivos de definições de tabelas de domínio (ex: `supabase_monetization.sql`).

---

## 2. Módulo: App Web Cliente (FoodTruck HotDog)

Este é o principal artefato deste repositório. Focado na experiência do consumidor final.

### Principais Telas (`src/pages`)
| Tela | Descrição |
| :--- | :--- |
| **HomeScreen** | Dashboard do cliente. Exibe banners, categorias, produtos destaque e status da loja. |
| **MenuScreen** | Catálogo completo de produtos com filtros por categoria e busca. |
| **ProductDetailsScreen**| Detalhes do item, seleção de opcionais e adição ao carrinho. |
| **CartScreen** | Visualização de itens adicionados e subtotal. |
| **CheckoutScreen** | Finalização do pedido. Seleção de pagamento e endereço (ou retirada). |
| **OrdersScreen** | Histórico de pedidos do cliente (Abertos e Passados). |
| **ProfileScreen** | Gerenciamento de dados do usuário e endereços. |
| **WalletScreen** | Carteira digital (funcionalidade de cashback/saldo). |
| **Login/Register** | Fluxos de autenticação. |

### Gestão de Estado Global (`src/context`)
- **AppProvider (CartContext)**: O "coração" da sessão de compra. Gerencia itens no carrinho (`localStorage`), cálculo de totais e submissão do pedido.
- **OrgProvider**: Resolve a organização (loja) atual baseada na URL/Slug. Carrega dados de branding e configurações.
- **AuthProvider**: Gerencia sessão do usuário Supabase.
- **BrandingContext**: Aplica temas visuais (cores, logos) dinamicamente com base na Org.

---

## 3. Mapeamento de Backend (Edge Functions)

As Edge Functions centralizam a lógica crítica para não expor regras no frontend.

| Edge Function | Tipo | Consumidor | Tabelas Envolvidas (Leitura/Escrita) |
| :--- | :--- | :--- | :--- |
| `create-order` | Transacional | Cliente | `orders` (W), `order_items` (W), `customers` (R) |
| `get-menu` | Leitura | Cliente | `categories` (R), `products` (R), `product_options` (R) |
| `search-menu` | Busca | Cliente | `products` (R) - Busca textual |
| `get-store-home` | Agregador | Cliente | `orgs`, `banners`, `categories`, `products` (destaque) |
| `readdy-home-data` | Agregador | Cliente | *Variação do home data para App Readdy* |
| `public-get-customer-orders` | Leitura | Cliente | `orders` (R) filter by user_id |
| `admin-*` | Gestão | Admin | Funções de uso interno administrativo não expostas ao cliente final. |

---

## 4. Mapeamento de Tabelas Supabase (Principais)

Baseado nos arquivos SQL e uso do Client:

| Tabela | Propósito | Quem Usa |
| :--- | :--- | :--- |
| `orgs` | Cadastro da Loja/Estabelecimento. Configurações, slug e branding. | OrgProvider, Hooks |
| `products` | Catálogo de produtos/itens de venda. | Menu, Search, Home |
| `categories` | Categorização do cardápio. | Menu, Home |
| `orders` | Registro de pedidos realizados. | Checkout, OrdersScreen |
| `order_items` | Itens dentro de um pedido. | Checkout, OrderDetail |
| `customers` / `profiles` | Dados dos usuários finais. | Auth, Profile |
| `customer_addresses` | Endereços de entrega salvos pelo cliente. | Checkout, Profile |
| `monetization_slots` | Configuração de banners/slots patrocinados (Feature Monetização). | Home |
| `wallet_transactions` | Histórico de saldo/cashback. | WalletScreen |
| `shared_cart_items` | Itens de carrinhos compartilhados (Multi-usuário). | CartContext |

---

## 5. Pendências Técnicas Mapeadas

Pontos de atenção identificados no código:

1.  **Configuração OneSignal**: ✅ FIXED. Uses `VITE_ONESIGNAL_APP_ID` with safety check.
2.  **URLs de Review**: Em `HomeScreen.tsx`, a URL de avaliação está hardcoded ou com TODO para vir do `BrandConfig`.
3.  **Refatoração Legacy**: ✅ FIXED. `HomeScreenLegacy.tsx` removed.
4.  **Types Centralizados**: `src/types.ts` parece conter tipos compartilhados, mas algumas definições podem estar duplicadas dentro de componentes ou contexts.
5.  **Tratamento de Erros de API**: O Client confia muito nas Edge Functions (caminho feliz). Validar se tratamentos de erro (ex: falha de rede no checkout) estão robustos em todos os pontos.

---

**Conclusão:** O projeto apresenta uma arquitetura madura para uma SPA Multi-tenant, com separação clara de responsabilidades entre Client (UI/UX) e Server (Edge Functions). A infraestrutura Supabase está bem populada cobrindo os domínios essenciais de E-commerce/Delivery.

# Client Flows Audit (QA4)

## 1. Overview
This document audits the critical user journeys in the "FoodTruck HotDog" Client App, mapping frontend components to backend APIs and Supabase tables.

**Status**: ✅ Mostly Integrated
**Risk Level**: 🟡 Medium (Due to hardcoded Tenant ID in APIs)

---

## 2. Flow Mapping

### 2.1. Home Access
- **Goal**: Load organization details, branding, and active promotions.
- **Component**: `src/pages/HomeScreen.tsx`
- **Context**: `OrgContext` (fetches `org`), `BrandingContext`.
- **API Call**: `fetchHomeData()` in `src/lib/api/homeApi.ts`.
- **Backend Service**: Edge Function `readdy-home-data`.
- **Data Sources**:
    - `orgs` (via Service)
    - `categories` (via Service)
    - `hero_banners`, `shortcuts` (via Service)
- **Observations**:
    - `fetchHomeData` uses hardcoded `VITE_ORG_ID_FOODTRUCK`.
    - Tenant isolation works via `OrgContext` slug, but API defaults to env var.

### 2.2. Menu & Cart
- **Goal**: Browse products, filter by category/promo, add to cart.
- **Component**: `src/pages/MenuScreen.tsx`.
- **State**: `CartContext` (manages local `cart` array).
- **API Call**: `fetchMenu()` in `src/lib/api/menuApi.ts`.
- **Backend Service**: Edge Function `get-menu`.
- **Data Sources**: `categories`, `products`.
- **Observations**:
    - Cart persistence uses `localStorage.getItem(\`cart_${org.id}\`)`, ensuring cart isolation between tenants. ✅

### 2.3. Checkout
- **Goal**: Collect user info, address, payment method and submit order.
- **Component**: `src/pages/CheckoutScreen.tsx`.
- **API Calls**:
    - `getCustomerByPhone`, `getCustomerByAuthUserId` (`customers.ts`) -> Tables `customers`, `profiles`.
    - `getAddressesByCustomerId` (`customerAddresses.ts`) -> Table `customer_addresses`.
    - `createOrder` (`CartContext` -> `orderApi.ts`) -> Edge Function `create-order`.
- **Data Sources**: `orders`, `order_items`, `customers`, `customer_addresses`.
- **Observations**:
    - Guest flow (Phone only) and Auth flow (User ID) are handled.
    - `createOrder` sends `userId` if logged in.
    - **Risk**: `create-order` Edge Function must validate that `org_id` matches the current `org` context, currently it might rely on the payload or default env var.

### 2.4. My Orders
- **Goal**: List past orders.
- **Component**: `src/pages/OrdersScreen.tsx`.
- **API Call**: `getCustomerOrders` (`orders.ts`) -> Edge Function `public-get-customer-orders`.
    - *Note*: `CartContext` also has `fetchOrdersApi` (`orderApi.ts`) which queries `orders` table directly.
- **Data Sources**: `orders`.
- **Observations**:
    - **Duplication**: as noted in API Audit, there are two ways to fetch orders. `OrdersScreen` uses the Edge Function.
    - Identification: Uses `phone` (stored in local storage) or `user_id` to query.

### 2.5. Profile & Auth
- **Goal**: Manage personal data and addresses.
- **Component**: `src/pages/ProfileScreen.tsx`.
- **API Calls**:
    - `upsertCustomerByPhone` (`customers.ts`).
    - `createAddress`, `updateAddress`, `deleteAddress` (`customerAddresses.ts`).
- **Data Sources**: `customers`, `customer_addresses`.
- **Observations**:
    - Correctly links `auth.users.id` to `customers` table via `user_id` column.

---

## 3. Risks & Recommendations

### 🔴 Critical
- **Hardcoded API Tenant**: `homeApi.ts` and others use `import.meta.env.VITE_ORG_ID_FOODTRUCK`. This breaks multi-tenancy if the app hosts multiple slugs on the same domain without reloading environment.
    - *Fix*: Pass `org.id` from `OrgContext` into all API calls.

### 🟡 Warning
- **Order Fetching Duplication**: `CardContext` vs `OrdersScreen` usage of different APIs.
    - *Fix*: Unify on one approach (Direct Supabase RLS is often faster/simpler for simple lists, Edge Function better for complex aggregation).

### 🟢 Good Practice
- **Cart Isolation**: `cart_${org.id}` key prevents cart mixing.
- **Guest Support**: Checkout handles users without Auth account correctly (using Phone as key).

## 4. Manual Test Plan

1. **Guest Checkout**:
    - Add items as guest.
    - Checkout with new Phone/Name.
    - Verify `customers` table gets new record (or updates existing by phone).
    - Verify `orders` created.

2. **Auth Linking**:
    - Log in (OTP/Email).
    - Checkout.
    - Verify `orders.user_id` is set.
    - Verify `customers.user_id` is linked.

3. **Address Save**:
    - Go to Profile.
    - Add "Home" address.
    - Go to Checkout.
    - Verify "Home" address appears and auto-fills.

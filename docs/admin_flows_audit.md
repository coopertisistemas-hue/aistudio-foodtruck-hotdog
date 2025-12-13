# Admin Flows Audit (QA3)

## 1. Overview
This audit assesses the "Admin/Operations" capabilities within the `aistudio-delivery-connect-cliente` repository.

**Status**: 🔴 **Frontend Missing**
**Backend**: 🟢 **Edge Functions Exist**

## 2. Findings

### Frontend (Web App)
- **Search Scope**: `src/pages`, `src/components`.
- **Result**: No admin interfaces found.
    - No `/admin` routes.
    - No `Ops*` or `Admin*` components.
    - This repository is strictly the **Client App** (Customer facing).

### Backend (Edge Functions)
- **Search Scope**: `supabase/functions`.
- **Result**: Core Admin Functions exist.
    - `admin-categories`: Management of menu categories.
    - `admin-orders`: Order status updates/management.
    - `admin-products`: Product CRUD.
    - `admin-settings`: Store settings.

### Database (Supabase)
- **Tables**: Schema supports admin operations (`orgs`, `products`, `orders` with status).
- **RLS**: Admin policies likely exist (based on presence of `admin` functions), assuming use of Service Role or specific RLS checks (to be verified if Admin App is built).

## 3. Conclusion & Recommendations

The "One-App" vision (Client + Ops in same repo) mentioned in some contexts is **NOT IMPLEMENTED** in this codebase.

**Recommendation**:
1.  **Separate Repo vs Monorepo**: If the goal is a single app, Admin pages need to be scaffolded (e.g., under `/admin` route with `AdminLayout`).
2.  **Use existing Backend**: Any new Admin UI should hook into the existing `admin-*` Edge Functions.

## 4. Flow Mapping (Theoretical)

Due to missing UI, flows are mapped to *potential* implementation:

| Flow | Logic Available? (Backend) | UI Available? |
| :--- | :--- | :--- |
| **Order Management** (Kanban) | ✅ `admin-orders` (update status) | ❌ |
| **Menu Management** | ✅ `admin-products`, `admin-categories` | ❌ |
| **Store Status** | ✅ `admin-settings` (open/close) | ❌ |
| **KPIs** | ⚠️ Partial (via Database queries) | ❌ |

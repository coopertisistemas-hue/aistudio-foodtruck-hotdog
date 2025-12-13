# Multi-Org & Branding Audit (QA5)

## 1. Overview
This document audits the Multi-Establishment capability of the "Delivery Connect" client. It verifies if the application correctly isolates data, branding, and business logic based on the active Organization (Tenant).

**Status**: ⚠️ **Logic Gaps Identified**
**Risk Level**: 🔴 High (Due to Hardcoded Env & Navigation Bugs)

---

## 2. Architecture Analysis

### 2.1. Tenant Resolution (`OrgContext`)
- **Mechanism**: Parses `location.pathname` to extract the first segment as the `slug`.
- **Validation**: Checks against reserved keywords ('admin', 'sys').
- **Data Fetching**: Queries `orgs` table by `slug`.
- **Status**: ✅ Correctly implemented.

### 2.2. Branding Application (`BrandingContext`)
- **Mechanism**: Fetches styling config based on URL slug.
- **Application**: Injects CSS Variables (`--brand-primary`, etc.) to `:root`.
- **Status**: ✅ Visual isolation works. `BrandingProvider` correctly applies themes per org.

### 2.3. Monetization Slots
- **Component**: `MonetizationBanner` & `monetization.ts`.
- **Isolation**: Queries `monetization_slots` joining `orgs` on `slug`.
- **Status**: ✅ Data fetching is correctly isolated. Banners from Org A do not show on Org B.

---

## 3. Critical Findings & Risks

### 🔴 1. Hardcoded API Org ID (Critical)
- **File**: `src/lib/api/homeApi.ts` (and possibly others).
- **Issue**: `const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;`
- **Impact**: While the *UI* looks like it's multi-tenant (different colors/logos), the *Data* (categories, products, orders) is being fetched/created for the **FoodTruck ID** hardcoded in the build, regardless of the URL slug.
- **Fix**: All API clients must accept `orgId` as a parameter, passed down from `OrgContext`.

### 🔴 2. Navigation Broken via Branding ID
- **File**: `src/components/MonetizationBanner.tsx`
- **Issue**: Uses `branding.id` to construct internal routes (`/${branding.id}/menu`).
- **Context**: `branding.id` comes from the database UUID (e.g., `123e4567...`), but the Router expects a **Slug** (e.g., `foodtruck-hotdog`).
- **Impact**: Clicking a banner will likely lead to a 404 page (`/123e4567-e89b.../menu`) instead of the correct store page.
- **Fix**: `BrandingContext` (or `OrgContext`) should provide the `slug` for navigation construction.

### 🟡 3. Double Fetching
- **Issue**: `OrgContext` fetches `orgs`. `BrandingContext` also fetches `orgs` (to get colors).
- **Optimization**: `BrandingContext` should ideally consume the already-loaded `Org` from `OrgContext` to derive styles, reducing DB calls and ensuring consistency.

---

## 4. Recommendations

1.  **Refactor APIs**: Remove `import.meta.env.VITE_ORG_ID_FOODTRUCK` usages. Update `fetchHomeData`, `createOrder`, etc., to require `orgId` or `slug`.
2.  **Fix Navigation**: Update `MonetizationBanner` to use `orgSlug` (from `OrgContext`) instead of `branding.id`.
3.  **Unify Contexts**: Make `BrandingContext` listen to `OrgContext.org` changes instead of refetching data.

---

## 5. Verification Checklist

- [ ] Visit `/foodtruck-hotdog/home` -> Loads FoodTruck data/theme.
- [ ] Visit `/burgers-king/home` -> Should load distinct data/theme (currently fails Data check due to Hardcode).
- [ ] Click Banner -> Navigates to correct URL (currently fails due to UUID vs Slug).

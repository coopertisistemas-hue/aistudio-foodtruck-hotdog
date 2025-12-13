# Production Prep Checklist (P6)

## 1. Environment & Keys
- [x] **Supabase**: Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [x] **OneSignal**: Uses `VITE_ONESIGNAL_APP_ID`.
- [ ] **Payments**: No active Gateway keys found (Manual Mode).

## 2. Hardcoded / Dev Values
- [ ] **`src/App.tsx`**: `allowLocalhostAsSecureOrigin: true` should be removed or `false` for Production.
- [ ] **`src/App.tsx`**: Hardcoded link to `/#/foodtruck-hotdog/home` on root `/`. Suggest replacing with dynamic list or generic landing.
- [ ] **`src/config/brands`**: `docesdaserra.ts` uses a flaticon mock logo.
- [ ] **`src/data`**: `mockTips`, `MOCK_ORDERS` exist but appear unused in real flows (need verifying).

## 3. Debug Flags
- [ ] **`src/lib/api/orderApi.ts`**: Contains comments about "Mock API call" for ratings. Ensure feature is effectively disabled or implemented via real DB if needed.

## 4. Recommendations for Deployment
1.  **Vercel Env Vars**: Ensure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ONESIGNAL_APP_ID` are set in Vercel Project Settings.
2.  **Root Route**: The `/` route currently just links to "FoodTruck HotDog". In production, this should probably be a Saas Landing Page or redirect to a default tenant based on subdomain.
3.  **OneSignal**: Remove `allowLocalhostAsSecureOrigin` to ensure security on HTTPS.

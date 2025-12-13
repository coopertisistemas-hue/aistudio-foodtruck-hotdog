# WhatsApp Integration Audit

## Overview
This document maps all touchpoints where the application interacts with WhatsApp, ensuring that the correct organization-specific number is used and that message templates are standardized.

## Integration Points

| Location | Component / Screen | Source of Number | Message Template | Correct per Org? |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `HomeScreen` (Shortcut) | `branding.whatsappNumber` | "Olá, vim pelo app." | ✅ Yes |
| **Floating** | `WhatsAppFloatingButton` | `branding.whatsappNumber` | "Olá! Vim pelo app e gostaria de tirar uma dúvida." | ✅ Yes |
| **Order Detail** | `OrderDetailScreen` | `branding.whatsappNumber` | "Olá, gostaria de falar sobre o pedido {code/id}" | ✅ Yes |
| **Checkout** | `CheckoutScreen` | - | *Informational Text Only* ("Enviar comprovante...") | n/a |
| **Banner** | `MonetizationBanner` | `slot.action_link` | Custom (from CMS/DB) | ⚠️ Depends on DB |
| **Backend** | `readdy-home-data` | `org.whatsapp` | Returns number for Home Shortcut | ✅ Yes |

## Technical Details

### `src/lib/whatsappUtils.ts`
- **Function**: `buildWhatsAppLink({ phone, message })`
- **Logic**:
    - Cleans phone number `replace(/\D/g, '')`.
    - Encodes message `encodeURIComponent`.
    - Base URL: `https://wa.me/`.

### `HomeScreen.tsx`
- **Trigger**: Shortcut Card Click.
- **Logic**: Calls `handleWhatsApp()` which uses `branding.whatsappNumber`.
- **Note**: The shortcut data itself comes from `readdy-home-data` Edge Function, which populates the `actionPayload` with `org.whatsapp`.

### `OrderDetailScreen.tsx`
- **Trigger**: "Falar no WhatsApp" Button.
- **Logic**: Uses `branding.whatsappNumber`.
- **Message**: Dynamically inserts Order Code/ID.

### `WhatsAppFloatingButton.tsx`
- **Trigger**: Floating FAB.
- **Logic**: Uses `brand.whatsappNumber`.

## Verification Checklist
- [x] All client links use `https://wa.me/`.
- [x] All numbers are dynamically sourced from `OrgContext` / `BrandingContext`.
- [x] Message encoding is handled via `encodeURIComponent` or `whatsappUtils`.

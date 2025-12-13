# Payment Audit (P5)

## Overview
This document maps the current payment processing logic, which relies on **Manual Offline Payments** (Pix/Card on delivery or Pix via WhatsApp Proof). There is currently **no automated gateway integration** (e.g., Stripe, MercadoPago) active in the client app.

## 1. Supported Methods

| Method Key | UI Label | Flow Type | User/Operator Action |
| :--- | :--- | :--- | :--- |
| `cash_on_delivery` | "Pagar na entrega" | **Manual** | **User:** Selects at checkout.<br>**Operator:** Receives money/card machine upon delivery. |
| `pix_whatsapp` | "Pix (Enviar no WhatsApp)" | **Manual** | **User:** Selects at checkout.<br>**User:** Clicks "Falar no WhatsApp" on Success Screen to send proof.<br>**Operator:** Verifies receipt manually. |

## 2. Data Flow

### Database Schema (`orders` table)
- **`payment_method`** (text/enum): Stores the key selected by user (`cash_on_delivery`, `pix_whatsapp`).
- **`payment_status`** (text):
    - Default on creation: `pending` (implied/default).
    - **Note**: The schema does not explicitly force a default, but logic implies it starts as unpaid/pending validation.
    - **Operator Action**: Operator likely marks as "Paid" in the Admin Panel (via `ops-mark-order-paid` or `admin-orders` update).

### Frontend Logic (`CheckoutScreen.tsx`)
1.  **Selection**: User clicks one of the two option cards.
2.  **State**: `paymentMethod` state is updated.
3.  **Submission**:
    - `createOrder` is called with `paymentMethod`.
    - Payload sent to `create-order` Edge Function.
4.  **Analytics**: `complete_order` event fires with `payment_method` property.

### Backend Logic (`create-order` Edge Function)
1.  **Input**: Receives `paymentMethod` in body.
2.  **Persistence**: Inserts directly into `orders` table.
3.  **No Processing**: No external API calls are made to payment providers.

## 3. Integration Status
- **Gateways**: ❌ None (Stripe/MP code absent or inactive).
- **Callbacks/Webhooks**: ❌ None required for manual flow.

## 4. Manual Test Script

### Scenario 1: Pix via WhatsApp
1.  **Action**: Add items -> Checkout.
2.  **Selection**: Click "Pix (Enviar no WhatsApp)".
3.  **Confirm**: Click "Confirmar pedido".
4.  **Verify (Client)**:
    - Success Screen appears.
    - "Falar no WhatsApp" button is prominent.
5.  **Verify (Admin)**:
    - Order appears in Ops Dashboard.
    - Payment Method shows "Pix (Enviar no WhatsApp)".
    - Status starts as "Recebido".

### Scenario 2: Pay on Delivery
1.  **Action**: Add items -> Checkout.
2.  **Selection**: Click "Pagar na entrega".
3.  **Confirm**: Click "Confirmar pedido".
4.  **Verify (Client)**:
    - Success Screen appears.
    - Payment info shows "Pagar na entrega".
5.  **Verify (Admin)**:
    - Order appears.
    - Driver/Deliverer knows to bring machine/change.

## 5. Recommendations
- **Future**: If high volume, integrate automated Pix (Mercado Pago / Inter) to auto-update `payment_status` to `paid`.
- **Current**: Ensure Admin Panel allows toggling `payment_status` separately from `status` (Order Status).

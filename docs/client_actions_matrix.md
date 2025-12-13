# Client App Actions Matrix

| Screen | Element | Action | Route / URL | API Call (if usage) | Multi-Org Valid? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | Hero Button | Go to Menu | `/{slug}/menu` | - | ✅ Yes |
| **Home** | Shortcut: WhatsApp | Open WhatsApp | `https://wa.me/...` | - | ✅ Yes |
| **Home** | Shortcut: Avaliar | Open Generic/Link | External Link | - | ⚠️ Config Dep. |
| **Home** | Shortcut: Combos | Go to Menu (Promos) | `/{slug}/menu?filter=promos` | - | ✅ Yes |
| **Home** | Category Card | Go to Menu (Category) | `/{slug}/menu?category={id}` | - | ✅ Yes |
| **Home** | Abandoned Cart | Go to Cart | `/{slug}/cart` | - | ✅ Yes |
| **Menu** | Top Bar Icon | Go to Cart | `/{slug}/cart` | - | ✅ Yes |
| **Menu** | Product Card | Add to Cart | - | `CartContext.addToCart` | ✅ Yes |
| **Menu** | Category Tab | Filter List | - | - | - |
| **Cart** | "Ver Cardápio" | Go to Menu | `/{slug}/menu` | - | ✅ Yes |
| **Cart** | Quantidade +/- | Update Qty | - | `CartContext.updateQuantity` | n/a |
| **Cart** | "Ir para Pagamento"| Go to Checkout | `/{slug}/checkout` | - | ✅ Yes |
| **Checkout**| "Entrar" | Go to Login | `/{slug}/login` | - | ✅ Yes |
| **Checkout**| "Confirmar Pedido"| Create Order | `/{slug}/success/{id}` | `createOrder` | ✅ Yes |
| **Orders** | Order Card | View Detail | `/{slug}/orders/{id}` | - | ✅ Yes |
| **Orders** | "Ver Cardápio" | Go to Menu | `/{slug}/menu` | - | ✅ Yes |
| **Orders** | List Load | Fetch Orders | - | `getCustomerOrders({ orgId })` | ✅ Yes |
| **Detail** | "Falar no WhatsApp"| Open WhatsApp | `https://wa.me/...` | - | ✅ Yes |
| **Detail** | Page Load | Fetch Detail | - | `getOrderDetail({ orderId })` | ✅ Yes |
| **Profile** | "Entrar" | Go to Login | `/{slug}/login` | - | ✅ Yes |
| **Profile** | Save Personal Info| Upsert Customer | - | `upsertCustomerByPhone` | ✅ Yes |
| **Profile** | Save Address | Create/Update Addr | - | `createAddress`/`updateAddress` | ✅ Yes |
| **Nav** | Home Tab | Go to Home | `/{slug}/home` | - | ✅ Yes |
| **Nav** | Menu Tab | Go to Menu | `/{slug}/menu` | - | ✅ Yes |
| **Nav** | Orders Tab | Go to Orders | `/{slug}/orders` | - | ✅ Yes |
| **Nav** | Profile Tab | Go to Profile | `/{slug}/profile` | - | ✅ Yes |

## Notes
- **WhatsApp**: Uses `branding.whatsappNumber`.
- **Navigation**: All internal links use `useParams().slug` or `branding.id` (derived from context).
- **APIs**: `fetchHomeData`, `fetchMenu`, `createOrder`, `getCustomerOrders` all explicitly require or use `orgId` from context.

/**
 * Route Helpers for Multi-tenant Navigation
 * Standardizes the URI structure: /:slug/resource
 */

export const homeRoute = (slug: string) => `/${slug}/home`;
export const menuRoute = (slug: string, categoryId?: string) => categoryId ? `/${slug}/menu?category=${categoryId}` : `/${slug}/menu`;
export const productRoute = (slug: string, productId: string) => `/${slug}/product/${productId}`;
export const cartRoute = (slug: string) => `/${slug}/cart`;
export const checkoutRoute = (slug: string) => `/${slug}/checkout`;
export const successRoute = (slug: string, orderId: string) => `/${slug}/success/${orderId}`;
export const ordersRoute = (slug: string) => `/${slug}/orders`;
export const orderDetailRoute = (slug: string, orderId: string) => `/${slug}/orders/${orderId}`;
export const profileRoute = (slug: string) => `/${slug}/profile`;
export const walletRoute = (slug: string) => `/${slug}/wallet`;
export const loginRoute = (slug: string) => `/${slug}/login`;
export const registerRoute = (slug: string) => `/${slug}/register`;
export const splashRoute = (slug: string) => `/${slug}/splash`;

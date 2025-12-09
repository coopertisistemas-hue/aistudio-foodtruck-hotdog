/**
 * Central Analytics Module
 * 
 * Takes care of event tracking across the application.
 * Currently logs to console in development.
 * Designed to easily plug in Google Analytics 4 (GA4) or other providers.
 */

declare global {
    interface Window {
        gtag?: (command: string, targetId: string, config?: any) => void;
        dataLayer?: any[];
    }
}

const isDev = import.meta.env.DEV;

export const analytics = {
    /**
     * Track a generic event
     * @param name Event name (snake_case recommended, e.g. 'view_home', 'add_to_cart')
     * @param params Optional parameters
     */
    trackEvent: (name: string, params?: Record<string, any>) => {
        try {
            // 1. Log to console in Development
            if (isDev) {
                console.groupCollapsed(`📊 Analytics: ${name}`);
                console.log('Params:', params);
                console.groupEnd();
            }

            // 2. Send to GA4 (if configured)
            // Example implementation:
            // if (window.gtag) {
            //     window.gtag('event', name, params);
            // }

        } catch (error) {
            // Defensive: Analytics should never crash the app
            if (isDev) console.error('Analytics Error:', error);
        }
    },

    // Helpers for specific standard events
    trackView: (screenName: string, params?: Record<string, any>) => {
        analytics.trackEvent(`view_${screenName}`, params);
    }
};

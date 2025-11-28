import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                privacy: resolve(__dirname, 'privacy-policy.html'),
                terms: resolve(__dirname, 'terms-of-service.html'),
                cookie: resolve(__dirname, 'cookie-policy.html'),
                accessibility: resolve(__dirname, 'accessibility.html'),
                gdpr: resolve(__dirname, 'gdpr-compliance.html'),
                scanning: resolve(__dirname, 'features/receipt-scanning.html'),
                analytics: resolve(__dirname, 'features/analytics.html'),
                security: resolve(__dirname, 'features/security.html'),
            },
        },
    },
})

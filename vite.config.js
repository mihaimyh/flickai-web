import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
    // Set base to '/' for custom domain (flickai.net)
    // If deploying to https://<USERNAME>.github.io/<REPO>/, set base to '/<REPO>/'
    base: '/',
    plugins: [
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            jpg: { quality: 80 },
            webp: { quality: 80 }
        })
    ],
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
                // Spanish pages
                mainEs: resolve(__dirname, 'es/index.html'),
                scanningEs: resolve(__dirname, 'es/features/receipt-scanning.html'),
                analyticsEs: resolve(__dirname, 'es/features/analytics.html'),
                securityEs: resolve(__dirname, 'es/features/security.html'),
                // French pages
                mainFr: resolve(__dirname, 'fr/index.html'),
                scanningFr: resolve(__dirname, 'fr/features/receipt-scanning.html'),
                analyticsFr: resolve(__dirname, 'fr/features/analytics.html'),
                securityFr: resolve(__dirname, 'fr/features/security.html'),
                // Romanian pages
                mainRo: resolve(__dirname, 'ro/index.html'),
                scanningRo: resolve(__dirname, 'ro/features/receipt-scanning.html'),
                analyticsRo: resolve(__dirname, 'ro/features/analytics.html'),
                securityRo: resolve(__dirname, 'ro/features/security.html'),
            },
        },
    },
})

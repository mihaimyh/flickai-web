// Common footer for FlickAI website
document.addEventListener('DOMContentLoaded', function() {
    // Create footer elements
    const footer = document.createElement('footer');
    
    // Add footer content
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-links">
                <a href="terms-of-service.html">Terms of Service</a>
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="cookie-policy.html">Cookie Policy</a>
                <a href="accessibility.html">Accessibility</a>
                <a href="gdpr-compliance.html">GDPR</a>
            </div>
            <div class="social-icons">
                <a href="#" aria-label="FlickAI on Facebook"><svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.7c-.6 0-1.3.3-1.3.8V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/></svg></a>
                <a href="#" aria-label="FlickAI on Twitter"><svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07C18.35 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06C3.18 20.29 5.53 21 8.06 21c7.65 0 11.99-6.39 11.99-12.11 0-.18 0-.37-.01-.55.83-.6 1.54-1.35 2.11-2.2z"/></svg></a>
                <a href="#" aria-label="FlickAI on Instagram"><svg viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8c1.99 0 3.6-1.61 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25 1.25 1.25 0 0 1-1.25 1.25 1.25 1.25 0 0 1-1.25-1.25 1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 0 0 0 6a3 3 0 0 0 0-6z"/></svg></a>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 FlickAI. All rights reserved.</p>
                <p>
                    <a href="/sitemap.xml" aria-label="Sitemap">Sitemap</a> |
                    <a href="https://flickai.net" aria-label="FlickAI Website">flickai.net</a>
                </p>
            </div>
        </div>
    `;
    
    // Find the page container
    const pageContainer = document.querySelector('.page-container');
    
    if (pageContainer) {
        // If pageContainer exists, append the footer after it
        pageContainer.parentNode.insertBefore(footer, pageContainer.nextSibling);
    } else {
        // Otherwise append to body
        document.body.appendChild(footer);
    }
    
    // Add footer styles from the index page if they don't exist
    if (!document.querySelector('#footer-styles')) {
        const footerStyles = document.createElement('style');
        footerStyles.id = 'footer-styles';
        footerStyles.textContent = `
            footer {
                background-color: var(--gray-900);
                color: var(--gray-200);
                text-align: center;
                padding: 40px 20px;
                margin-top: 0;
            }
            .footer-content {
                max-width: 1100px;
                margin: 0 auto;
            }
            .footer-links {
                margin-bottom: 20px;
            }
            .footer-links a {
                color: var(--gray-200);
                text-decoration: none;
                margin: 0 10px;
                transition: color 0.3s ease;
            }
            .footer-links a:hover {
                color: var(--primary-light);
                text-decoration: underline;
            }
            .social-icons {
                margin-bottom: 20px;
            }
            .social-icons a {
                margin: 0 10px;
                display: inline-block;
            }
            .social-icons svg {
                width: 24px;
                height: 24px;
                fill: var(--gray-200);
                transition: fill 0.3s ease, transform 0.3s ease;
            }
            .social-icons a:hover svg {
                fill: var(--primary-light);
                transform: scale(1.1);
            }
            .footer-bottom p {
                margin: 5px 0;
                font-size: 0.9rem;
            }
            .footer-bottom a {
                color: var(--gray-200);
                text-decoration: none;
            }
            .footer-bottom a:hover {
                text-decoration: underline;
                color: var(--primary-light);
            }
        `;
        document.head.appendChild(footerStyles);
    }
});

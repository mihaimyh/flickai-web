// Theme Switcher for FlickAI website
document.addEventListener('DOMContentLoaded', function() {    // Function to set a specific theme
    function setTheme(themeName) {
        localStorage.setItem('flickai-theme', themeName);
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Apply specific class changes for compatibility with existing code
        if (themeName === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }

    // Function to toggle between light and dark themes
    function toggleTheme() {
        const currentTheme = localStorage.getItem('flickai-theme') || 'light';
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }    // Function to initialize theme from user preference or system preference
    function initTheme() {
        // Check if user has previously chosen a theme
        const savedTheme = localStorage.getItem('flickai-theme');
        
        if (savedTheme) {
            // If user has a saved preference, use that
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Otherwise, check for system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // System prefers dark mode
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('flickai-theme', 'dark');
            } else {
                // System prefers light mode or has no preference
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('flickai-theme', 'light');
            }
        }
        
        // Force a full repaint to ensure all styles are applied properly
        document.body.style.display = 'none';
        setTimeout(() => {
            document.body.style.display = '';
        }, 10);
    }

    // Create theme toggle button
    const createThemeToggle = function() {
        // Create the toggle button
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle light/dark theme');
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        
        // Create icon for light mode (moon)
        const darkIcon = document.createElement('span');
        darkIcon.className = 'mode-icon dark-mode-icon';
        darkIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
        </svg>`;
        
        // Create icon for dark mode (sun)
        const lightIcon = document.createElement('span');
        lightIcon.className = 'mode-icon light-mode-icon';
        lightIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        </svg>`;
        
        // Append icons to the toggle
        themeToggle.appendChild(darkIcon);
        themeToggle.appendChild(lightIcon);
        
        // Create tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'theme-toggle-tooltip';
        tooltip.textContent = 'Toggle Dark Mode';
        themeToggle.appendChild(tooltip);
        
        // Event listeners for the toggle
        themeToggle.addEventListener('click', function() {
            toggleTheme();
            updateToggleIcons();
        });
        
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
                updateToggleIcons();
            }
        });
        
        // Update toggle icons based on current theme
        function updateToggleIcons() {
            const currentTheme = localStorage.getItem('flickai-theme') || 'light';
            if (currentTheme === 'dark') {
                darkIcon.style.display = 'none';
                lightIcon.style.display = 'block';
                tooltip.textContent = 'Toggle Light Mode';
                themeToggle.classList.add('dark-active');
            } else {
                darkIcon.style.display = 'block';
                lightIcon.style.display = 'none';
                tooltip.textContent = 'Toggle Dark Mode';
                themeToggle.classList.remove('dark-active');
            }
        }
        
        // Add toggle to the page
        document.body.appendChild(themeToggle);
        
        // Set initial icon state
        updateToggleIcons();
    };
    
    // Add CSS for the theme toggle
    function addThemeToggleStyles() {
        const styleElement = document.createElement('style');
        styleElement.id = 'theme-toggle-styles';
        styleElement.textContent = `
            /* Theme toggle styles */
            .theme-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--primary-light);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 9999;
            }
            
            [data-theme="dark"] .theme-toggle {
                background-color: var(--primary-dark);
            }
            
            .theme-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
            }
            
            .theme-toggle:focus {
                outline: none;
                box-shadow: 0 0 0 3px var(--primary-light-transparent), 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            
            [data-theme="dark"] .theme-toggle:focus {
                box-shadow: 0 0 0 3px var(--primary-dark-transparent), 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            
            .mode-icon {
                color: var(--white);
                width: 24px;
                height: 24px;
                transition: all 0.3s ease;
            }
            
            .light-mode-icon {
                display: none;
            }
            
            .theme-toggle-tooltip {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--surface-light);
                color: var(--text-light);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
            }
            
            [data-theme="dark"] .theme-toggle-tooltip {
                background-color: var(--surface-dark);
                color: var(--text-dark);
            }
            
            .theme-toggle:hover .theme-toggle-tooltip {
                opacity: 1;
                visibility: visible;
            }
              /* CSS Variables for light/dark themes */
            :root {
                /* Using existing color variables from the colors.css file */
                color-scheme: light;
            }
            
            /* Apply theme styles to all relevant elements */
            [data-theme="dark"] {
                /* Dark theme */
                color-scheme: dark;
            }
            
            [data-theme="dark"] body {
                background-color: var(--background-dark);
                color: var(--text-dark);
            }
            
            [data-theme="dark"] header[role="banner"] {
                background-color: var(--primary-dark);
            }
            
            [data-theme="dark"] .feature-item {
                background-color: var(--surface-dark);
                color: var(--text-dark);
            }
            
            [data-theme="dark"] section {
                background-color: var(--background-dark);
            }
            
            [data-theme="dark"] section:nth-child(even) {
                background-color: var(--surface-dark-variant);
            }
            
            [data-theme="dark"] .container {
                background-color: transparent;
            }
            
            [data-theme="dark"] h2.section-title {
                color: var(--primary-dark);
            }
            
            [data-theme="dark"] form input[type="text"],
            [data-theme="dark"] form input[type="email"],
            [data-theme="dark"] form textarea {
                background-color: var(--surface-dark);
                color: var(--text-dark);
                border-color: var(--gray-700);
            }
            
            [data-theme="dark"] .feature-item h3 {
                color: var(--primary-dark);
            }
            
            [data-theme="dark"] .testimonial {
                background-color: var(--secondary-dark);
            }
            
            [data-theme="dark"] form button {
                background-color: var(--primary-dark);
            }
            
            [data-theme="dark"] form button:hover {
                background-color: var(--accent-dark);
            }
            
            [data-theme="dark"] .hero {
                background: linear-gradient(to right, var(--primary-dark), var(--accent-dark));
            }
            
            [data-theme="dark"] h2.section-title::after {
                background-color: var(--secondary-dark);
            }
            
            [data-theme="dark"] footer {
                background-color: var(--gray-950);
            }
            
            [data-theme="dark"] main.page-content .container {
                background-color: var(--surface-dark);
            }
            
            /* Core theme styles with transitions */
            body, header, section, .feature-item, form input, form textarea, .hero, footer, 
            main.page-content .container {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Initialize everything
    function init() {
        initTheme(); // Set initial theme
        addThemeToggleStyles(); // Add toggle styles
        createThemeToggle(); // Create the toggle button
        
        // Listen for system preference changes
        if (window.matchMedia) {
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (colorSchemeQuery.addEventListener) {
                colorSchemeQuery.addEventListener('change', (e) => {
                    // Only change if the user hasn't manually set a preference
                    if (!localStorage.getItem('flickai-theme')) {
                        if (e.matches) {
                            setTheme('dark');
                        } else {
                            setTheme('light');
                        }
                    }
                });
            }
        }
    }
    
    // Run the initialization
    init();
});

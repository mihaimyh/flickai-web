// Common header for FlickAI website
document.addEventListener('DOMContentLoaded', function() {
    // Handle all pages with a header placeholder
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const headerPlaceholder = document.querySelector('#header-placeholder');
    
    // If no placeholder exists, do nothing
    if (!headerPlaceholder) return;
    
    // Create a header with different navigation based on page type
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    
    // Use different link formats based on whether this is the index page or not
    const homeLink = isIndexPage ? '#home' : 'index.html';
    const featuresLink = isIndexPage ? '#features' : 'index.html#features';
    const aboutLink = isIndexPage ? '#about' : 'index.html#about';
    const contactLink = isIndexPage ? '#contact' : 'index.html#contact';
    
    // Create header HTML content
    header.innerHTML = `
        <div class="container">
            <nav class="navbar" aria-label="Primary Navigation">
                <a href="${homeLink}" class="logo" aria-label="FlickAI Home">
                    <img src="images/flickai-logo.jpeg" alt="FlickAI Logo" style="height: 40px; margin-right: 10px; vertical-align: middle;">
                    <span>FlickAI</span>
                </a>
                <ul class="nav-links">
                    <li><a href="${homeLink}" class="nav-link" aria-label="Home section">Home</a></li>
                    <li><a href="${featuresLink}" class="nav-link" aria-label="Features section">Features</a></li>
                    <li><a href="${aboutLink}" class="nav-link" aria-label="About section">About</a></li>
                    <li><a href="${contactLink}" class="nav-link" aria-label="Contact section">Contact</a></li>
                    <li><a href="privacy-policy.html" aria-label="Privacy Policy">Privacy</a></li>
                </ul>
            </nav>
        </div>
    `;
    
    // Replace the placeholder with the header
    headerPlaceholder.replaceWith(header);
      // Set up special behavior for index page
    if (isIndexPage) {
        setupIndexPageNav();
    } else {
        // For non-index pages, just set the active nav item
        setActiveNavItem();
    }
});

// Function specifically for index.html navigation setup
function setupIndexPageNav() {
    // Update the navbar links to make sure they work with sections
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Set up smooth scrolling for navigation links on index page
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only handle links to sections on this page (#something)
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update active class on nav links
                    document.querySelectorAll('.nav-links a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                }
            });
        }
    });
    
    // Set up scroll tracking for section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                
                if (window.pageYOffset >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href && href.substring(1) === current) {
                    link.classList.add('active');
                }
            });
            
            // Special case for Home when at very top
            if (window.pageYOffset < sections[0].offsetTop - 60) {
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('.nav-links a[href="#home"]');
                if (homeLink) homeLink.classList.add('active');
            }
        });
    }
}

// Function to set the active navigation item based on current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // For non-index pages
        if (href === currentPage || (href.includes(currentPage) && !href.includes('#'))) {
            link.classList.add('active');
        }
        
        // Special case for home page link
        if (currentPage === 'index.html' && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

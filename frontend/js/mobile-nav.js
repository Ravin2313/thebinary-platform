// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button if it doesn't exist
    const navbar = document.querySelector('.navbar .container');
    if (!navbar) return;
    
    // Check if hamburger already exists
    let hamburger = document.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insert hamburger after logo
        const logo = navbar.querySelector('.logo');
        if (logo) {
            logo.after(hamburger);
        }
    }
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    }
    
    // Close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking on a link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Close menu on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
});

console.log('Mobile Navigation - Loaded');

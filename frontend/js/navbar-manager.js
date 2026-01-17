/* ============================================
   NAVBAR MANAGER - Dynamic Menu Based on Auth State
   ============================================ */

function updateNavbar() {
    const userToken = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const adminToken = localStorage.getItem('adminToken');
    
    const navbarNav = document.getElementById('navbarNav');
    if (!navbarNav) return;
    
    const navList = navbarNav.querySelector('.navbar-nav');
    if (!navList) return;
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Clear existing nav items
    navList.innerHTML = '';
    
    // Common links for everyone
    const commonLinks = [
        { href: 'index.html', text: 'Home', pages: ['index.html', ''] },
        { href: 'projects.html', text: 'Projects', pages: ['projects.html', 'project-detail.html'] },
        { href: 'project-request.html', text: 'Request Project', pages: ['project-request.html'] },
        { href: 'contact.html', text: 'Contact', pages: ['contact.html'] }
    ];
    
    // Add common links
    commonLinks.forEach(link => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = link.href;
        a.textContent = link.text;
        
        // Set active class
        if (link.pages.includes(currentPage)) {
            a.classList.add('active');
        }
        
        li.appendChild(a);
        navList.appendChild(li);
    });
    
    // User is logged in
    if (userToken && userName) {
        // Profile link
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item';
        const profileA = document.createElement('a');
        profileA.className = 'nav-link';
        profileA.href = 'student-profile.html';
        profileA.innerHTML = `👤 ${userName}`;
        if (currentPage === 'student-profile.html') {
            profileA.classList.add('active');
        }
        profileLi.appendChild(profileA);
        navList.appendChild(profileLi);
        
        // Logout link
        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        const logoutA = document.createElement('a');
        logoutA.className = 'nav-link';
        logoutA.href = '#';
        logoutA.textContent = 'Logout';
        logoutA.onclick = function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                window.location.href = 'index.html';
            }
        };
        logoutLi.appendChild(logoutA);
        navList.appendChild(logoutLi);
    } 
    // Admin is logged in
    else if (adminToken) {
        // Admin Dashboard link
        const adminLi = document.createElement('li');
        adminLi.className = 'nav-item';
        const adminA = document.createElement('a');
        adminA.className = 'nav-link admin-link';
        adminA.href = 'admin/dashboard.html';
        adminA.textContent = '⚡ Admin Panel';
        adminLi.appendChild(adminA);
        navList.appendChild(adminLi);
        
        // Logout link
        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        const logoutA = document.createElement('a');
        logoutA.className = 'nav-link';
        logoutA.href = '#';
        logoutA.textContent = 'Logout';
        logoutA.onclick = function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminToken');
                window.location.href = '../index.html';
            }
        };
        logoutLi.appendChild(logoutA);
        navList.appendChild(logoutLi);
    }
    // No one is logged in
    else {
        // Login link
        const loginLi = document.createElement('li');
        loginLi.className = 'nav-item';
        const loginA = document.createElement('a');
        loginA.className = 'nav-link';
        loginA.href = 'student-login.html';
        loginA.textContent = 'Login';
        if (currentPage === 'student-login.html') {
            loginA.classList.add('active');
        }
        loginLi.appendChild(loginA);
        navList.appendChild(loginLi);
        
        // Register link
        const registerLi = document.createElement('li');
        registerLi.className = 'nav-item';
        const registerA = document.createElement('a');
        registerA.className = 'nav-link';
        registerA.href = 'student-register.html';
        registerA.textContent = 'Register';
        if (currentPage === 'student-register.html') {
            registerA.classList.add('active');
        }
        registerLi.appendChild(registerA);
        navList.appendChild(registerLi);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNavbar);

// Also run immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbar);
} else {
    updateNavbar();
}

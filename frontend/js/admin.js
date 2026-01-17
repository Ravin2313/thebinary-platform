// Admin JavaScript

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

// Make authenticated API call
async function adminApiCall(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
            return;
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

console.log('Admin JS Loaded');

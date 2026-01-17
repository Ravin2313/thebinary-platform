// Student authentication and features

// Check if user is logged in
function checkUserAuth() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'student-login.html';
        return false;
    }
    return true;
}

// Check if user is logged in (without redirect)
function isUserLoggedIn() {
    return !!localStorage.getItem('userToken');
}

// Get user token
function getUserToken() {
    return localStorage.getItem('userToken');
}

// Add to wishlist
async function addToWishlist(projectId) {
    if (!isUserLoggedIn()) {
        if (confirm('Please login to add projects to wishlist. Login now?')) {
            window.location.href = 'student-login.html';
        }
        return;
    }
    
    try {
        const token = getUserToken();
        const response = await fetch(`/api/users/wishlist/${projectId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Added to wishlist! ❤️', 'success');
            updateWishlistButton(projectId, true);
        } else {
            showNotification(result.message || 'Failed to add to wishlist', 'error');
        }
    } catch (error) {
        showNotification('Error adding to wishlist', 'error');
    }
}

// Remove from wishlist
async function removeFromWishlist(projectId) {
    if (!isUserLoggedIn()) return;
    
    try {
        const token = getUserToken();
        const response = await fetch(`/api/users/wishlist/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showNotification('Removed from wishlist', 'success');
            updateWishlistButton(projectId, false);
        }
    } catch (error) {
        showNotification('Error removing from wishlist', 'error');
    }
}

// Update wishlist button state
function updateWishlistButton(projectId, isInWishlist) {
    const button = document.querySelector(`[data-project-id="${projectId}"]`);
    if (button) {
        if (isInWishlist) {
            button.textContent = '❤️ In Wishlist';
            button.classList.add('in-wishlist');
            button.onclick = () => removeFromWishlist(projectId);
        } else {
            button.textContent = '🤍 Add to Wishlist';
            button.classList.remove('in-wishlist');
            button.onclick = () => addToWishlist(projectId);
        }
    }
}

// Submit review (requires login)
async function submitReview(projectId, rating, comment) {
    if (!isUserLoggedIn()) {
        if (confirm('Please login to post a review. Login now?')) {
            window.location.href = 'student-login.html';
        }
        return;
    }
    
    try {
        const token = getUserToken();
        const response = await fetch(`/api/projects/${projectId}/review`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, comment })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Review posted successfully! ⭐', 'success');
            return true;
        } else {
            showNotification(result.message || 'Failed to post review', 'error');
            return false;
        }
    } catch (error) {
        showNotification('Error posting review', 'error');
        return false;
    }
}

// Update navigation based on login status
function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    const loginLink = navLinks.querySelector('a[href="student-login.html"]');
    
    if (isUserLoggedIn()) {
        const userName = localStorage.getItem('userName') || 'Profile';
        if (loginLink) {
            loginLink.textContent = `👤 ${userName}`;
            loginLink.href = 'student-profile.html';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

console.log('Student JS Loaded');

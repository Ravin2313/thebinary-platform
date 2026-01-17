/* ============================================
   LOADING STATES & ERROR HANDLING - JavaScript
   ============================================ */

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Create toast container if not exists
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.id = 'toastContainer';
            document.body.appendChild(this.container);
        }
    }
    
    show(message, type = 'info', duration = 3000) {
        // Ensure container exists
        if (!this.container) {
            this.init();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(toast);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
        }
        
        return toast;
    }
    
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Initialize toast manager globally
let toast;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        toast = new ToastManager();
        window.toast = toast; // Make it globally accessible
        console.log('Toast Manager initialized');
    });
} else {
    toast = new ToastManager();
    window.toast = toast;
    console.log('Toast Manager initialized');
}

// Loading Spinner Component
function showLoading(container, size = 'medium', text = 'Loading...') {
    const sizeClass = size === 'small' ? 'spinner-small' : size === 'large' ? 'spinner-large' : '';
    
    const html = `
        <div class="loading-spinner">
            <div class="spinner ${sizeClass}"></div>
            ${text ? `<div class="loading-text">${text}</div>` : ''}
        </div>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.innerHTML = html;
    }
}

// Skeleton Loader Component
function showSkeleton(container, count = 3) {
    const skeletonHTML = `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text skeleton-text-short"></div>
                <div class="skeleton-tags">
                    <div class="skeleton skeleton-tag"></div>
                    <div class="skeleton skeleton-tag"></div>
                    <div class="skeleton skeleton-tag"></div>
                </div>
            </div>
        </div>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.innerHTML = skeletonHTML.repeat(count);
    }
}

// Error State Component
function showError(container, options = {}) {
    const {
        title = 'Oops! Something went wrong',
        message = 'We encountered an error while loading the content. Please try again.',
        icon = 'fa-exclamation-triangle',
        showRetry = true,
        retryCallback = null,
        showHome = true
    } = options;
    
    const html = `
        <div class="error-state">
            <div class="error-icon">
                <i class="fas ${icon}"></i>
            </div>
            <h3 class="error-title">${title}</h3>
            <p class="error-message">${message}</p>
            <div class="error-actions">
                ${showRetry ? `
                    <button class="error-btn error-btn-primary" onclick="${retryCallback ? retryCallback : 'location.reload()'}">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                ` : ''}
                ${showHome ? `
                    <a href="index.html" class="error-btn error-btn-secondary">
                        <i class="fas fa-home"></i>
                        Go Home
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.innerHTML = html;
    }
}

// Empty State Component
function showEmpty(container, options = {}) {
    const {
        title = 'No Results Found',
        message = 'We couldn\'t find any items matching your criteria.',
        icon = '📭',
        actionText = 'Browse All',
        actionLink = 'projects.html'
    } = options;
    
    const html = `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h3 class="empty-title">${title}</h3>
            <p class="empty-message">${message}</p>
            ${actionText && actionLink ? `
                <a href="${actionLink}" class="error-btn error-btn-primary">
                    ${actionText}
                </a>
            ` : ''}
        </div>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.innerHTML = html;
    }
}

// Button Loading State
function setButtonLoading(button, loading = true) {
    if (typeof button === 'string') {
        button = document.querySelector(button);
    }
    
    if (!button) return;
    
    if (loading) {
        button.classList.add('btn-loading');
        button.disabled = true;
        button.dataset.originalText = button.textContent;
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// Progress Bar
function updateProgress(container, percentage) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (!container) return;
    
    let progressBar = container.querySelector('.progress-bar-fill');
    
    if (!progressBar) {
        container.innerHTML = `
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: 0%"></div>
            </div>
        `;
        progressBar = container.querySelector('.progress-bar-fill');
    }
    
    progressBar.style.width = `${percentage}%`;
}

// Indeterminate Progress Bar
function showIndeterminateProgress(container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="progress-bar">
            <div class="progress-bar-indeterminate"></div>
        </div>
    `;
}

// Fetch with Loading & Error Handling
async function fetchWithLoading(url, options = {}) {
    const {
        loadingContainer = null,
        loadingText = 'Loading...',
        errorContainer = null,
        onSuccess = null,
        onError = null,
        showToast = true
    } = options;
    
    try {
        // Show loading
        if (loadingContainer) {
            showLoading(loadingContainer, 'medium', loadingText);
        }
        
        // Fetch data
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Success callback
        if (onSuccess) {
            onSuccess(data);
        }
        
        return { success: true, data };
        
    } catch (error) {
        console.error('Fetch error:', error);
        
        // Show error
        if (errorContainer) {
            showError(errorContainer, {
                message: error.message || 'Failed to load data. Please try again.'
            });
        }
        
        if (showToast) {
            toast.error('Failed to load data. Please try again.');
        }
        
        // Error callback
        if (onError) {
            onError(error);
        }
        
        return { success: false, error };
    }
}

// Export for use in other scripts
window.LoadingStates = {
    toast,
    showLoading,
    showSkeleton,
    showError,
    showEmpty,
    setButtonLoading,
    updateProgress,
    showIndeterminateProgress,
    fetchWithLoading
};

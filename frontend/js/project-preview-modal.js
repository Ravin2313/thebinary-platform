/* ============================================
   PROJECT PREVIEW MODAL - JavaScript
   ============================================ */

class ProjectPreviewModal {
    constructor() {
        this.modal = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }
    
    init() {
        // Create modal HTML
        this.createModal();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    createModal() {
        const modalHTML = `
            <div class="preview-modal-overlay" id="previewModal">
                <div class="preview-modal">
                    <button class="preview-close" onclick="projectPreview.close()">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="preview-modal-content">
                        <!-- Left Side - Gallery -->
                        <div class="preview-gallery">
                            <div class="preview-main-image" id="previewMainImage">
                                <img src="" alt="Project Preview">
                            </div>
                            <div class="preview-thumbnails" id="previewThumbnails">
                                <!-- Thumbnails will be inserted here -->
                            </div>
                        </div>
                        
                        <!-- Right Side - Info -->
                        <div class="preview-info" id="previewInfo">
                            <!-- Project info will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('previewModal');
    }
    
    addEventListeners() {
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open(projectData) {
        console.log('Opening preview for:', projectData);
        
        this.images = projectData.images || [];
        this.currentImageIndex = 0;
        
        // Update gallery
        this.updateGallery();
        
        // Update info
        this.updateInfo(projectData);
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateGallery() {
        const mainImage = document.querySelector('#previewMainImage img');
        const thumbnailsContainer = document.getElementById('previewThumbnails');
        
        if (this.images.length === 0) {
            mainImage.src = 'https://via.placeholder.com/800x450/21262d/58a6ff?text=No+Image';
            thumbnailsContainer.innerHTML = '';
            return;
        }
        
        // Set main image
        mainImage.src = this.images[this.currentImageIndex];
        
        // Create thumbnails
        thumbnailsContainer.innerHTML = this.images.map((img, index) => `
            <div class="preview-thumb ${index === this.currentImageIndex ? 'active' : ''}" 
                 onclick="projectPreview.changeImage(${index})">
                <img src="${img}" alt="Thumbnail ${index + 1}">
            </div>
        `).join('');
    }
    
    changeImage(index) {
        this.currentImageIndex = index;
        this.updateGallery();
    }
    
    updateInfo(project) {
        const infoContainer = document.getElementById('previewInfo');
        
        // Calculate average rating
        const avgRating = project.reviews && project.reviews.length > 0
            ? (project.reviews.reduce((sum, r) => sum + r.rating, 0) / project.reviews.length).toFixed(1)
            : 0;
        
        const reviewCount = project.reviews ? project.reviews.length : 0;
        
        infoContainer.innerHTML = `
            <div class="preview-header">
                <span class="preview-category">${project.category}</span>
                <h2 class="preview-title">${project.title}</h2>
                <div class="preview-meta">
                    ${avgRating > 0 ? `
                        <div class="preview-meta-item">
                            <i class="fas fa-star"></i>
                            <span>${avgRating} (${reviewCount} reviews)</span>
                        </div>
                    ` : ''}
                    <div class="preview-meta-item">
                        <i class="fas fa-eye"></i>
                        <span>${project.views || 0} views</span>
                    </div>
                    ${project.difficulty ? `
                        <div class="preview-meta-item">
                            <i class="fas fa-signal"></i>
                            <span>${project.difficulty}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="preview-section">
                <h3><i class="fas fa-info-circle"></i> Description</h3>
                <p class="preview-description">${project.description}</p>
            </div>
            
            ${project.features && project.features.length > 0 ? `
                <div class="preview-section">
                    <h3><i class="fas fa-list-check"></i> Key Features</h3>
                    <div class="preview-features">
                        ${project.features.slice(0, 5).map(feature => `
                            <div class="preview-feature">
                                <i class="fas fa-check-circle"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                        ${project.features.length > 5 ? `
                            <div class="preview-feature">
                                <i class="fas fa-plus-circle"></i>
                                <span>+${project.features.length - 5} more features</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${project.technologies && project.technologies.length > 0 ? `
                <div class="preview-section">
                    <h3><i class="fas fa-code"></i> Technologies</h3>
                    <div class="preview-tech-tags">
                        ${project.technologies.map(tech => `
                            <span class="preview-tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="preview-price-section">
                <div class="preview-price">₹${project.price}</div>
                <div class="preview-actions">
                    <a href="project-detail.html?id=${project._id}" class="preview-btn preview-btn-primary">
                        <i class="fas fa-eye"></i>
                        View Full Details
                    </a>
                    <a href="https://wa.me/918839540925?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(project.title)}" 
                       class="preview-btn preview-btn-secondary" 
                       target="_blank">
                        <i class="fab fa-whatsapp"></i>
                        Contact
                    </a>
                </div>
            </div>
        `;
    }
}

// Initialize preview modal
let projectPreview;
document.addEventListener('DOMContentLoaded', function() {
    projectPreview = new ProjectPreviewModal();
});

// Function to open preview (can be called from anywhere)
function openProjectPreview(projectId) {
    // Fetch project data
    fetch(`/api/projects/${projectId}`)
        .then(response => response.json())
        .then(project => {
            projectPreview.open(project);
        })
        .catch(error => {
            console.error('Error loading project:', error);
            alert('Error loading project preview. Please try again.');
        });
}

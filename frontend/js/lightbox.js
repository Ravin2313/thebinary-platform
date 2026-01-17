// Premium Lightbox Gallery - Optimized Version
class Lightbox {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.isZoomed = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isOpen = false;
        
        this.createLightbox();
        this.attachEventListeners();
    }
    
    createLightbox() {
        const lightboxHTML = `
            <div class="lightbox-overlay" id="lightbox">
                <div class="lightbox-container">
                    <button class="lightbox-close" onclick="lightbox.close()">✕</button>
                    
                    <div class="lightbox-main">
                        <img class="lightbox-image" id="lightboxImage" alt="Preview">
                        
                        <button class="lightbox-nav lightbox-prev" onclick="lightbox.prev()">‹</button>
                        <button class="lightbox-nav lightbox-next" onclick="lightbox.next()">›</button>
                        
                        <div class="lightbox-info">
                            <span class="lightbox-counter" id="lightboxCounter">1 / 1</span>
                            <div class="lightbox-actions">
                                <button class="lightbox-action-btn" onclick="lightbox.toggleZoom()" title="Zoom">🔍</button>
                                <button class="lightbox-action-btn" onclick="lightbox.download()" title="Download">⬇️</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lightbox-thumbnails" id="lightboxThumbnails"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        this.overlay = document.getElementById('lightbox');
        this.image = document.getElementById('lightboxImage');
        this.counter = document.getElementById('lightboxCounter');
        this.thumbnails = document.getElementById('lightboxThumbnails');
    }
    
    attachEventListeners() {
        // Keyboard navigation
        this.keyHandler = (e) => {
            if (!this.isOpen) return;
            
            if (e.key === 'Escape') this.close();
            else if (e.key === 'ArrowLeft') this.prev();
            else if (e.key === 'ArrowRight') this.next();
        };
        document.addEventListener('keydown', this.keyHandler);
        
        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        
        // Touch gestures
        this.image.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.image.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        // Prevent context menu
        this.image.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    open(images, startIndex = 0) {
        this.images = images;
        this.currentIndex = startIndex;
        this.isOpen = true;
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.showImage();
        this.renderThumbnails();
    }
    
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        this.isZoomed = false;
        this.image.classList.remove('zoomed');
    }
    
    showImage(direction = null) {
        // Add slide animation
        if (direction === 'next') {
            this.image.classList.remove('slide-left');
            this.image.classList.add('slide-right');
        } else if (direction === 'prev') {
            this.image.classList.remove('slide-right');
            this.image.classList.add('slide-left');
        }
        
        this.image.src = this.images[this.currentIndex];
        this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        
        // Update navigation buttons
        const prevBtn = this.overlay.querySelector('.lightbox-prev');
        const nextBtn = this.overlay.querySelector('.lightbox-next');
        
        prevBtn.classList.toggle('disabled', this.currentIndex === 0);
        nextBtn.classList.toggle('disabled', this.currentIndex === this.images.length - 1);
        
        // Update active thumbnail
        this.updateActiveThumbnail();
        
        // Reset zoom
        this.isZoomed = false;
        this.image.classList.remove('zoomed');
    }
    
    next() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.showImage('next');
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showImage('prev');
        }
    }
    
    toggleZoom() {
        this.isZoomed = !this.isZoomed;
        this.image.classList.toggle('zoomed');
    }
    
    download() {
        const link = document.createElement('a');
        link.href = this.images[this.currentIndex];
        link.download = `image-${this.currentIndex + 1}.jpg`;
        link.click();
    }
    
    renderThumbnails() {
        // Only render if multiple images
        if (this.images.length <= 1) {
            this.thumbnails.style.display = 'none';
            return;
        }
        
        this.thumbnails.style.display = 'flex';
        this.thumbnails.innerHTML = this.images.map((img, index) => `
            <div class="lightbox-thumb ${index === this.currentIndex ? 'active' : ''}" 
                 onclick="lightbox.goToImage(${index})">
                <img src="${img}" alt="Thumbnail ${index + 1}" loading="lazy">
            </div>
        `).join('');
    }
    
    updateActiveThumbnail() {
        const thumbs = this.thumbnails.querySelectorAll('.lightbox-thumb');
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
        
        // Scroll active thumbnail into view
        const activeThumb = thumbs[this.currentIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
    
    goToImage(index) {
        const direction = index > this.currentIndex ? 'next' : 'prev';
        this.currentIndex = index;
        this.showImage(direction);
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
}

// Initialize lightbox
const lightbox = new Lightbox();

// Helper function
function openProjectGallery(images, startIndex = 0) {
    lightbox.open(images, startIndex);
}

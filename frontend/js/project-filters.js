/* ============================================
   PROJECT FILTERS & SEARCH - Enhanced Discovery
   ============================================ */

let allProjects = [];
let selectedTechnologies = [];
let allTechnologies = new Set();

// Initialize filters
async function initializeFilters() {
    await loadAllProjects();
    populateTechnologyFilter();
    setupEventListeners();
    applyFilters();
}

// Load all projects
async function loadAllProjects() {
    const grid = document.getElementById('projectsGrid');
    
    try {
        // Show skeleton loading
        showSkeleton(grid, 6);
        
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        
        allProjects = await response.json();
        
        // Extract all unique technologies
        allProjects.forEach(project => {
            if (project.technologies) {
                project.technologies.forEach(tech => allTechnologies.add(tech));
            }
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showError(grid, {
            title: 'Failed to Load Projects',
            message: 'Unable to fetch projects. Please check your connection and try again.',
            retryCallback: 'initializeFilters()'
        });
    }
}

// Populate technology filter dropdown
function populateTechnologyFilter() {
    const techOptions = document.getElementById('techOptions');
    const sortedTechs = Array.from(allTechnologies).sort();
    
    techOptions.innerHTML = sortedTechs.map(tech => `
        <div class="tech-option">
            <input type="checkbox" id="tech-${tech}" value="${tech}" onchange="toggleTechnology('${tech}')">
            <label for="tech-${tech}">${tech}</label>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    
    // Difficulty filter
    document.getElementById('difficultyFilter').addEventListener('change', applyFilters);
    
    // Price range
    const priceRange = document.getElementById('priceRange');
    priceRange.addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = e.target.value;
    });
    priceRange.addEventListener('change', applyFilters);
    
    // Sort select
    document.getElementById('sortSelect').addEventListener('change', applyFilters);
    
    // Close tech dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const techContainer = document.querySelector('.tech-filter-container');
        if (techContainer && !techContainer.contains(e.target)) {
            document.getElementById('techOptions').classList.remove('show');
            document.querySelector('.tech-filter-button').classList.remove('active');
        }
    });
}

// Toggle technology dropdown
function toggleTechDropdown() {
    const dropdown = document.getElementById('techOptions');
    const button = document.querySelector('.tech-filter-button');
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
}

// Toggle technology selection
function toggleTechnology(tech) {
    const index = selectedTechnologies.indexOf(tech);
    if (index > -1) {
        selectedTechnologies.splice(index, 1);
    } else {
        selectedTechnologies.push(tech);
    }
    updateSelectedTechs();
    applyFilters();
}

// Update selected technologies display
function updateSelectedTechs() {
    const container = document.getElementById('selectedTechs');
    const button = document.querySelector('.tech-filter-button span');
    
    if (selectedTechnologies.length === 0) {
        container.innerHTML = '';
        button.textContent = 'All Technologies';
    } else {
        button.textContent = `${selectedTechnologies.length} selected`;
        container.innerHTML = selectedTechnologies.map(tech => `
            <span class="selected-tech-tag">
                ${tech}
                <button onclick="toggleTechnology('${tech}')">×</button>
            </span>
        `).join('');
    }
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'All';
    document.getElementById('difficultyFilter').value = 'All';
    document.getElementById('priceRange').value = 10000;
    document.getElementById('priceValue').textContent = '10000';
    document.getElementById('sortSelect').value = 'newest';
    
    selectedTechnologies = [];
    document.querySelectorAll('.tech-option input').forEach(cb => cb.checked = false);
    updateSelectedTechs();
    
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let filtered = [...allProjects];
    
    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            (project.technologies && project.technologies.some(tech => 
                tech.toLowerCase().includes(searchTerm)
            ))
        );
    }
    
    // Category filter
    const category = document.getElementById('categoryFilter').value;
    if (category !== 'All') {
        filtered = filtered.filter(project => project.category === category);
    }
    
    // Difficulty filter
    const difficulty = document.getElementById('difficultyFilter').value;
    if (difficulty !== 'All') {
        filtered = filtered.filter(project => 
            (project.difficulty || 'Intermediate') === difficulty
        );
    }
    
    // Technology filter
    if (selectedTechnologies.length > 0) {
        filtered = filtered.filter(project => 
            project.technologies && selectedTechnologies.some(tech => 
                project.technologies.includes(tech)
            )
        );
    }
    
    // Price filter
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    filtered = filtered.filter(project => project.price <= maxPrice);
    
    // Sort
    const sortBy = document.getElementById('sortSelect').value;
    filtered = sortProjects(filtered, sortBy);
    
    // Update results count
    document.getElementById('resultsCount').textContent = filtered.length;
    
    // Display projects
    displayProjects(filtered);
}

// Sort projects
function sortProjects(projects, sortBy) {
    const sorted = [...projects];
    
    switch(sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        case 'popular':
            return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        
        case 'rating':
            return sorted.sort((a, b) => {
                const avgA = a.reviews && a.reviews.length > 0
                    ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
                    : 0;
                const avgB = b.reviews && b.reviews.length > 0
                    ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
                    : 0;
                return avgB - avgA;
            });
        
        default:
            return sorted;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFilters);

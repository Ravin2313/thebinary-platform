// ============================================
// SPACE BACKGROUND INITIALIZATION
// Creates dynamic space elements
// ============================================

function initSpaceBackground() {
    const spaceBg = document.querySelector('.space-bg');
    if (!spaceBg) return;
    
    // Create star layers
    createStarLayers(spaceBg);
    
    // Create meteors
    createMeteors(spaceBg, 8);
    
    // Create planets
    createPlanets(spaceBg);
    
    // Create nebula clouds
    createNebulaClouds(spaceBg);
    
    // Create milky way
    createMilkyWay(spaceBg);
    
    // Create aurora
    createAurora(spaceBg);
    
    // Create distant galaxies
    createGalaxies(spaceBg, 20);
    
    // Create comets
    createComets(spaceBg, 3);
    
    console.log('🌌 Space background initialized!');
}

// Create star layers
function createStarLayers(container) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    // Small stars
    const starsSmall = document.createElement('div');
    starsSmall.className = 'stars-small';
    starsContainer.appendChild(starsSmall);
    
    // Medium stars
    const starsMedium = document.createElement('div');
    starsMedium.className = 'stars-medium';
    starsContainer.appendChild(starsMedium);
    
    // Large stars
    const starsLarge = document.createElement('div');
    starsLarge.className = 'stars-large';
    starsContainer.appendChild(starsLarge);
    
    container.appendChild(starsContainer);
}

// Create meteors
function createMeteors(container, count) {
    for (let i = 0; i < count; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.top = Math.random() * 30 + '%';
        meteor.style.left = Math.random() * 100 + '%';
        meteor.style.animationDuration = (Math.random() * 2 + 2) + 's';
        meteor.style.animationDelay = (Math.random() * 8) + 's';
        container.appendChild(meteor);
    }
}

// Create planets
function createPlanets(container) {
    const planets = [
        { class: 'planet-1', size: 80, color: '#4a90e2', top: '15%', right: '10%' },
        { class: 'planet-2', size: 60, color: '#e24a4a', bottom: '20%', left: '15%' },
        { class: 'planet-3', size: 40, color: '#e2d24a', top: '40%', left: '5%' }
    ];
    
    planets.forEach(p => {
        const planet = document.createElement('div');
        planet.className = `planet ${p.class}`;
        container.appendChild(planet);
    });
}

// Create nebula clouds
function createNebulaClouds(container) {
    const nebulas = [
        { class: 'nebula-1', size: 400, color: '#667eea', top: '10%', left: '20%' },
        { class: 'nebula-2', size: 500, color: '#764ba2', bottom: '10%', right: '20%' },
        { class: 'nebula-3', size: 350, color: '#f093fb', top: '50%', left: '50%' }
    ];
    
    nebulas.forEach(n => {
        const nebula = document.createElement('div');
        nebula.className = `nebula ${n.class}`;
        container.appendChild(nebula);
    });
}

// Create milky way
function createMilkyWay(container) {
    const milkyWay = document.createElement('div');
    milkyWay.className = 'milky-way';
    container.appendChild(milkyWay);
}

// Create aurora
function createAurora(container) {
    const aurora = document.createElement('div');
    aurora.className = 'aurora';
    container.appendChild(aurora);
}

// Create distant galaxies
function createGalaxies(container, count) {
    for (let i = 0; i < count; i++) {
        const galaxy = document.createElement('div');
        galaxy.className = 'galaxy';
        galaxy.style.top = Math.random() * 100 + '%';
        galaxy.style.left = Math.random() * 100 + '%';
        galaxy.style.animationDelay = Math.random() * 6 + 's';
        galaxy.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(galaxy);
    }
}

// Create comets
function createComets(container, count) {
    for (let i = 0; i < count; i++) {
        const comet = document.createElement('div');
        comet.className = 'comet';
        comet.style.top = Math.random() * 30 + '%';
        comet.style.left = Math.random() * 50 + '%';
        comet.style.animationDelay = (i * 3) + 's';
        comet.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(comet);
    }
}

// Add shooting star on click (Easter egg)
function addShootingStar(x, y) {
    const spaceBg = document.querySelector('.space-bg');
    if (!spaceBg) return;
    
    const star = document.createElement('div');
    star.className = 'meteor';
    star.style.top = y + 'px';
    star.style.left = x + 'px';
    star.style.animationDuration = '1.5s';
    star.style.animationDelay = '0s';
    star.style.opacity = '1';
    
    spaceBg.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 1500);
}

// Interactive shooting stars on click
document.addEventListener('click', (e) => {
    if (Math.random() > 0.7) { // 30% chance
        addShootingStar(e.clientX, e.clientY);
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpaceBackground);
} else {
    initSpaceBackground();
}

// Export for manual initialization
window.initSpaceBackground = initSpaceBackground;

console.log('🚀 Space background script loaded!');

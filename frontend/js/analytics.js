// Analytics Dashboard JavaScript
let charts = {};
let analyticsData = {};

// Initialize dashboard
async function initAnalytics() {
    await loadAnalyticsData();
    updateMetrics();
    createCharts();
    loadTopPerformers();
    animateElements();
}

// Load data from API
async function loadAnalyticsData() {
    try {
        const token = localStorage.getItem('adminToken');
        
        const [projects, users, reviews, contacts] = await Promise.all([
            fetch('/api/admin/projects', { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json()),
            fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json()),
            fetch('/api/admin/reviews', { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json()),
            fetch('/api/admin/contacts', { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json())
        ]);
        
        analyticsData = { projects, users, reviews, contacts };
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

// Update metric cards
function updateMetrics() {
    const { projects, users, reviews, contacts } = analyticsData;
    
    // Animate count up
    animateValue('totalProjects', 0, projects.length, 1000);
    animateValue('totalUsers', 0, users.length, 1000);
    animateValue('totalReviews', 0, reviews.length, 1000);
    animateValue('totalContacts', 0, contacts.length, 1000);
    
    // Calculate real growth percentages
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Projects growth
    const lastMonthProjects = projects.filter(p => new Date(p.createdAt) < thisMonth && new Date(p.createdAt) >= lastMonth).length;
    const thisMonthProjects = projects.filter(p => new Date(p.createdAt) >= thisMonth).length;
    const projectsGrowth = lastMonthProjects > 0 ? Math.round((thisMonthProjects - lastMonthProjects) / lastMonthProjects * 100) : 0;
    
    // Users growth
    const lastMonthUsers = users.filter(u => new Date(u.createdAt) < thisMonth && new Date(u.createdAt) >= lastMonth).length;
    const thisMonthUsers = users.filter(u => new Date(u.createdAt) >= thisMonth).length;
    const usersGrowth = lastMonthUsers > 0 ? Math.round((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;
    
    // Reviews growth
    const lastMonthReviews = reviews.filter(r => new Date(r.createdAt) < thisMonth && new Date(r.createdAt) >= lastMonth).length;
    const thisMonthReviews = reviews.filter(r => new Date(r.createdAt) >= thisMonth).length;
    const reviewsGrowth = lastMonthReviews > 0 ? Math.round((thisMonthReviews - lastMonthReviews) / lastMonthReviews * 100) : 0;
    
    // Contacts growth
    const lastMonthContacts = contacts.filter(c => new Date(c.createdAt) < thisMonth && new Date(c.createdAt) >= lastMonth).length;
    const thisMonthContacts = contacts.filter(c => new Date(c.createdAt) >= thisMonth).length;
    const contactsGrowth = lastMonthContacts > 0 ? Math.round((thisMonthContacts - lastMonthContacts) / lastMonthContacts * 100) : 0;
    
    // Update UI
    updateGrowthDisplay('projectsChange', projectsGrowth);
    updateGrowthDisplay('usersChange', usersGrowth);
    updateGrowthDisplay('reviewsChange', reviewsGrowth);
    updateGrowthDisplay('contactsChange', contactsGrowth);
}

function updateGrowthDisplay(elementId, growth) {
    const element = document.getElementById(elementId);
    const parent = element.parentElement;
    
    if (growth > 0) {
        element.textContent = `+${growth}%`;
        parent.classList.remove('negative');
        parent.classList.add('positive');
        parent.querySelector('.change-icon').textContent = '↗';
    } else if (growth < 0) {
        element.textContent = `${growth}%`;
        parent.classList.remove('positive');
        parent.classList.add('negative');
        parent.querySelector('.change-icon').textContent = '↘';
    } else {
        element.textContent = '0%';
        parent.classList.remove('positive', 'negative');
        parent.querySelector('.change-icon').textContent = '→';
    }
}

// Animate number counting
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Create all charts
function createCharts() {
    createUserGrowthChart();
    createCategoryChart();
    createRevenueChart();
    createRatingChart();
    createActivityChart();
}

// User Growth Chart
function createUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    
    // Generate last 30 days data with REAL user counts
    const labels = [];
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Count REAL users registered on this day
        const usersOnDay = analyticsData.users.filter(u => {
            const userDate = new Date(u.createdAt);
            userDate.setHours(0, 0, 0, 0);
            return userDate.getTime() === date.getTime();
        }).length;
        
        data.push(usersOnDay);
    }
    
    charts.userGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Users',
                data: data,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(88, 166, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 },
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Category Distribution Chart
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Count projects by category
    const categories = {};
    analyticsData.projects.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(88, 166, 255, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: 'rgba(22, 27, 34, 1)',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0aec0',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12
                }
            }
        }
    });
}

// Revenue Chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Generate last 6 months REAL data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const labels = [];
    const revenueData = [];
    const projectsData = [];
    
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        labels.push(months[monthIndex]);
        
        // Calculate REAL revenue from projects created in this month
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        
        const monthProjects = analyticsData.projects.filter(p => {
            const projectDate = new Date(p.createdAt);
            return projectDate >= monthStart && projectDate <= monthEnd;
        });
        
        const revenue = monthProjects.reduce((sum, p) => sum + (p.price || 0), 0);
        const projectCount = monthProjects.length;
        
        revenueData.push(revenue);
        projectsData.push(projectCount);
    }
    
    charts.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue (₹)',
                    data: revenueData,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    yAxisID: 'y'
                },
                {
                    label: 'Projects Added',
                    data: projectsData,
                    type: 'line',
                    borderColor: 'rgba(240, 147, 251, 1)',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#a0aec0',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += '₹' + context.parsed.y.toLocaleString('en-IN');
                                } else {
                                    label += context.parsed.y;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(88, 166, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 },
                        callback: function(value) {
                            if (value >= 1000) {
                                return '₹' + (value / 1000) + 'k';
                            }
                            return '₹' + value;
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 },
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Rating Distribution Chart
function createRatingChart() {
    const ctx = document.getElementById('ratingChart').getContext('2d');
    
    // Count reviews by rating
    const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    analyticsData.reviews.forEach(r => {
        ratings[r.rating] = (ratings[r.rating] || 0) + 1;
    });
    
    charts.rating = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
            datasets: [{
                label: 'Number of Reviews',
                data: [ratings[1], ratings[2], ratings[3], ratings[4], ratings[5]],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(102, 126, 234, 0.8)'
                ],
                borderColor: 'rgba(22, 27, 34, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(88, 166, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 11 },
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

// Activity Heatmap Chart
function createActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Count contacts by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayData = [0, 0, 0, 0, 0, 0, 0];
    
    analyticsData.contacts.forEach(c => {
        const day = new Date(c.createdAt).getDay();
        dayData[day]++;
    });
    
    charts.activity = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: days,
            datasets: [{
                label: 'Contact Requests',
                data: dayData,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(88, 166, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(88, 166, 255, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(88, 166, 255, 0.2)'
                    },
                    pointLabels: {
                        color: '#a0aec0',
                        font: { size: 12 }
                    },
                    ticks: {
                        color: '#a0aec0',
                        backdropColor: 'transparent',
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// Load top performers
function loadTopPerformers() {
    // Top projects by reviews
    const topProjects = analyticsData.projects
        .map(p => ({
            name: p.title,
            value: p.reviews.length,
            meta: `₹${p.price}`
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    
    displayTopProjects(topProjects);
    
    // Recent reviews
    const recentReviews = analyticsData.reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    displayRecentReviews(recentReviews);
}

function displayTopProjects(projects) {
    const container = document.getElementById('topProjects');
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No projects yet</p>';
        return;
    }
    
    container.innerHTML = projects.map((p, i) => `
        <div class="performer-item" style="animation-delay: ${i * 0.1}s">
            <div class="performer-rank">#${i + 1}</div>
            <div class="performer-info">
                <div class="performer-name">${p.name}</div>
                <div class="performer-meta">${p.meta}</div>
            </div>
            <div class="performer-value">${p.value} reviews</div>
        </div>
    `).join('');
}

function displayRecentReviews(reviews) {
    const container = document.getElementById('recentReviews');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No reviews yet</p>';
        return;
    }
    
    container.innerHTML = reviews.map((r, i) => `
        <div class="review-item" style="animation-delay: ${i * 0.1}s">
            <div class="review-header">
                <span class="review-user">${r.userName}</span>
                <span class="review-rating">${'⭐'.repeat(r.rating)}</span>
            </div>
            <div class="review-comment">${r.comment.substring(0, 100)}${r.comment.length > 100 ? '...' : ''}</div>
            <div class="review-project">📦 ${r.projectTitle}</div>
        </div>
    `).join('');
}

// Animate elements on scroll
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Update charts based on time range
function updateCharts() {
    // Reload data and recreate charts
    // For now, just a placeholder
    console.log('Updating charts for time range:', document.getElementById('timeRange').value);
}

// Initialize on page load
initAnalytics();

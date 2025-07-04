// AI Lead Generation Demo - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeAIVisualization();
    initializeRecommendations();
    initializeAnalytics();
    initializeAnimations();
    initializeChart();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// AI Visualization interactive features
function initializeAIVisualization() {
    const aiNodes = document.querySelectorAll('.ai-node');
    const connectionLines = document.querySelector('.connection-lines');
    
    // Animate connection lines
    animateConnectionLines();
    
    // Add hover effects and tooltips
    aiNodes.forEach((node, index) => {
        node.addEventListener('mouseenter', function() {
            // Highlight connected nodes
            highlightConnectedNodes(index);
            
            // Add pulsing effect
            this.style.animation = 'pulse 1s infinite';
        });
        
        node.addEventListener('mouseleave', function() {
            // Remove highlights
            removeHighlights();
            
            // Remove pulsing effect
            this.style.animation = '';
        });
        
        // Rotate through active states
        setTimeout(() => {
            node.classList.add('active');
            setTimeout(() => {
                node.classList.remove('active');
            }, 2000);
        }, index * 1000);
    });
}

function animateConnectionLines() {
    const lines = document.querySelectorAll('.connection-lines line');
    
    lines.forEach((line, index) => {
        // Animate stroke-dasharray for flowing effect
        line.style.strokeDasharray = '10 5';
        line.style.strokeDashoffset = '0';
        
        setInterval(() => {
            const currentOffset = parseInt(line.style.strokeDashoffset) || 0;
            line.style.strokeDashoffset = (currentOffset - 1) + 'px';
        }, 100);
    });
}

function highlightConnectedNodes(activeIndex) {
    const aiNodes = document.querySelectorAll('.ai-node');
    
    aiNodes.forEach((node, index) => {
        if (Math.abs(index - activeIndex) <= 1) {
            node.style.borderColor = '#4f46e5';
            node.style.background = 'rgba(79, 70, 229, 0.3)';
        }
    });
}

function removeHighlights() {
    const aiNodes = document.querySelectorAll('.ai-node');
    
    aiNodes.forEach(node => {
        node.style.borderColor = '';
        node.style.background = '';
    });
}

// Recommendation cards interactivity
function initializeRecommendations() {
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    const contactButtons = document.querySelectorAll('.btn-primary');
    const campaignButtons = document.querySelectorAll('.btn-secondary');
    
    // Add hover effects to recommendation cards
    recommendationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Contact button functionality
    contactButtons.forEach(button => {
        if (button.textContent.includes('Contact Now')) {
            button.addEventListener('click', function() {
                showNotification('Initiating AI-powered outreach sequence...', 'success');
                
                // Simulate AI processing
                setTimeout(() => {
                    showNotification('Personalized email generated and sent!', 'success');
                }, 2000);
            });
        }
    });
    
    // Campaign button functionality
    campaignButtons.forEach(button => {
        if (button.textContent.includes('Add to Campaign')) {
            button.addEventListener('click', function() {
                showNotification('Lead added to AI nurturing campaign', 'info');
            });
        }
    });
}

// Analytics real-time updates
function initializeAnalytics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    // Simulate real-time updates
    setInterval(() => {
        metricValues.forEach(metric => {
            if (metric.textContent.includes(',')) {
                // Update lead count
                const currentValue = parseInt(metric.textContent.replace(',', ''));
                const newValue = currentValue + Math.floor(Math.random() * 5);
                metric.textContent = newValue.toLocaleString();
            } else if (metric.textContent.includes('%')) {
                // Update percentage values
                const currentValue = parseFloat(metric.textContent);
                const change = (Math.random() - 0.5) * 0.2;
                const newValue = Math.max(0, Math.min(100, currentValue + change));
                metric.textContent = newValue.toFixed(1) + '%';
            } else if (metric.textContent.includes('$')) {
                // Update revenue
                const currentValue = parseInt(metric.textContent.replace('$', '').replace('K', ''));
                const newValue = currentValue + Math.floor(Math.random() * 3);
                metric.textContent = '$' + newValue + 'K';
            }
        });
    }, 5000);
}

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.recommendation-card, .analytics-card, .feature-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Chart initialization (placeholder)
function initializeChart() {
    const chartContainer = document.querySelector('.chart-container');
    
    if (chartContainer) {
        // Create a simple animated chart placeholder
        chartContainer.innerHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 1rem;">
                    <i class="fas fa-chart-line" style="font-size: 3rem; color: #4f46e5;"></i>
                </div>
                <h3 style="margin-bottom: 0.5rem;">Performance Chart</h3>
                <p>Interactive analytics dashboard would be displayed here</p>
                <div style="margin-top: 2rem;">
                    <div class="chart-bars" style="display: flex; align-items: end; justify-content: center; gap: 1rem; height: 150px;">
                        ${generateChartBars()}
                    </div>
                </div>
            </div>
        `;
        
        // Animate chart bars
        animateChartBars();
    }
}

function generateChartBars() {
    const bars = [];
    const heights = [60, 80, 45, 90, 70, 85, 95];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    heights.forEach((height, index) => {
        bars.push(`
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="chart-bar" style="
                    width: 30px;
                    height: ${height}px;
                    background: linear-gradient(to top, #4f46e5, #7c3aed);
                    border-radius: 4px 4px 0 0;
                    margin-bottom: 0.5rem;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.8s ease ${index * 0.1}s;
                "></div>
                <span style="font-size: 0.75rem; color: #6b7280;">${labels[index]}</span>
            </div>
        `);
    });
    
    return bars.join('');
}

function animateChartBars() {
    setTimeout(() => {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            bar.style.transform = 'scaleY(1)';
        });
    }, 500);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// CTA button functionality
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Start Free Trial') {
        showNotification('Free trial signup would be initiated here', 'info');
    } else if (e.target.textContent === 'Schedule Demo') {
        showNotification('Demo scheduling interface would open here', 'info');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .chart-bar:hover {
        filter: brightness(1.2);
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Simulate AI processing indicators
function simulateAIProcessing() {
    const aiNodes = document.querySelectorAll('.ai-node');
    
    setInterval(() => {
        const randomNode = aiNodes[Math.floor(Math.random() * aiNodes.length)];
        randomNode.classList.add('active');
        
        setTimeout(() => {
            randomNode.classList.remove('active');
        }, 1500);
    }, 3000);
}

// Initialize AI processing simulation
simulateAIProcessing();

// Add loading states for buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        if (this.textContent.includes('Contact') || this.textContent.includes('Add to')) {
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic confidence score updates
setInterval(() => {
    const confidenceScores = document.querySelectorAll('.confidence-score');
    
    confidenceScores.forEach(score => {
        const currentValue = parseInt(score.textContent);
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(50, Math.min(99, currentValue + change));
        score.textContent = newValue + '% Match';
    });
}, 10000);

console.log('AI Lead Generation Demo initialized successfully!');


// Portal JavaScript - Integrated Authentication and Data Management

class PortalApp {
    constructor() {
        this.user = null;
        this.leads = [];
        this.analytics = {};
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        // Show loading screen
        this.showLoading();
        
        try {
            // Check authentication
            await this.checkAuth();
            
            // Load initial data
            await this.loadDashboardData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading screen
            this.hideLoading();
            
        } catch (error) {
            console.error('Portal initialization failed:', error);
            this.redirectToLogin();
        }
    }

    async checkAuth() {
        try {
            const response = await fetch('/.auth/me');
            const authData = await response.json();
            
            if (authData.clientPrincipal) {
                this.user = authData.clientPrincipal;
                this.updateUserInfo();
            } else {
                throw new Error('Not authenticated');
            }
        } catch (error) {
            throw new Error('Authentication check failed');
        }
    }

    updateUserInfo() {
        const userName = this.user.userDetails || this.user.userId || 'User';
        const userEmail = this.user.claims?.find(c => c.typ === 'emails')?.val || '';
        
        // Update header
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-email').textContent = userEmail;
        document.getElementById('welcome-name').textContent = userName.split(' ')[0] || 'User';
        
        // Update avatar
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('user-avatar').textContent = initials;
    }

    async loadDashboardData() {
        try {
            // Load leads data
            const leadsResponse = await fetch('/api/leads');
            if (leadsResponse.ok) {
                const leadsData = await leadsResponse.json();
                this.leads = leadsData.leads || [];
                this.updateLeadsCount();
                this.renderRecentLeads();
            }

            // Load analytics data
            const analyticsResponse = await fetch('/api/analytics');
            if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                this.analytics = analyticsData;
                this.updateDashboardStats();
            }

            // Load activity data
            this.renderActivityFeed();

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            // Use mock data if API fails
            this.loadMockData();
        }
    }

    loadMockData() {
        // Mock leads data
        this.leads = [
            {
                id: 1,
                name: "Sarah Johnson",
                company: "TechCorp Solutions",
                title: "CTO",
                email: "sarah.j@techcorp.com",
                priority: "high",
                score: 95,
                industry: "Technology",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Mike Chen",
                company: "Digital Marketing Hub",
                title: "VP Marketing",
                email: "mike@dmhub.com",
                priority: "medium",
                score: 78,
                industry: "Marketing",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Alex Rodriguez",
                company: "StartupXYZ",
                title: "Founder",
                email: "alex@startupxyz.com",
                priority: "low",
                score: 62,
                industry: "Startup",
                createdAt: new Date().toISOString()
            }
        ];

        // Mock analytics data
        this.analytics = {
            totalLeads: 156,
            conversionRate: 18.9,
            revenueGenerated: 12500,
            averageScore: 4.2,
            monthlyGrowth: {
                leads: 23,
                conversion: 5.2,
                revenue: 31,
                score: 0.3
            }
        };

        this.updateLeadsCount();
        this.updateDashboardStats();
        this.renderRecentLeads();
        this.renderActivityFeed();
    }

    updateLeadsCount() {
        const leadsCount = this.leads.length;
        document.getElementById('leads-count').textContent = leadsCount;
    }

    updateDashboardStats() {
        const stats = this.analytics;
        
        document.getElementById('stat-leads').textContent = stats.totalLeads || 0;
        document.getElementById('stat-conversion').textContent = (stats.conversionRate || 0) + '%';
        document.getElementById('stat-revenue').textContent = '$' + (stats.revenueGenerated || 0).toLocaleString();
        document.getElementById('stat-rating').textContent = (stats.averageScore || 0).toFixed(1);

        // Update growth indicators
        const growth = stats.monthlyGrowth || {};
        document.getElementById('stat-leads-change').textContent = `+${growth.leads || 0}% from last month`;
        document.getElementById('stat-conversion-change').textContent = `+${growth.conversion || 0}% from last month`;
        document.getElementById('stat-revenue-change').textContent = `+${growth.revenue || 0}% from last month`;
        document.getElementById('stat-rating-change').textContent = `+${growth.score || 0} from last month`;
    }

    renderRecentLeads() {
        const container = document.getElementById('recent-leads-list');
        const recentLeads = this.leads.slice(0, 4); // Show top 4 leads

        if (recentLeads.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No leads available yet.</p>';
            return;
        }

        container.innerHTML = recentLeads.map(lead => `
            <div class="lead-item">
                <div class="lead-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="lead-info">
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-company">${lead.company} - ${lead.title}</div>
                </div>
                <div class="lead-priority priority-${lead.priority}">${lead.priority} Priority</div>
            </div>
        `).join('');
    }

    renderActivityFeed() {
        const container = document.getElementById('activity-feed');
        const activities = [
            {
                icon: 'user-plus',
                text: 'New lead added: TechCorp Solutions',
                time: '2 hours ago'
            },
            {
                icon: 'envelope',
                text: 'Email sent to Digital Marketing Hub',
                time: '4 hours ago'
            },
            {
                icon: 'phone',
                text: 'Call scheduled with StartupXYZ',
                time: '6 hours ago'
            },
            {
                icon: 'chart-bar',
                text: 'Weekly report generated',
                time: '1 day ago'
            },
            {
                icon: 'bullhorn',
                text: 'New campaign launched: Tech Companies',
                time: '2 days ago'
            }
        ];

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    renderLeadsList() {
        const container = document.getElementById('leads-list');
        
        if (this.leads.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 p-8">No leads available yet.</p>';
            return;
        }

        container.innerHTML = this.leads.map(lead => `
            <div class="lead-item">
                <div class="lead-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="lead-info">
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-company">${lead.company} - ${lead.title}</div>
                    <div class="lead-email">${lead.email}</div>
                    <div class="lead-score">Score: ${lead.score}/100</div>
                </div>
                <div class="lead-priority priority-${lead.priority}">${lead.priority} Priority</div>
                <div class="lead-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactLead(${lead.id})">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="viewLead(${lead.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                }
            });
        });

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactForm();
            });
        }

        // Filters
        const priorityFilter = document.getElementById('priority-filter');
        const industryFilter = document.getElementById('industry-filter');
        const searchInput = document.getElementById('search-leads');

        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => this.filterLeads());
        }
        if (industryFilter) {
            industryFilter.addEventListener('change', () => this.filterLeads());
        }
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterLeads());
        }
    }

    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;

        // Load page-specific data
        if (pageId === 'leads') {
            this.renderLeadsList();
        } else if (pageId === 'analytics') {
            this.renderAnalytics();
        }
    }

    filterLeads() {
        const priority = document.getElementById('priority-filter')?.value || '';
        const industry = document.getElementById('industry-filter')?.value || '';
        const search = document.getElementById('search-leads')?.value.toLowerCase() || '';

        let filteredLeads = this.leads;

        if (priority) {
            filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
        }

        if (industry) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.industry.toLowerCase() === industry.toLowerCase()
            );
        }

        if (search) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.name.toLowerCase().includes(search) ||
                lead.company.toLowerCase().includes(search) ||
                lead.email.toLowerCase().includes(search)
            );
        }

        // Update the display with filtered leads
        this.renderFilteredLeads(filteredLeads);
    }

    renderFilteredLeads(leads) {
        const container = document.getElementById('leads-list');
        
        if (leads.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 p-8">No leads match your filters.</p>';
            return;
        }

        container.innerHTML = leads.map(lead => `
            <div class="lead-item">
                <div class="lead-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="lead-info">
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-company">${lead.company} - ${lead.title}</div>
                    <div class="lead-email">${lead.email}</div>
                    <div class="lead-score">Score: ${lead.score}/100</div>
                </div>
                <div class="lead-priority priority-${lead.priority}">${lead.priority} Priority</div>
                <div class="lead-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactLead(${lead.id})">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="viewLead(${lead.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAnalytics() {
        // Simple analytics visualization
        const performanceChart = document.getElementById('performance-chart');
        if (performanceChart) {
            // In a real implementation, you would use Chart.js or similar
            performanceChart.innerHTML = '<p class="text-center text-gray-500">Analytics charts will be displayed here</p>';
        }
    }

    async saveProfile() {
        const formData = {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            company: document.getElementById('profile-company').value,
            industry: document.getElementById('profile-industry').value
        };

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('Profile updated successfully!', 'success');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            this.showNotification('Failed to update profile. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1000);
    }

    redirectToLogin() {
        window.location.href = '/.auth/login/aad';
    }
}

// Global functions for button actions
window.contactLead = function(leadId) {
    const lead = app.leads.find(l => l.id === leadId);
    if (lead) {
        window.open(`mailto:${lead.email}?subject=Lead Generation Inquiry&body=Hello ${lead.name},%0D%0A%0D%0AI hope this email finds you well...`);
    }
};

window.viewLead = function(leadId) {
    const lead = app.leads.find(l => l.id === leadId);
    if (lead) {
        alert(`Lead Details:\n\nName: ${lead.name}\nCompany: ${lead.company}\nTitle: ${lead.title}\nEmail: ${lead.email}\nScore: ${lead.score}/100\nPriority: ${lead.priority}`);
    }
};

window.exportLeads = function() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Company,Title,Email,Priority,Score\n"
        + app.leads.map(lead => 
            `"${lead.name}","${lead.company}","${lead.title}","${lead.email}","${lead.priority}",${lead.score}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.showPage = function(pageId) {
    app.showPage(pageId);
};

// Initialize the portal app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PortalApp();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    min-width: 300px;
    animation: slideIn 0.3s ease;
}

.notification-success {
    border-left: 4px solid #059669;
}

.notification-error {
    border-left: 4px solid #dc2626;
}

.notification-info {
    border-left: 4px solid #4f46e5;
}

.notification-content {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #64748b;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);


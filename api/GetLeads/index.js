module.exports = async function (context, req) {
    // Get user info from Static Web Apps authentication
    const clientPrincipal = req.headers['x-ms-client-principal'];
    
    if (!clientPrincipal) {
        context.res = {
            status: 401,
            body: { error: "Unauthorized" }
        };
        return;
    }

    try {
        const user = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString());
        const userId = user.userId;

        // Mock lead data (replace with database query in production)
        const mockLeads = [
            {
                id: 1,
                name: "Sarah Johnson",
                company: "TechCorp Solutions",
                title: "CTO",
                email: "sarah.j@techcorp.com",
                phone: "+1 (555) 123-4567",
                priority: "high",
                score: 95,
                industry: "Technology",
                source: "LinkedIn",
                status: "new",
                notes: "Interested in AI solutions for their development team",
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                lastContact: null
            },
            {
                id: 2,
                name: "Mike Chen",
                company: "Digital Marketing Hub",
                title: "VP Marketing",
                email: "mike@dmhub.com",
                phone: "+1 (555) 234-5678",
                priority: "medium",
                score: 78,
                industry: "Marketing",
                source: "Google Ads",
                status: "contacted",
                notes: "Looking to improve lead generation ROI",
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                name: "Alex Rodriguez",
                company: "StartupXYZ",
                title: "Founder",
                email: "alex@startupxyz.com",
                phone: "+1 (555) 345-6789",
                priority: "low",
                score: 62,
                industry: "Startup",
                source: "Referral",
                status: "qualified",
                notes: "Early stage startup, budget constraints",
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                name: "Lisa Wang",
                company: "Manufacturing Plus",
                title: "Operations Director",
                email: "lisa@mfgplus.com",
                phone: "+1 (555) 456-7890",
                priority: "high",
                score: 88,
                industry: "Manufacturing",
                source: "Trade Show",
                status: "proposal",
                notes: "Needs automation for supply chain management",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                lastContact: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 5,
                name: "David Kim",
                company: "FinTech Innovations",
                title: "Head of Product",
                email: "david@fintechinno.com",
                phone: "+1 (555) 567-8901",
                priority: "medium",
                score: 71,
                industry: "Financial",
                source: "Content Marketing",
                status: "demo_scheduled",
                notes: "Interested in AI for fraud detection",
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        // In production, filter leads by userId from database
        const userLeads = mockLeads;

        // Apply filters if provided
        let filteredLeads = userLeads;
        
        if (req.query.priority) {
            filteredLeads = filteredLeads.filter(lead => lead.priority === req.query.priority);
        }
        
        if (req.query.industry) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.industry.toLowerCase() === req.query.industry.toLowerCase()
            );
        }
        
        if (req.query.status) {
            filteredLeads = filteredLeads.filter(lead => lead.status === req.query.status);
        }

        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            filteredLeads = filteredLeads.filter(lead => 
                lead.name.toLowerCase().includes(searchTerm) ||
                lead.company.toLowerCase().includes(searchTerm) ||
                lead.email.toLowerCase().includes(searchTerm)
            );
        }

        // Sort by score (highest first) and creation date
        filteredLeads.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: {
                leads: filteredLeads,
                total: filteredLeads.length,
                user: user.userDetails || user.userId,
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        context.log.error('Error in GetLeads function:', error);
        
        context.res = {
            status: 500,
            body: { 
                error: "Internal server error",
                message: "Failed to retrieve leads"
            }
        };
    }
};


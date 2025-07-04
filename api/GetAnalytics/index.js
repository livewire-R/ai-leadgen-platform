module.exports = async function (context, req) {
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
        
        // Mock analytics data (replace with database queries in production)
        const currentDate = new Date();
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        
        const analytics = {
            // Current month stats
            totalLeads: 156,
            conversionRate: 18.9,
            revenueGenerated: 12500,
            averageScore: 4.2,
            
            // Growth compared to last month
            monthlyGrowth: {
                leads: 23,
                conversion: 5.2,
                revenue: 31,
                score: 0.3
            },
            
            // Lead breakdown by priority
            leadsByPriority: {
                high: 42,
                medium: 78,
                low: 36
            },
            
            // Lead breakdown by industry
            leadsByIndustry: {
                technology: 45,
                marketing: 32,
                finance: 28,
                manufacturing: 25,
                healthcare: 18,
                other: 8
            },
            
            // Lead breakdown by source
            leadsBySources: {
                linkedin: 65,
                google_ads: 38,
                content_marketing: 28,
                referrals: 15,
                trade_shows: 10
            },
            
            // Conversion funnel
            conversionFunnel: {
                leads: 156,
                contacted: 124,
                qualified: 89,
                proposal: 45,
                closed: 23
            },
            
            // Performance over time (last 30 days)
            dailyPerformance: Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                return {
                    date: date.toISOString().split('T')[0],
                    leads: Math.floor(Math.random() * 10) + 2,
                    conversions: Math.floor(Math.random() * 3) + 1,
                    revenue: Math.floor(Math.random() * 2000) + 500
                };
            }),
            
            // Top performing campaigns
            topCampaigns: [
                {
                    name: "LinkedIn Tech Executives",
                    leads: 45,
                    conversions: 12,
                    conversionRate: 26.7,
                    cost: 1200,
                    roi: 340
                },
                {
                    name: "Google Ads - Manufacturing",
                    leads: 32,
                    conversions: 8,
                    conversionRate: 25.0,
                    cost: 800,
                    roi: 280
                },
                {
                    name: "Content Marketing - Finance",
                    leads: 28,
                    conversions: 6,
                    conversionRate: 21.4,
                    cost: 400,
                    roi: 450
                }
            ],
            
            // Recent activity summary
            recentActivity: {
                newLeadsToday: 8,
                emailsSent: 23,
                callsScheduled: 5,
                proposalsSent: 3,
                dealsWon: 1
            },
            
            // Goals and targets
            monthlyTargets: {
                leads: 200,
                conversions: 40,
                revenue: 20000
            },
            
            // Progress towards goals (percentage)
            goalProgress: {
                leads: 78, // 156/200 * 100
                conversions: 57.5, // 23/40 * 100
                revenue: 62.5 // 12500/20000 * 100
            }
        };

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: {
                ...analytics,
                user: user.userDetails || user.userId,
                generatedAt: new Date().toISOString(),
                period: {
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
                    end: currentDate.toISOString()
                }
            }
        };

    } catch (error) {
        context.log.error('Error in GetAnalytics function:', error);
        
        context.res = {
            status: 500,
            body: { 
                error: "Internal server error",
                message: "Failed to retrieve analytics"
            }
        };
    }
};


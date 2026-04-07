import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAnalytics } from '../api';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        in_progress: 0,
        urgent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAnalytics();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 15000);
        return () => clearInterval(interval);
    }, []);

    const cards = [
        {
            title: "Total Cases Reported",
            value: stats.total,
            icon: BarChart3,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20"
        },
        {
            title: "Cases In Progress",
            value: stats.in_progress,
            icon: Activity,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/20"
        },
        {
            title: "Cases Resolved",
            value: stats.resolved,
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-400/10",
            border: "border-green-400/20"
        },
        {
            title: "Urgent Priority",
            value: stats.urgent,
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-400/10",
            border: "border-red-400/20"
        }
    ];

    if (loading && stats.total === 0) {
        return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-8 h-full flex flex-col overflow-hidden relative custom-scrollbar overflow-y-auto">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40 z-0"></div>

            <header className="flex justify-between items-end mb-10 relative z-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-primary" />
                        Platform Analytics
                    </h2>
                    <p className="text-subText">Real-time overview of support cases and responses.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                {cards.map((card, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={card.title}
                        className={`glass-panel p-6 border ${card.border} hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden`}
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bg} blur-xl`}></div>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-subText font-medium">{card.title}</h3>
                            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white tracking-tight">{card.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Resolution Rate Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 glass-panel p-8 border border-white/5 relative z-10 flex-1 grid place-items-center"
            >
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Resolution Rate</h3>
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surfaceHighlight" />
                            <circle 
                                cx="96" cy="96" r="88" 
                                stroke="currentColor" 
                                strokeWidth="12" 
                                fill="transparent" 
                                strokeDasharray={2 * Math.PI * 88}
                                strokeDashoffset={2 * Math.PI * 88 * (1 - (stats.total > 0 ? stats.resolved / stats.total : 0))}
                                className="text-primary transition-all duration-1000 ease-out" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute text-3xl font-bold text-white">
                            {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                        </div>
                    </div>
                    <p className="text-subText mt-6 max-w-sm mx-auto">
                        Percentage of total reported cases that have been successfully resolved by associated NGOs.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;

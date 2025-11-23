'use client';

import { BarChart3, ArrowUpRight, ArrowDownRight, Users, Eye, MousePointerClick, Clock } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl font-bold text-slate-900">Analytics Overview</h1>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-sm font-medium text-slate-900">7 Days</button>
                    <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium">30 Days</button>
                    <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium">90 Days</button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Impressions', value: '124.5K', change: '+12.5%', trend: 'up', icon: Eye },
                    { label: 'Engagement Rate', value: '4.2%', change: '+0.8%', trend: 'up', icon: MousePointerClick },
                    { label: 'New Followers', value: '1,203', change: '-2.1%', trend: 'down', icon: Users },
                    { label: 'Best Time to Post', value: '10:00 AM', sub: 'Wednesdays', icon: Clock },
                ].map((metric, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                                <metric.icon className="w-5 h-5" />
                            </div>
                            {metric.change && (
                                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {metric.change}
                                </div>
                            )}
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1">{metric.label}</h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
                            {metric.sub && <span className="text-sm text-slate-400">{metric.sub}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Engagement Growth</h3>
                        <button className="text-sm text-primary font-medium hover:underline">View Details</button>
                    </div>
                    <div className="h-64 flex items-end justify-between space-x-2 px-2">
                        {[35, 45, 30, 60, 75, 50, 65, 80, 70, 85, 90, 60].map((h, i) => (
                            <div key={i} className="w-full bg-blue-50 rounded-t-md relative group cursor-pointer">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600"
                                    style={{ height: `${h}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {h * 100} views
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Top Performing Posts</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-slate-200 rounded-md shrink-0 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                        5 Tips for Better Productivity in 2025
                                    </p>
                                    <div className="flex items-center mt-1 space-x-3 text-xs text-slate-500">
                                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> 1.2k</span>
                                        <span className="flex items-center"><MousePointerClick className="w-3 h-3 mr-1" /> 4.5%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        View All Posts
                    </button>
                </div>
            </div>
        </div>
    );
}

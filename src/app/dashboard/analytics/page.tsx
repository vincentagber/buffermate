'use client';

import { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Eye,
    MousePointerClick,
    Clock,
    ChevronDown,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    Youtube,
    Video,
    Share2,
    Layers,
    Download,
} from 'lucide-react';

interface PlatformOption {
    id: string;
    label: string;
    icon: any;
    color: string;
}

const PLATFORM_OPTIONS: PlatformOption[] = [
    { id: 'all', label: 'All Channels', icon: Layers, color: 'text-blue-600' },
    { id: 'x', label: 'Only X (Twitter)', icon: Twitter, color: 'text-slate-900' },
    { id: 'linkedin', label: 'Only LinkedIn', icon: Linkedin, color: 'text-[#0077b5]' },
    { id: 'instagram', label: 'Only Instagram', icon: Instagram, color: 'text-[#e1306c]' },
    { id: 'facebook', label: 'Only Facebook', icon: Facebook, color: 'text-[#1877f2]' },
    { id: 'tiktok', label: 'Only TikTok', icon: Video, color: 'text-slate-900' },
    { id: 'youtube', label: 'Only YouTube', icon: Youtube, color: 'text-[#FF0000]' },
];

interface PlatformData {
    metrics: Array<{
        label: string;
        value: string;
        change?: string;
        trend?: 'up' | 'down';
        sub?: string;
        icon: any;
    }>;
    chartValues: number[];
    posts: Array<{
        title: string;
        views: string;
        rate: string;
        date: string;
    }>;
}

const ANALYTICS_BY_PLATFORM: Record<string, PlatformData> = {
    all: {
        metrics: [
            { label: 'Total Impressions', value: '124.5K', change: '+12.5%', trend: 'up', icon: Eye },
            { label: 'Engagement Rate', value: '4.2%', change: '+0.8%', trend: 'up', icon: MousePointerClick },
            { label: 'New Followers', value: '1,203', change: '-2.1%', trend: 'down', icon: Users },
            { label: 'Best Time to Post', value: '10:00 AM', sub: 'Wednesdays', icon: Clock },
        ],
        chartValues: [35, 45, 30, 60, 75, 50, 65, 80, 70, 85, 90, 60],
        posts: [
            { title: '5 Tips for Better Productivity in 2025', views: '1.2k', rate: '4.5%', date: 'Yesterday' },
            { title: 'Behind the scenes of our latest product update', views: '980', rate: '3.9%', date: '3 days ago' },
            { title: 'The ultimate guide to creator workflow automation', views: '2.4k', rate: '5.1%', date: '5 days ago' },
        ],
    },
    x: {
        metrics: [
            { label: 'Tweet Impressions', value: '68.2K', change: '+18.4%', trend: 'up', icon: Eye },
            { label: 'Engagement Rate', value: '3.6%', change: '+0.4%', trend: 'up', icon: MousePointerClick },
            { label: 'New Followers', value: '542', change: '+5.2%', trend: 'up', icon: Users },
            { label: 'Best Time to Post', value: '9:30 AM', sub: 'Weekdays', icon: Clock },
        ],
        chartValues: [40, 55, 45, 70, 85, 60, 75, 92, 80, 88, 95, 78],
        posts: [
            { title: '🚀 Thread: 7 lessons learned building an AI content pipeline in public', views: '4.1k', rate: '6.2%', date: 'Today' },
            { title: 'Why short feedback loops beat complex planning every single time', views: '2.8k', rate: '4.7%', date: '2 days ago' },
            { title: 'Top tools every solo creator needs to bookmark in 2025', views: '1.9k', rate: '3.8%', date: '4 days ago' },
        ],
    },
    linkedin: {
        metrics: [
            { label: 'Post Impressions', value: '42.1K', change: '+9.3%', trend: 'up', icon: Eye },
            { label: 'Engagement Rate', value: '5.8%', change: '+1.2%', trend: 'up', icon: MousePointerClick },
            { label: 'New Connections', value: '390', change: '+8.0%', trend: 'up', icon: Users },
            { label: 'Best Time to Post', value: '8:00 AM', sub: 'Tuesdays & Thursdays', icon: Clock },
        ],
        chartValues: [25, 38, 48, 55, 62, 70, 68, 79, 82, 85, 88, 92],
        posts: [
            { title: 'How we streamlined cross-platform publishing for B2B brands', views: '3.3k', rate: '6.8%', date: 'Yesterday' },
            { title: '3 counter-intuitive leadership lessons from scaling creator workflows', views: '2.1k', rate: '5.4%', date: '3 days ago' },
            { title: 'Announcing our strategic partnership with automated publishing tools', views: '1.7k', rate: '4.9%', date: 'Last week' },
        ],
    },
    instagram: {
        metrics: [
            { label: 'Reach & Views', value: '38.9K', change: '+14.1%', trend: 'up', icon: Eye },
            { label: 'Engagement Rate', value: '4.9%', change: '+0.5%', trend: 'up', icon: MousePointerClick },
            { label: 'New Followers', value: '410', change: '+3.1%', trend: 'up', icon: Users },
            { label: 'Best Time to Post', value: '6:30 PM', sub: 'Fridays & Sundays', icon: Clock },
        ],
        chartValues: [30, 42, 50, 48, 65, 72, 80, 85, 78, 90, 86, 94],
        posts: [
            { title: 'Carousel: Visual anatomy of high-performing carousel hooks', views: '2.9k', rate: '5.7%', date: 'Yesterday' },
            { title: 'Reel: 30-second studio workflow transformation', views: '5.2k', rate: '7.1%', date: '4 days ago' },
            { title: 'Story highlights & aesthetic asset guide for design creators', views: '1.4k', rate: '4.2%', date: '6 days ago' },
        ],
    },
    facebook: {
        metrics: [
            { label: 'Page Reach', value: '18.4K', change: '-1.4%', trend: 'down', icon: Eye },
            { label: 'Engagement Rate', value: '3.1%', change: '+0.2%', trend: 'up', icon: MousePointerClick },
            { label: 'Page Likes', value: '115', change: '-0.8%', trend: 'down', icon: Users },
            { label: 'Best Time to Post', value: '1:00 PM', sub: 'Thursdays', icon: Clock },
        ],
        chartValues: [22, 28, 35, 40, 38, 45, 52, 48, 50, 54, 49, 46],
        posts: [
            { title: 'Community poll: Which content format gives you the highest ROI?', views: '1.1k', rate: '3.9%', date: '3 days ago' },
            { title: 'Weekly roundup of creator growth benchmarks and strategies', views: '890', rate: '2.8%', date: '5 days ago' },
            { title: 'Full video walkthrough: Setting up scheduled multi-platform campaigns', views: '1.3k', rate: '3.4%', date: '1 week ago' },
        ],
    },
    tiktok: {
        metrics: [
            { label: 'Video Views', value: '89.6K', change: '+32.8%', trend: 'up', icon: Eye },
            { label: 'Completion Rate', value: '18.5%', change: '+2.4%', trend: 'up', icon: MousePointerClick },
            { label: 'Followers Gained', value: '870', change: '+15.3%', trend: 'up', icon: Users },
            { label: 'Best Time to Post', value: '7:00 PM', sub: 'Evenings', icon: Clock },
        ],
        chartValues: [30, 45, 60, 50, 75, 90, 85, 95, 92, 98, 94, 99],
        posts: [
            { title: 'POV: Scheduling 30 days of content in under 5 minutes with AI', views: '28.4k', rate: '9.4%', date: '2 days ago' },
            { title: 'The secret prompt template nobody talks about for script hooks', views: '19.1k', rate: '8.1%', date: '4 days ago' },
            { title: 'Stop posting at random times — look at your analytics tab right now', views: '14.6k', rate: '7.5%', date: '6 days ago' },
        ],
    },
    youtube: {
        metrics: [
            { label: 'Channel Views', value: '45.2K', change: '+16.7%', trend: 'up', icon: Eye },
            { label: 'Avg View Duration', value: '4m 12s', change: '+12.0%', trend: 'up', icon: MousePointerClick },
            { label: 'Subscribers', value: '312', change: '+8.4%', trend: 'up', icon: Users },
            { label: 'Best Time to Post', value: '3:00 PM', sub: 'Saturdays', icon: Clock },
        ],
        chartValues: [28, 34, 42, 48, 56, 64, 72, 80, 84, 88, 91, 95],
        posts: [
            { title: 'Shorts: 3 AI tools that will replace manual social schedulers', views: '12.8k', rate: '6.9%', date: 'Yesterday' },
            { title: 'Full Guide: How to build a high-conversion social media calendar', views: '6.4k', rate: '5.8%', date: '3 days ago' },
            { title: 'Case Study: From 0 to 100k impressions using cross-posting automations', views: '4.2k', rate: '5.1%', date: '1 week ago' },
        ],
    },
};

export default function AnalyticsPage() {
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
    const [timeframe, setTimeframe] = useState<'7' | '30' | '90'>('7');
    const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeOption = PLATFORM_OPTIONS.find((p) => p.id === selectedPlatform) || PLATFORM_OPTIONS[0];
    const data = ANALYTICS_BY_PLATFORM[selectedPlatform] || ANALYTICS_BY_PLATFORM.all;
    const IconComponent = activeOption.icon;

    // Format chart data for Recharts
    const chartData = useMemo(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return data.chartValues.map((val, idx) => {
            const impressions = Math.round(val * 125);
            const engagements = Math.round(impressions * 0.052);
            return {
                name: monthNames[idx] || `M${idx + 1}`,
                impressions,
                engagements,
                reach: Math.round(impressions * 0.78),
            };
        });
    }, [data.chartValues]);

    const handleDownloadCSV = () => {
        const lines: string[] = [];

        // Meta headers
        lines.push(`"Report","Analytics Overview"`);
        lines.push(`"Channel","${activeOption.label}"`);
        lines.push(`"Timeframe","Last ${timeframe} Days"`);
        lines.push(`"Generated At","${new Date().toISOString()}"`);
        lines.push('');

        // Section 1: Key Performance Metrics
        lines.push('"Section","Key Performance Metrics"');
        lines.push('"Metric","Value","Change / Subtext"');
        data.metrics.forEach((m) => {
            const detail = m.change ? `${m.change} (${m.trend === 'up' ? 'Increase' : 'Decrease'})` : (m.sub || '');
            lines.push(`"${m.label}","${m.value}","${detail}"`);
        });
        lines.push('');

        // Section 2: Engagement Growth Breakdown
        lines.push('"Section","Monthly Engagement Growth"');
        lines.push('"Month","Estimated Impressions","Estimated Reach","Estimated Engagements"');
        chartData.forEach((row) => {
            lines.push(`"${row.name}","${row.impressions}","${row.reach}","${row.engagements}"`);
        });
        lines.push('');

        // Section 3: Top Performing Posts
        lines.push('"Section","Top Performing Posts"');
        lines.push('"Post Title","Views","Engagement Rate","Date"');
        data.posts.forEach((p) => {
            const cleanTitle = p.title.replace(/"/g, '""');
            lines.push(`"${cleanTitle}","${p.views}","${p.rate}","${p.date}"`);
        });

        const csvContent = lines.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const sanitizedPlatform = selectedPlatform.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const dateStr = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `buffermate_analytics_${sanitizedPlatform}_${timeframe}d_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header with Title, Platform Filter, and Timeframe Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900">Analytics Overview</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Performance metrics for{' '}
                        <span className="font-medium text-slate-800">{activeOption.label}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Platform Filter Dropdown */}
                    <div className="relative">
                        <label htmlFor="platform-filter-select" className="sr-only">
                            Filter by Platform
                        </label>
                        <button
                            id="platform-filter-button"
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2.5 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                        >
                            <IconComponent className={`w-4 h-4 ${activeOption.color}`} />
                            <span>{activeOption.label}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setIsDropdownOpen(false)}
                                    aria-hidden="true"
                                />
                                <div
                                    id="platform-dropdown-menu"
                                    role="listbox"
                                    className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden animate-[fade-in_0.15s_ease-out]"
                                >
                                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        Filter By Platform
                                    </div>
                                    {PLATFORM_OPTIONS.map((option) => {
                                        const ItemIcon = option.icon;
                                        const isSelected = option.id === selectedPlatform;
                                        return (
                                            <button
                                                key={option.id}
                                                id={`filter-option-${option.id}`}
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    setSelectedPlatform(option.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-50/70 text-blue-700 font-medium'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0">
                                                        <ItemIcon className={`w-3.5 h-3.5 ${option.color}`} />
                                                    </div>
                                                    <span className="truncate">{option.label}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200" role="group" aria-label="Timeframe selector">
                        <button
                            id="timeframe-7-days"
                            onClick={() => setTimeframe('7')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                timeframe === '7'
                                    ? 'bg-white shadow-sm text-slate-900'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            7 Days
                        </button>
                        <button
                            id="timeframe-30-days"
                            onClick={() => setTimeframe('30')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                timeframe === '30'
                                    ? 'bg-white shadow-sm text-slate-900'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            30 Days
                        </button>
                        <button
                            id="timeframe-90-days"
                            onClick={() => setTimeframe('90')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                timeframe === '90'
                                    ? 'bg-white shadow-sm text-slate-900'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            90 Days
                        </button>
                    </div>

                    {/* Download CSV Button */}
                    <button
                        id="download-analytics-csv-button"
                        type="button"
                        onClick={handleDownloadCSV}
                        className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                        title="Download current analytics as CSV"
                    >
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Active Platform Banner if specific platform chosen */}
            {selectedPlatform !== 'all' && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-blue-100 flex items-center justify-center">
                            <IconComponent className={`w-4 h-4 ${activeOption.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Filtering: {activeOption.label}
                            </p>
                            <p className="text-xs text-slate-500">
                                Showing insights and top posts published through this specific channel.
                            </p>
                        </div>
                    </div>
                    <button
                        id="reset-platform-filter"
                        onClick={() => setSelectedPlatform('all')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                    >
                        Reset to All Channels
                    </button>
                </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.metrics.map((metric, i) => (
                    <div key={i} id={`metric-card-${i}`} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                                <metric.icon className="w-5 h-5" />
                            </div>
                            {metric.change && (
                                <div
                                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                                        metric.trend === 'up'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                    }`}
                                >
                                    {metric.trend === 'up' ? (
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3 mr-1" />
                                    )}
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

            {/* Charts & Top Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900">Engagement Growth</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Historical trend for {activeOption.label}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                                    <button
                                        id="chart-type-bar"
                                        type="button"
                                        onClick={() => setChartType('bar')}
                                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                            chartType === 'bar'
                                                ? 'bg-white text-slate-900 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        Bar
                                    </button>
                                    <button
                                        id="chart-type-area"
                                        type="button"
                                        onClick={() => setChartType('area')}
                                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                            chartType === 'area'
                                                ? 'bg-white text-slate-900 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        Area
                                    </button>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
                                    Impressions
                                </span>
                            </div>
                        </div>

                        {/* Recharts Container */}
                        <div className="h-64 w-full" id="engagement-growth-recharts">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const impressions = payload[0]?.value;
                                                    const engagements = payload[0]?.payload?.engagements;
                                                    return (
                                                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-800">
                                                            <p className="font-semibold text-slate-200 mb-1">{label}</p>
                                                            <div className="space-y-1">
                                                                <p className="flex items-center justify-between gap-4 text-blue-300">
                                                                    <span>Impressions:</span>
                                                                    <span className="font-bold text-white">{Number(impressions).toLocaleString()}</span>
                                                                </p>
                                                                <p className="flex items-center justify-between gap-4 text-emerald-300">
                                                                    <span>Engagements:</span>
                                                                    <span className="font-bold text-white">{Number(engagements).toLocaleString()}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            dataKey="impressions"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={36}
                                        />
                                    </BarChart>
                                ) : (
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const impressions = payload[0]?.value;
                                                    const engagements = payload[0]?.payload?.engagements;
                                                    return (
                                                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-800">
                                                            <p className="font-semibold text-slate-200 mb-1">{label}</p>
                                                            <div className="space-y-1">
                                                                <p className="flex items-center justify-between gap-4 text-blue-300">
                                                                    <span>Impressions:</span>
                                                                    <span className="font-bold text-white">{Number(impressions).toLocaleString()}</span>
                                                                </p>
                                                                <p className="flex items-center justify-between gap-4 text-emerald-300">
                                                                    <span>Engagements:</span>
                                                                    <span className="font-bold text-white">{Number(engagements).toLocaleString()}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="impressions"
                                            stroke="#2563eb"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorImpressions)"
                                        />
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Top Performing Posts</h3>
                            <span className="text-xs font-medium text-slate-400">{data.posts.length} posts</span>
                        </div>
                        <div className="space-y-4">
                            {data.posts.map((post, i) => (
                                <div
                                    key={i}
                                    id={`top-post-${i}`}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group border border-slate-100"
                                >
                                    <div className="w-10 h-10 bg-slate-100 rounded-md shrink-0 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center mt-1.5 space-x-3 text-xs text-slate-500">
                                            <span className="flex items-center">
                                                <Eye className="w-3 h-3 mr-1 text-slate-400" /> {post.views}
                                            </span>
                                            <span className="flex items-center">
                                                <MousePointerClick className="w-3 h-3 mr-1 text-slate-400" /> {post.rate}
                                            </span>
                                            <span className="text-slate-400">· {post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        id="view-all-channel-posts"
                        className="w-full mt-6 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>View All {activeOption.label} Posts</span>
                    </button>
                </div>
            </div>
        </div>
    );
}


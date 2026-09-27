'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PostSchedulerModal from '../components/PostSchedulerModal';
import SimulatorModal from '../components/SimulatorModal';
import { triggerConfetti } from '@/components/ui/Confetti';
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
    Sparkles,
    Check,
    Zap,
    ShieldCheck,
    Crown,
    Flame,
    TrendingUp,
    Target,
    BarChart3,
    CheckCircle2,
    X,
    Lock
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
            { title: '5 Tips for Better Productivity in 2026', views: '1.2k', rate: '4.5%', date: 'Yesterday' },
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
            { title: 'Top tools every solo creator needs to bookmark in 2026', views: '1.9k', rate: '3.8%', date: '4 days ago' },
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
    const router = useRouter();
    const supabase = createClient();
    
    // Layout state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Analytics state
    const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
    const [timeframe, setTimeframe] = useState<'7' | '30' | '90'>('7');
    const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'agency'>('pro');

    const activeOption = PLATFORM_OPTIONS.find((p) => p.id === selectedPlatform) || PLATFORM_OPTIONS[0];
    const data = ANALYTICS_BY_PLATFORM[selectedPlatform] || ANALYTICS_BY_PLATFORM.all;
    const IconComponent = activeOption.icon;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

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

    const handleSelectPlan = (plan: 'free' | 'pro' | 'agency') => {
        setCurrentPlan(plan);
        setIsUpgradeModalOpen(false);
        triggerConfetti();
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#1E293B] overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar
                currentTab="post-manager"
                onSelectTab={(tab) => {
                    if (tab === 'overview') router.push('/dashboard');
                    else router.push(`/dashboard?tab=${tab}`);
                }}
                onOpenCreateModal={() => setIsPostModalOpen(true)}
                onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
                onSignOut={handleSignOut}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ${
                    isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
                }`}
            >
                {/* Header */}
                <Header
                    currentTab="analytics"
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    onOpenPostModal={() => setIsPostModalOpen(true)}
                    onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />

                {/* Content Body */}
                <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Header with Title, Platform Filter, and Timeframe Selector */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center space-x-2.5">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">Analytics & Audience Intelligence</h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                                    Pro Tier
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                                Performance benchmarks, viral hook engagement, and audience metrics for{' '}
                                <span className="font-bold text-[#1E293B]">{activeOption.label}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Platform Filter Dropdown */}
                            <div className="relative">
                                <button
                                    id="platform-filter-button"
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-[#E2D9CF] rounded-2xl text-xs font-bold text-[#1E293B] shadow-2xs hover:bg-[#FAF6F0] transition-colors"
                                >
                                    <IconComponent className={`w-3.5 h-3.5 ${activeOption.color}`} />
                                    <span>{activeOption.label}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div
                                            id="platform-dropdown-menu"
                                            className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E2D9CF] rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden animate-fade-in"
                                        >
                                            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#F5EFE8]">
                                                Filter By Platform
                                            </div>
                                            {PLATFORM_OPTIONS.map((option) => {
                                                const ItemIcon = option.icon;
                                                const isSelected = option.id === selectedPlatform;
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setSelectedPlatform(option.id);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                                                            isSelected
                                                                ? 'bg-[#FFF0E6] text-[#E05A2B] font-bold'
                                                                : 'text-[#475569] hover:bg-[#FAF6F0]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-2.5">
                                                            <div className="w-5 h-5 rounded-md bg-[#FAF6F0] flex items-center justify-center shrink-0">
                                                                <ItemIcon className={`w-3.5 h-3.5 ${option.color}`} />
                                                            </div>
                                                            <span>{option.label}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#E05A2B]"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Timeframe Selector */}
                            <div className="flex bg-[#FCFAF7] p-1 rounded-2xl border border-[#E2D9CF]">
                                <button
                                    onClick={() => setTimeframe('7')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                        timeframe === '7'
                                            ? 'bg-white shadow-xs text-[#E05A2B]'
                                            : 'text-[#64748B] hover:text-[#1E293B]'
                                    }`}
                                >
                                    7D
                                </button>
                                <button
                                    onClick={() => setTimeframe('30')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                        timeframe === '30'
                                            ? 'bg-white shadow-xs text-[#E05A2B]'
                                            : 'text-[#64748B] hover:text-[#1E293B]'
                                    }`}
                                >
                                    30D
                                </button>
                                <button
                                    onClick={() => setTimeframe('90')}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                        timeframe === '90'
                                            ? 'bg-white shadow-xs text-[#E05A2B]'
                                            : 'text-[#64748B] hover:text-[#1E293B]'
                                    }`}
                                >
                                    90D
                                </button>
                            </div>

                            {/* Download CSV Button */}
                            <button
                                type="button"
                                onClick={handleDownloadCSV}
                                className="flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-[#E2D9CF] rounded-2xl text-xs font-bold text-[#1E293B] shadow-2xs hover:bg-[#FAF6F0] transition-colors"
                                title="Download current analytics as CSV"
                            >
                                <Download className="w-3.5 h-3.5 text-[#64748B]" />
                                <span>Export CSV</span>
                            </button>

                            {/* Pro Upgrade Button */}
                            <button
                                type="button"
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-[#F06535] to-[#E05A2B] text-white rounded-2xl text-xs font-bold shadow-xs hover:opacity-95 transition-all"
                            >
                                <Crown className="w-3.5 h-3.5 text-amber-200" />
                                <span>View Pro Plans</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Platform Banner */}
                    {selectedPlatform !== 'all' && (
                        <div className="bg-[#FFF8F4] border border-[#FED7AA] rounded-2xl px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#FED7AA] flex items-center justify-center">
                                    <IconComponent className={`w-4 h-4 ${activeOption.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#1E293B]">
                                        Filtered to: {activeOption.label}
                                    </p>
                                    <p className="text-[11px] text-[#64748B]">
                                        Showing verified engagement, comments, and lead conversions published via this channel.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPlatform('all')}
                                className="text-xs font-bold text-[#E05A2B] hover:underline px-2 py-1"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.metrics.map((metric, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-9 h-9 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] flex items-center justify-center">
                                        <metric.icon className="w-4 h-4" />
                                    </div>
                                    {metric.change && (
                                        <div
                                            className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                metric.trend === 'up'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}
                                        >
                                            {metric.trend === 'up' ? (
                                                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                                            )}
                                            {metric.change}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-[#64748B]">{metric.label}</h3>
                                    <div className="flex items-baseline space-x-2 mt-0.5">
                                        <span className="text-2xl font-bold text-[#1E293B]">{metric.value}</span>
                                        {metric.sub && <span className="text-xs font-medium text-[#94A3B8]">{metric.sub}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts & Top Posts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border-2 border-dashed border-[#CBD5E1] shadow-xs flex flex-col justify-between min-w-0">
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-[#1E293B]">Audience Reach & Impressions Trend</h3>
                                        <p className="text-xs text-[#64748B] mt-0.5">
                                            Calculated monthly metrics for {activeOption.label}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex bg-[#FCFAF7] p-0.5 rounded-xl border border-[#E2D9CF] text-xs">
                                            <button
                                                type="button"
                                                onClick={() => setChartType('bar')}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    chartType === 'bar'
                                                        ? 'bg-white text-[#E05A2B] shadow-2xs'
                                                        : 'text-[#64748B] hover:text-[#1E293B]'
                                                }`}
                                            >
                                                Bar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setChartType('area')}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    chartType === 'area'
                                                        ? 'bg-white text-[#E05A2B] shadow-2xs'
                                                        : 'text-[#64748B] hover:text-[#1E293B]'
                                                }`}
                                            >
                                                Area
                                            </button>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E05A2B] mr-1.5"></span>
                                            Impressions
                                        </span>
                                    </div>
                                </div>

                                {/* Recharts Container */}
                                <div className="h-64 sm:h-72 w-full min-w-0" id="engagement-growth-recharts">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {chartType === 'bar' ? (
                                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
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
                                                                <div className="bg-[#1E293B] text-white p-3.5 rounded-2xl shadow-2xl text-xs border border-neutral-700 animate-fade-in">
                                                                    <p className="font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                                                                        <span>{label} 2026</span>
                                                                        <span className="text-[10px] text-[#E05A2B] bg-[#FFF0E6] px-1.5 py-0.2 rounded font-mono">Live</span>
                                                                    </p>
                                                                    <div className="space-y-1.5">
                                                                        <p className="flex items-center justify-between gap-4 text-blue-300">
                                                                            <span>Impressions:</span>
                                                                            <span className="font-bold text-white">{Number(impressions).toLocaleString()}</span>
                                                                        </p>
                                                                        <p className="flex items-center justify-between gap-4 text-emerald-400">
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
                                                    fill="#E05A2B"
                                                    radius={[6, 6, 0, 0]}
                                                    maxBarSize={36}
                                                />
                                            </BarChart>
                                        ) : (
                                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#E05A2B" stopOpacity={0.35} />
                                                        <stop offset="95%" stopColor="#E05A2B" stopOpacity={0.0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
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
                                                                <div className="bg-[#1E293B] text-white p-3.5 rounded-2xl shadow-2xl text-xs border border-neutral-700 animate-fade-in">
                                                                    <p className="font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                                                                        <span>{label} 2026</span>
                                                                        <span className="text-[10px] text-[#E05A2B] bg-[#FFF0E6] px-1.5 py-0.2 rounded font-mono">Live</span>
                                                                    </p>
                                                                    <div className="space-y-1.5">
                                                                        <p className="flex items-center justify-between gap-4 text-blue-300">
                                                                            <span>Impressions:</span>
                                                                            <span className="font-bold text-white">{Number(impressions).toLocaleString()}</span>
                                                                        </p>
                                                                        <p className="flex items-center justify-between gap-4 text-emerald-400">
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
                                                    stroke="#E05A2B"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorImpressions)"
                                                />
                                            </AreaChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Top Performing Posts Card */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-dashed border-[#CBD5E1] shadow-xs flex flex-col justify-between min-w-0">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-[#1E293B]">Top Performing Posts</h3>
                                    <span className="text-xs font-bold text-[#E05A2B]">{data.posts.length} posts</span>
                                </div>
                                <div className="space-y-3">
                                    {data.posts.map((post, i) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-2xl bg-[#FCFAF7] border border-[#F1E9DF] hover:border-[#FED7AA] hover:bg-[#FFFBF8] transition-all cursor-pointer group space-y-1.5"
                                        >
                                            <div className="flex items-start space-x-2.5">
                                                <div className="w-7 h-7 rounded-xl bg-white border border-[#E2D9CF] flex items-center justify-center text-[#E05A2B] shrink-0">
                                                    <IconComponent className="w-3.5 h-3.5" />
                                                </div>
                                                <p className="text-xs font-bold text-[#1E293B] group-hover:text-[#E05A2B] transition-colors line-clamp-2">
                                                    {post.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 pl-9">
                                                <span className="flex items-center font-semibold">
                                                    <Eye className="w-3 h-3 mr-1 text-[#94A3B8]" /> {post.views} views
                                                </span>
                                                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                                                    {post.rate}
                                                </span>
                                                <span className="text-[#94A3B8]">{post.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard?tab=post-manager')}
                                className="w-full mt-4 py-2.5 text-xs font-bold text-[#1E293B] bg-[#FCFAF7] border border-[#E2D9CF] rounded-2xl hover:bg-[#FAF6F0] transition-colors flex items-center justify-center space-x-1.5"
                            >
                                <Share2 className="w-3.5 h-3.5 text-[#E05A2B]" />
                                <span>Manage All Posts</span>
                            </button>
                        </div>
                    </div>

                    {/* PRO PLANS & SUBSCRIPTION TIERS SECTION */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5EFE8]">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                                        <Crown className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
                                        Buffermate Pro Plans & Pricing
                                    </h2>
                                </div>
                                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                                    Unlock unlimited social channels, AI auto-pilot publishing, predictive audience analytics, and automated lead capture.
                                </p>
                            </div>

                            {/* Billing Cycle Toggle */}
                            <div className="flex items-center space-x-3 self-start md:self-auto bg-[#FCFAF7] p-1 rounded-2xl border border-[#E2D9CF]">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        billingCycle === 'monthly'
                                            ? 'bg-white text-[#1E293B] shadow-xs'
                                            : 'text-[#64748B] hover:text-[#1E293B]'
                                    }`}
                                >
                                    Monthly Billing
                                </button>
                                <button
                                    onClick={() => setBillingCycle('annual')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                        billingCycle === 'annual'
                                            ? 'bg-[#1E293B] text-white shadow-xs'
                                            : 'text-[#64748B] hover:text-[#1E293B]'
                                    }`}
                                >
                                    <span>Annual Billing</span>
                                    <span className="px-1.5 py-0.2 bg-[#E05A2B] text-white text-[10px] rounded-md font-bold">
                                        Save 20%
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Plan Comparison Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                            {/* 1. Starter Free */}
                            <div className="p-6 rounded-3xl border border-[#E2D9CF] bg-[#FCFAF7] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1E9DF] text-[#64748B]">
                                            Starter Free
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-3xl font-bold text-[#1E293B]">$0</span>
                                            <span className="text-xs text-[#64748B]">/ forever</span>
                                        </div>
                                        <p className="text-xs text-[#64748B] mt-1">
                                            Essential scheduling for solo content creators.
                                        </p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-[#475569] pt-2">
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>3 Connected Social Accounts</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>10 Scheduled Posts per channel</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Basic 7-day Analytics</span>
                                        </li>
                                        <li className="flex items-center space-x-2 text-[#94A3B8]">
                                            <X className="w-4 h-4 shrink-0 text-[#CBD5E1]" />
                                            <span>AI Script & Hook Studio</span>
                                        </li>
                                        <li className="flex items-center space-x-2 text-[#94A3B8]">
                                            <X className="w-4 h-4 shrink-0 text-[#CBD5E1]" />
                                            <span>24/7 Automated Comment Auto-DM</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleSelectPlan('free')}
                                    className={`w-full py-2.5 rounded-2xl text-xs font-bold border transition-colors ${
                                        currentPlan === 'free'
                                            ? 'bg-white border-[#E05A2B] text-[#E05A2B]'
                                            : 'bg-white border-[#E2D9CF] text-[#1E293B] hover:bg-[#FAF6F0]'
                                    }`}
                                >
                                    {currentPlan === 'free' ? 'Current Active Plan' : 'Downgrade to Free'}
                                </button>
                            </div>

                            {/* 2. Pro Growth (Featured) */}
                            <div className="p-6 rounded-3xl border-2 border-[#E05A2B] bg-gradient-to-b from-[#FFFDF9] to-[#FFF6F0] flex flex-col justify-between space-y-6 relative shadow-md">
                                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E05A2B] text-white shadow-xs">
                                    MOST POPULAR
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                                            Pro Growth Plan
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-3xl font-bold text-[#1E293B]">
                                                ${billingCycle === 'annual' ? '23' : '29'}
                                            </span>
                                            <span className="text-xs text-[#64748B]">/ month {billingCycle === 'annual' ? '(billed yearly)' : ''}</span>
                                        </div>
                                        <p className="text-xs text-[#64748B] mt-1">
                                            For serious creators, coaches, and growing businesses.
                                        </p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-[#334155] pt-2">
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span className="font-semibold">Unlimited Connected Channels</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span className="font-semibold">Unlimited Scheduled Content Queue</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span>Full 90-Day Advanced Analytics & CSV Export</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span>AI Script & Viral Hook Generation (GPT-4)</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span>24/7 Comment Keyword Auto-DM Lead Bots</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-[#E05A2B] shrink-0" />
                                            <span>AI Predictive Peak Time Heatmaps</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleSelectPlan('pro')}
                                    className={`w-full py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-colors ${
                                        currentPlan === 'pro'
                                            ? 'bg-[#1E293B] text-white hover:bg-black'
                                            : 'bg-[#E05A2B] text-white hover:bg-[#C8491E]'
                                    }`}
                                >
                                    {currentPlan === 'pro' ? 'Current Active Plan (Active)' : 'Upgrade to Pro Growth'}
                                </button>
                            </div>

                            {/* 3. Agency & Scale */}
                            <div className="p-6 rounded-3xl border border-[#E2D9CF] bg-[#FCFAF7] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                                            Scale & Agency
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-3xl font-bold text-[#1E293B]">
                                                ${billingCycle === 'annual' ? '63' : '79'}
                                            </span>
                                            <span className="text-xs text-[#64748B]">/ month {billingCycle === 'annual' ? '(billed yearly)' : ''}</span>
                                        </div>
                                        <p className="text-xs text-[#64748B] mt-1">
                                            For agencies, marketing teams, and multiple brands.
                                        </p>
                                    </div>

                                    <ul className="space-y-2.5 text-xs text-[#475569] pt-2">
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span className="font-semibold">Everything in Pro Growth</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>10 Team Member Workspace Seats</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>White-Label Client Analytics Reports</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Custom Webhook Lead Sync & CRM API</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Dedicated Account Manager & 24/7 SLA</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleSelectPlan('agency')}
                                    className="w-full py-2.5 rounded-2xl text-xs font-bold bg-white hover:bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] transition-colors"
                                >
                                    {currentPlan === 'agency' ? 'Current Active Plan' : 'Upgrade to Agency Scale'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI PREDICTIVE PEAK POSTING INTELLIGENCE (PRO EXCLUSIVE MODULE) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5EFE8]">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] flex items-center justify-center font-bold">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-base font-bold text-[#1E293B]">
                                            AI Predictive Best Times to Publish
                                        </h3>
                                        <span className="text-[10px] font-bold bg-[#E05A2B] text-white px-2 py-0.5 rounded-md">
                                            PRO
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#64748B]">
                                        Calculated based on 2.4M audience engagement data points across your connected platforms.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/dashboard/composer')}
                                className="px-3.5 py-2 bg-[#FAF6F0] hover:bg-[#F3ECE4] text-[#78350F] border border-[#E2D9CF] rounded-2xl text-xs font-bold transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                            >
                                <Zap className="w-3.5 h-3.5 text-[#E05A2B]" />
                                <span>Schedule at Optimal Slot</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F1E9DF] space-y-2">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                                    🔥 Highest Engagement Peak
                                </span>
                                <p className="text-lg font-bold text-[#1E293B]">
                                    Wednesday @ 10:00 AM
                                </p>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    +34% higher comment & save velocity
                                </p>
                            </div>

                            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F1E9DF] space-y-2">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                                    ⚡ Secondary Viral Slot
                                </span>
                                <p className="text-lg font-bold text-[#1E293B]">
                                    Friday @ 6:30 PM
                                </p>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    +28% higher reel & video completion
                                </p>
                            </div>

                            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F1E9DF] space-y-2">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                                    🎯 Weekend Lead Magnet Slot
                                </span>
                                <p className="text-lg font-bold text-[#1E293B]">
                                    Sunday @ 4:15 PM
                                </p>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    +41% higher DM link clickthrough
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <PostSchedulerModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSavePost={() => setIsPostModalOpen(false)}
            />

            <SimulatorModal
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
                automations={[]}
                onTriggerEvent={() => {}}
            />

            {/* Pro Plan Upgrade Modal */}
            {isUpgradeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-2xl space-y-5 animate-fade-in relative">
                        <button
                            onClick={() => setIsUpgradeModalOpen(false)}
                            className="absolute top-5 right-5 p-1.5 text-[#94A3B8] hover:text-[#1E293B] rounded-lg hover:bg-[#FAF6F0]"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F06535] to-[#E05A2B] text-white flex items-center justify-center shadow-xs">
                                <Crown className="w-6 h-6 text-amber-200" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B]">
                                    Upgrade to Buffermate Pro Growth
                                </h3>
                                <p className="text-xs text-[#64748B]">
                                    Activate unlimited channels, AI auto-replies, and advanced analytics.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-[#FFF8F4] border border-[#FED7AA] rounded-2xl space-y-2 text-xs text-[#78350F]">
                            <p className="font-bold flex items-center">
                                <Sparkles className="w-4 h-4 mr-1.5 text-[#E05A2B]" />
                                Instant Pro Membership Benefits:
                            </p>
                            <ul className="space-y-1.5 pl-6 list-disc">
                                <li>Connect unlimited Instagram, TikTok, Facebook, WhatsApp, and X accounts</li>
                                <li>24/7 AI Comment Keyword Auto-DM Funnels with zero downtime</li>
                                <li>Unlimited schedule queue and bulk post uploads</li>
                                <li>Full audience sentiment & real-time webhook lead exports</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#FCFAF7] rounded-2xl border border-[#E2D9CF]">
                            <div>
                                <span className="text-xs font-bold text-[#64748B] block">Selected Billing</span>
                                <span className="text-lg font-bold text-[#1E293B] block">$23 / month (billed yearly)</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                20% Discount
                            </span>
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <button
                                onClick={() => setIsUpgradeModalOpen(false)}
                                className="flex-1 py-2.5 bg-white border border-[#E2D9CF] rounded-2xl text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSelectPlan('pro')}
                                className="flex-1 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                            >
                                <Zap className="w-4 h-4" />
                                <span>Confirm Upgrade</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import Link from 'next/link';
import { Settings, Plus, ChevronDown } from 'lucide-react';

interface SidebarProps {
    accounts: any[]; // Replace with proper type if available
}

export default function Sidebar({ accounts }: SidebarProps) {
    return (
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 top-16 border-r border-slate-200 bg-white z-40 overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Channels</h2>
                    <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>

                <div className="space-y-1">
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                        <div className="flex items-center">
                            <div className="w-5 h-5 rounded border-2 border-blue-600 grid grid-cols-2 gap-0.5 p-0.5 mr-3">
                                <div className="bg-blue-600 rounded-[1px]"></div>
                                <div className="bg-blue-600 rounded-[1px]"></div>
                                <div className="bg-blue-600 rounded-[1px]"></div>
                                <div className="bg-blue-600 rounded-[1px]"></div>
                            </div>
                            All Channels
                        </div>
                        <span className="text-xs font-bold">{accounts.length}</span>
                    </button>

                    {accounts.map((acc) => (
                        <button
                            key={acc.id}
                            className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium group transition-colors"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white text-[10px] font-bold ${acc.provider === 'x'
                                            ? 'bg-black'
                                            : acc.provider === 'linkedin'
                                                ? 'bg-[#0077b5]'
                                                : acc.provider === 'facebook'
                                                    ? 'bg-[#1877f2]'
                                                    : acc.provider === 'instagram'
                                                        ? 'bg-pink-600'
                                                        : acc.provider === 'youtube'
                                                            ? 'bg-red-600'
                                                            : 'bg-slate-500'
                                        }`}
                                >
                                    {acc.provider[0].toUpperCase()}
                                </div>
                                <span className="truncate max-w-[120px]">{acc.username || acc.provider}</span>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-slate-600">0</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 space-y-1">
                    <Link
                        href="/dashboard/accounts"
                        className="flex items-center px-3 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
                    >
                        <div className="w-5 h-5 rounded-full border border-dashed border-slate-400 flex items-center justify-center mr-3">
                            <Plus className="w-3 h-3" />
                        </div>
                        Connect Channel
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                        <ChevronDown className="w-4 h-4 mr-3" />
                        Show more channels
                    </button>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100">
                <div className="space-y-1">
                    <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                        <Settings className="w-4 h-4 mr-3" />
                        Manage Tags
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                        <Settings className="w-4 h-4 mr-3" />
                        Manage Channels
                    </button>
                </div>
            </div>
        </aside>
    );
}

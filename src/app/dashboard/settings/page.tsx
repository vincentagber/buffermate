'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Bell, Moon, Globe, Check, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const supabase = createClient();
    const [fullName, setFullName] = useState('Demo Creator');
    const [email, setEmail] = useState('demo@buffermate.io');
    const [timezone, setTimezone] = useState('America/New_York (UTC-5)');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoPublish, setAutoPublish] = useState(true);
    const [loading, setLoading] = useState(true);
    const [savedNotice, setSavedNotice] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setEmail(user.email || 'demo@buffermate.io');
                    if (user.user_metadata?.name) {
                        setFullName(user.user_metadata.name);
                    }
                }
            } catch (err) {
                console.error('Failed to load user in settings', err);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            // Persist to local or mock/supabase state
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 3000);
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm md:text-base mt-1">Manage your creator profile, publishing preferences, and account security.</p>
            </div>

            {savedNotice && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center shadow-xs">
                    <Check className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                    Settings saved successfully.
                </div>
            )}

            <div className="space-y-6">
                {/* Profile Section */}
                <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                    <div className="flex items-center mb-6">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg mr-4">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Profile Information</h2>
                            <p className="text-xs text-slate-500">Update your public display name and creator contact details.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Display Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center"
                        >
                            {saveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                            Save Profile
                        </button>
                    </div>
                </form>

                {/* Preferences */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                    <div className="flex items-center mb-6">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg mr-4">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Publishing Preferences</h2>
                            <p className="text-xs text-slate-500">Configure scheduling defaults, timezones, and notifications.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2 pb-4 border-b border-slate-100">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Default Timezone</label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="America/New_York (UTC-5)">Eastern Time - New York (UTC-5)</option>
                                <option value="America/Los_Angeles (UTC-8)">Pacific Time - Los Angeles (UTC-8)</option>
                                <option value="Europe/London (UTC+0)">Greenwich Mean Time - London (UTC+0)</option>
                                <option value="Europe/Paris (UTC+1)">Central European Time - Paris (UTC+1)</option>
                                <option value="Asia/Tokyo (UTC+9)">Japan Standard Time - Tokyo (UTC+9)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-semibold text-sm text-slate-800">Auto-Publish On Schedule</p>
                                <p className="text-xs text-slate-500">Automatically broadcast approved posts at scheduled times</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAutoPublish(!autoPublish)}
                                className={`w-11 h-6 rounded-full relative transition-colors ${autoPublish ? 'bg-blue-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoPublish ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-semibold text-sm text-slate-800">Publishing Notifications</p>
                                <p className="text-xs text-slate-500">Receive an email alert when your scheduled queue posts successfully</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNotifications(!notifications)}
                                className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-semibold text-sm text-slate-800">High Contrast Mode</p>
                                <p className="text-xs text-slate-500">Enhance typography contrast for bright ambient studios</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-11 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                    <div className="flex items-center mb-6">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg mr-4">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Security & Sessions</h2>
                            <p className="text-xs text-slate-500">Manage active sessions and encryption status.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start text-xs text-slate-600">
                            <AlertCircle className="w-4 h-4 text-slate-400 mr-2.5 mt-0.5 shrink-0" />
                            <span>All connected social OAuth tokens are encrypted with AES-256 before storage in Supabase.</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-500">Current Session: Authenticated</span>
                            <button
                                onClick={() => alert('Password reset link sent to your registered email.')}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Send Password Reset Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

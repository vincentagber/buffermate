'use client';

import { User, Lock, Bell, Moon, Globe } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your profile, preferences, and security settings.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg mr-4">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Profile Information</h2>
                            <p className="text-sm text-muted-foreground">Update your personal details.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input type="text" className="w-full p-2 border border-input rounded-lg bg-background" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input type="email" className="w-full p-2 border border-input rounded-lg bg-background" placeholder="john@example.com" disabled />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Save Changes</button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg mr-4">
                            <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Preferences</h2>
                            <p className="text-sm text-muted-foreground">Customize your experience.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border">
                            <div className="flex items-center">
                                <Moon className="w-5 h-5 text-muted-foreground mr-3" />
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground">Toggle dark mode theme</p>
                                </div>
                            </div>
                            <button className="w-12 h-6 bg-secondary rounded-full relative transition-colors">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-muted-foreground mr-3" />
                                <div>
                                    <p className="font-medium">Notifications</p>
                                    <p className="text-xs text-muted-foreground">Receive email updates</p>
                                </div>
                            </div>
                            <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg mr-4">
                            <Lock className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Security</h2>
                            <p className="text-sm text-muted-foreground">Manage your password and sessions.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <button className="text-primary hover:underline text-sm font-medium">Change Password</button>
                        <div className="pt-4 border-t border-border">
                            <button className="text-destructive hover:underline text-sm font-medium">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

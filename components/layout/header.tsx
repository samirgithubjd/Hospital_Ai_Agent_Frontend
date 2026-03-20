"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    if (pathname === "/login") {
        return null;
    }

    const getPageTitle = () => {
        const titles: Record<string, string> = {
            "/dashboard": "Dashboard",
            "/calls": "Call Logs",
            "/patients": "Patients",
            "/appointments": "Appointments",
            "/ai-settings": "AI Settings",
            "/settings": "Settings",
        };
        return titles[pathname] || "Dashboard";
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-700 bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
                {/* Search Bar */}
                <div className="flex-1 hidden md:block max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input placeholder="Search..." className="pl-10" />
                    </div>
                </div>

                {/* Page Title */}
                <h2 className="md:hidden text-xl font-bold text-slate-50">
                    {getPageTitle()}
                </h2>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-700 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="hidden md:flex flex-col gap-0.5">
                                <p className="text-sm font-medium text-slate-50">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Receptionist
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
                        </button>

                        {/* User Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 transition-colors rounded-lg first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

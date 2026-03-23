"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    LayoutDashboard,
    PhoneForwarded,
    Users,
    Calendar,
    Settings,
    Bot,
    LogOut,
    ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

// Admin navigation
const adminNavItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        label: "Call Logs",
        href: "/calls",
        icon: <PhoneForwarded className="w-5 h-5" />,
    },
    {
        label: "Patients",
        href: "/patients",
        icon: <Users className="w-5 h-5" />,
    },
    {
        label: "Doctors",
        href: "/admin/doctors",
        icon: <Users className="w-5 h-5" />,
    },
    {
        label: "Appointments",
        href: "/appointments",
        icon: <Calendar className="w-5 h-5" />,
    },
    {
        label: "AI Settings",
        href: "/ai-settings",
        icon: <Bot className="w-5 h-5" />,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="w-5 h-5" />,
    },
];

// Doctor navigation
const doctorNavItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/doctor/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        label: "Appointments",
        href: "/doctor/appointments",
        icon: <Calendar className="w-5 h-5" />,
    },
];

// Patient navigation
const patientNavItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/patient/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        label: "My Appointments",
        href: "/patient/appointments",
        icon: <ClipboardList className="w-5 h-5" />,
    },
    {
        label: "Book Appointment",
        href: "/patient/book-appointment",
        icon: <Calendar className="w-5 h-5" />,
    },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const { userRole, logout } = useAuth();

    if (pathname === "/login") {
        return null;
    }

    // Determine which nav items to show based on role
    const getNavItems = () => {
        switch (userRole) {
            case "doctor":
                return doctorNavItems;
            case "patient":
                return patientNavItems;
            case "admin":
            default:
                return adminNavItems;
        }
    };

    const navItems = getNavItems();
    const roleLabel = userRole
        ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
        : "User";

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen w-64 bg-slate-800/50 backdrop-blur-md border-r border-slate-700 z-40 transition-transform duration-300 md:translate-x-0 md:static flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Logo */}
                <div className="pt-8 px-6 mb-2 hidden md:block">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Bot className="w-6 h-6 text-blue-500" />
                        HospitalAI
                    </h1>
                    {/* <p className="text-xs text-slate-400 mt-1">{roleLabel}</p> */}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/40 to-blue-500/40 text-blue-300 border border-blue-500/50"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30",
                                )}
                            >
                                {item.icon}
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

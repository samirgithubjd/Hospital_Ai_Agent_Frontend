"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/api/auth";

type UserRole = "admin" | "doctor" | "patient";

interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    userRole: UserRole | null;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const logout = useCallback(() => {
        removeToken();
        setUser(null);
        router.push("/login");
    }, [router]);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        logout,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

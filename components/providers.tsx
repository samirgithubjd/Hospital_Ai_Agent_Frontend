"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e293b",
                        color: "#f1f5f9",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                    },
                }}
            />
        </AuthProvider>
    );
}

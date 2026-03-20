import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        "font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

    const variants = {
        primary:
            "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 focus:ring-blue-400",
        secondary:
            "bg-slate-700 text-slate-50 hover:bg-slate-600 focus:ring-slate-500",
        outline:
            "border border-slate-600 text-slate-200 hover:bg-slate-800 focus:ring-slate-500",
        ghost: "text-slate-300 hover:bg-slate-800/50 focus:ring-slate-500",
        destructive:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}

import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
    return (
        <input
            type={type}
            className={cn(
                "w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                className,
            )}
            {...props}
        />
    );
}

export function InputGroup({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn("relative", className)}>{children}</div>;
}

export function Label({
    children,
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "block text-sm font-medium text-slate-300 mb-2",
                className,
            )}
            {...props}
        >
            {children}
        </label>
    );
}

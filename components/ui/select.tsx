import { cn } from "@/lib/utils";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
    return (
        <select
            className={cn(
                "w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer",
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}

export function Option({
    children,
    ...props
}: React.OptionHTMLAttributes<HTMLOptionElement>) {
    return (
        <option {...props} className="bg-slate-900 text-slate-50">
            {children}
        </option>
    );
}

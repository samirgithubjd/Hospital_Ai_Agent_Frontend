"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ className, onCheckedChange, ...props }: SwitchProps) {
    const [checked, setChecked] = useState(props.defaultChecked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setChecked(newValue);
        onCheckedChange?.(newValue);
    };

    return (
        <label
            className={cn(
                "relative inline-flex items-center cursor-pointer",
                className,
            )}
        >
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={handleChange}
                {...props}
            />
            <div
                className={cn(
                    "h-6 w-11 rounded-full transition-colors",
                    checked ? "bg-blue-600" : "bg-slate-600",
                )}
            >
                <div
                    className={cn(
                        "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                        checked && "translate-x-5",
                    )}
                />
            </div>
        </label>
    );
}

"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

interface TabListProps {
    children: React.ReactNode;
}

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    isActive?: boolean;
}

interface TabContentProps {
    value: string;
    children: React.ReactNode;
}

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
}>({
    activeTab: "",
    setActiveTab: () => {},
});

export function Tabs({ defaultValue, children, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabList({ children }: TabListProps) {
    return (
        <div className="flex gap-1 border-b border-slate-700">{children}</div>
    );
}

export function TabTrigger({
    value,
    children,
    className,
    ...props
}: TabTriggerProps) {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                isActive
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-300",
                className,
            )}
            onClick={() => setActiveTab(value)}
            {...props}
        >
            {children}
        </button>
    );
}

export function TabContent({ value, children }: TabContentProps) {
    const { activeTab } = React.useContext(TabsContext);

    if (activeTab !== value) return null;

    return <div>{children}</div>;
}

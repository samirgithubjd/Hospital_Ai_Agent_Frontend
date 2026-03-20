import { cn } from "@/lib/utils";
import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-slate-700">
            <table
                className={cn("w-full text-sm text-slate-200", className)}
                {...props}
            />
        </div>
    );
}

export function TableHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead
            className={cn(
                "border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm",
                className,
            )}
            {...props}
        />
    );
}

export function TableBody({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={cn("", className)} {...props} />;
}

export function TableRow({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "border-b border-slate-700 hover:bg-slate-800/30 transition-colors",
                className,
            )}
            {...props}
        />
    );
}

export function TableHead({
    className,
    ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                "px-6 py-4 text-left font-semibold text-slate-300 uppercase text-xs tracking-wide",
                className,
            )}
            {...props}
        />
    );
}

export function TableCell({
    className,
    ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cn("px-6 py-4 text-slate-200", className)} {...props} />
    );
}

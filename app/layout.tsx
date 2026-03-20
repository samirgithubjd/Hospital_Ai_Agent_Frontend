import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "Hospital AI Dashboard",
    description: "Modern hospital reception AI voice agent dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🏥</text></svg>"
                />
            </head>
            <body className="bg-slate-900 text-slate-50">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

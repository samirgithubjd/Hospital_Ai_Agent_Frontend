import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
                <Header />
                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPatientAppointments, getPatientStats, Appointment } from "@/lib/api/appointments";
import { useAuth } from "@/lib/auth-context";

interface Stats {
    totalAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
}

export default function PatientDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [appts, dashboardStats] = await Promise.all([
                getPatientAppointments(),
                getPatientStats(),
            ]);
            setAppointments(appts);
            setStats(dashboardStats);
        } catch (error: any) {
            console.error("Error loading patient dashboard:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to load appointments"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
            case "booked":
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
            case "completed":
                return "bg-green-500/20 text-green-300 border-green-500/30";
            case "cancelled":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            case "pending":
            default:
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50">
                    Welcome, {user?.name || "Patient"}
                </h1>
                <p className="text-slate-400 mt-1">
                    Manage and book your medical appointments
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Link href="/patient/book-appointment" className="block">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Book New Appointment
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Total Appointments
                                </p>
                                <p className="text-3xl font-bold text-slate-50 mt-2">
                                    {stats.totalAppointments}
                                </p>
                            </div>
                            <Calendar className="w-12 h-12 text-blue-400 opacity-20" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Upcoming
                                </p>
                                <p className="text-3xl font-bold text-slate-50 mt-2">
                                    {stats.upcomingAppointments}
                                </p>
                            </div>
                            <Clock className="w-12 h-12 text-yellow-400 opacity-20" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Completed
                                </p>
                                <p className="text-3xl font-bold text-slate-50 mt-2">
                                    {stats.completedAppointments}
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-400 opacity-20" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Appointments List */}
            <Card className="bg-slate-800/50 border-slate-700">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-slate-50">
                        Your Appointments
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        View and manage your upcoming appointments
                    </p>
                </div>

                {appointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">
                            No appointments scheduled yet
                        </p>
                        <Link href="/patient/book-appointment" className="inline-block">
                            <Button size="sm">Book Your First Appointment</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            {appointment.doctorName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            {appointment.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-200">
                                            {appointment.time}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {appointment.reason || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge
                                                className={`${getStatusColor(
                                                    appointment.status
                                                )} border`}
                                            >
                                                {appointment.status.charAt(0).toUpperCase() +
                                                    appointment.status.slice(1)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}

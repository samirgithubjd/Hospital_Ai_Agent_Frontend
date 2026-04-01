"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getDoctorAppointments, Appointment } from "@/lib/api/appointments";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            const data = await getDoctorAppointments();
            setAppointments(data);
        } catch (error: any) {
            console.error("Error loading appointments:", error);
            toast.error("Failed to load appointments");
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
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/doctor/dashboard"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-50">
                    My Appointments
                </h1>
                <p className="text-slate-400 mt-1">
                    View all your scheduled appointments
                </p>
            </div>

            {/* Appointments List */}
            <Card className="bg-slate-800/50 border-slate-700">
                {appointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">
                            No appointments scheduled
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                                        Patient
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
                                        Symptoms
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
                                            {appointment.patientName}
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
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {appointment.symptoms || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge
                                                className={`${getStatusColor(
                                                    appointment.status
                                                )} border`}
                                            >
                                                {appointment.status
                                                    .charAt(0)
                                                    .toUpperCase() +
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

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
    Phone,
    PhoneOff,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPatientAppointments, getPatientStats, Appointment } from "@/lib/api/appointments";
import { getAgentDetails, Agent } from "@/lib/api/agents";
import { getActiveDoctors, Doctor } from "@/lib/api/doctors";
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
    const [agent, setAgent] = useState<Agent | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [appts, dashboardStats, agentData, doctorsData] = await Promise.all([
                getPatientAppointments(),
                getPatientStats(),
                getAgentDetails().catch(() => null), // Don't fail if agent data is not available
                getActiveDoctors().catch(() => []), // Don't fail if doctors data is not available
            ]);
            setAppointments(appts);
            setStats(dashboardStats);
            setAgent(agentData);
            setDoctors(doctorsData);
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

    const handleCallAgent = () => {
        if (agent?.mobileNumber) {
            window.location.href = `tel:${agent.mobileNumber}`;
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

            {/* Agent Contact Card */}
            {agent && (
                <Card className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-400" />
                                Need Help? Contact Our Agent
                            </h3>
                            <p className="text-slate-400 mt-2">
                                Agent Name: <span className="text-slate-200 font-medium">{agent.name}</span>
                            </p>
                            <p className="text-slate-300 text-lg font-semibold mt-1">
                                📱 {agent.mobileNumber}
                            </p>
                        </div>
                        <button
                            onClick={handleCallAgent}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            Call Now
                        </button>
                    </div>
                </Card>
            )}

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

            {/* Available Doctors Section */}
            {doctors.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Available Doctors
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Browse and book appointments with our available doctors
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {doctors.slice(0, 6).map((doctor) => (
                            <div
                                key={doctor.id}
                                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-blue-500/30 hover:bg-slate-700/50 transition-all group"
                            >
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-50 group-hover:text-blue-300 transition-colors">
                                            Dr. {doctor.name}
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {doctor.specialization ||
                                                "General Practitioner"}
                                        </p>
                                    </div>

                                    {(doctor.experience ||
                                        doctor.city ||
                                        doctor.phone) && (
                                        <div className="space-y-1 text-xs text-slate-400">
                                            {doctor.experience && (
                                                <p>
                                                    📅{" "}
                                                    {doctor.experience} years
                                                    experience
                                                </p>
                                            )}
                                            {doctor.city && (
                                                <p>📍 {doctor.city}</p>
                                            )}
                                            {doctor.phone && (
                                                <p>📞 {doctor.phone}</p>
                                            )}
                                        </div>
                                    )}

                                    <Link
                                        href="/patient/book-appointment"
                                        className="block"
                                    >
                                        <Button
                                            size="sm"
                                            className="w-full mt-2"
                                        >
                                            Book Appointment
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 pb-6 text-center border-t border-slate-700 pt-4">
                        <Link href="/patient/book-appointment">
                            <Button variant="ghost">
                                View All Doctors →
                            </Button>
                        </Link>
                    </div>
                </Card>
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

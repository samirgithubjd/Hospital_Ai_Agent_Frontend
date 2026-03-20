"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Phone, PhoneMissed, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCalls } from "@/lib/api/calls";
import { getAppointments } from "@/lib/api/appointments";
import { formatTime, formatDuration } from "@/lib/utils";
import type { Call } from "@/lib/api/calls";

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    isLoading,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    isLoading?: boolean;
}) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between pt-6">
                <div>
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                    ) : (
                        <p className="text-3xl font-bold text-slate-50">
                            {value}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const [callsData, setCallsData] = useState<Call[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        missed: 0,
        ongoing: 0,
    });
    const [appointments, setAppointments] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [callsResponse, appointmentsResponse] = await Promise.all(
                    [getCalls(), getAppointments()],
                );

                setCallsData(callsResponse.calls);
                setStats({
                    total: callsResponse.total,
                    completed: callsResponse.completed,
                    missed: callsResponse.missed,
                    ongoing: callsResponse.ongoing,
                });
                setAppointments(appointmentsResponse.total);
            } catch (error: any) {
                toast.error("Failed to load dashboard data");
                console.error("Dashboard error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Generate deterministic chart data (not random) to avoid hydration mismatch
    const chartData = useMemo(() => {
        const callChartData = Array.from({ length: 24 }, (_, i) => ({
            time: `${String(i).padStart(2, "0")}:00`,
            calls: (i * 3) % 10, // Deterministic instead of random
        }));

        const appointmentChartData = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ].map((day, i) => ({
            date: day,
            appointments: (i * 5) % 20, // Deterministic instead of random
        }));

        return { callChartData, appointmentChartData };
    }, []);

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Welcome back
                </h1>
                <p className="text-slate-400">
                    Here's what's happening with your hospital today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Calls Today"
                    value={stats.total}
                    icon={<Phone className="w-6 h-6 text-blue-400" />}
                    color="bg-blue-500/20"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Active Calls"
                    value={stats.ongoing}
                    icon={<Clock className="w-6 h-6 text-green-400" />}
                    color="bg-green-500/20"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Missed Calls"
                    value={stats.missed}
                    icon={<PhoneMissed className="w-6 h-6 text-red-400" />}
                    color="bg-red-500/20"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Appointments Booked"
                    value={appointments}
                    icon={<Calendar className="w-6 h-6 text-purple-400" />}
                    color="bg-purple-500/20"
                    isLoading={isLoading}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calls Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Calls Today</CardTitle>
                        <CardDescription>Hourly call volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData.callChartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #475569",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="calls"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={{ fill: "#0ea5e9", r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Appointments Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments This Week</CardTitle>
                        <CardDescription>
                            Daily appointment bookings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.appointmentChartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #475569",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar
                                    dataKey="appointments"
                                    fill="#0ea5e9"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Calls */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                    <CardDescription>Latest call activity</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : !callsData || callsData.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400">No calls yet</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {callsData.slice(0, 5).map((call) => (
                                    <TableRow key={call.id}>
                                        <TableCell className="font-medium">
                                            {call.patientName}
                                        </TableCell>
                                        <TableCell>
                                            {call.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {formatDuration(call.duration)}
                                        </TableCell>
                                        <TableCell>
                                            {formatTime(
                                                new Date(call.callTime),
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    call.status === "completed"
                                                        ? "success"
                                                        : call.status ===
                                                            "missed"
                                                          ? "destructive"
                                                          : "info"
                                                }
                                            >
                                                {call.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    call.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

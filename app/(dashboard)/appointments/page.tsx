"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
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
import { Input, Label } from "@/components/ui/input";
import { Select, Option } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppointments } from "@/lib/api/appointments";
import type { Appointment } from "@/lib/api/appointments";

export default function AppointmentsPage() {
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAppointments();
                setAllAppointments(response.appointments);
            } catch (error) {
                toast.error("Failed to load appointments");
                console.error("Fetch appointments error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments =
        selectedStatus === "all"
            ? allAppointments
            : allAppointments.filter((apt) => apt.status === selectedStatus);

    const upcomingAppointments = filteredAppointments.filter(
        (apt) => new Date(apt.appointmentTime) > new Date(),
    );

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Appointments
                </h1>
                <p className="text-slate-400">
                    Manage and track all patient appointments.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">
                                Total Appointments
                            </p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-slate-50">
                                    {allAppointments.length}
                                </p>
                            )}
                        </div>
                        <Calendar className="w-8 h-8 text-blue-400" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">
                                Upcoming
                            </p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-slate-50">
                                    {upcomingAppointments.length}
                                </p>
                            )}
                        </div>
                        <Clock className="w-8 h-8 text-green-400" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">
                                Pending Confirmation
                            </p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <p className="text-3xl font-bold text-slate-50">
                                    {
                                        allAppointments.filter(
                                            (apt) => apt.status === "pending",
                                        ).length
                                    }
                                </p>
                            )}
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-400" />
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <div>
                        <Label>Search by Patient</Label>
                        <Input placeholder="Patient name..." className="mt-2" />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="mt-2"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="confirmed">Confirmed</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button variant="secondary" className="w-full">
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>
                        Showing {filteredAppointments.length} appointments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400">
                                No appointments found
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell className="font-medium">
                                            {appointment.patientName}
                                        </TableCell>
                                        <TableCell>
                                            {appointment.doctorName}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                appointment.appointmentTime,
                                            ).toLocaleDateString()}{" "}
                                            {new Date(
                                                appointment.appointmentTime,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {appointment.reason}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    appointment.status ===
                                                    "confirmed"
                                                        ? "success"
                                                        : appointment.status ===
                                                            "cancelled"
                                                          ? "destructive"
                                                          : "pending"
                                                }
                                            >
                                                {appointment.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    appointment.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                                {appointment.status ===
                                                    "pending" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-400"
                                                    >
                                                        Confirm
                                                    </Button>
                                                )}
                                            </div>
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

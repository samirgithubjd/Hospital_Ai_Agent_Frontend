"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
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
import { getCalls } from "@/lib/api/calls";
import { formatTime, formatDuration } from "@/lib/utils";
import type { Call } from "@/lib/api/calls";

export default function CallLogsPage() {
    const [allCalls, setAllCalls] = useState<Call[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchName, setSearchName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await getCalls();
                setAllCalls(response.calls);
            } catch (error) {
                toast.error("Failed to load calls");
                console.error("Fetch calls error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalls();
    }, []);

    const filteredCalls = allCalls
        .filter(
            (call) =>
                selectedStatus === "all" || call.status === selectedStatus,
        )
        .filter((call) =>
            call.patientName.toLowerCase().includes(searchName.toLowerCase()),
        );

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Call Logs
                </h1>
                <p className="text-slate-400">
                    View and manage all incoming and outgoing calls.
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <div>
                        <Label>Search by Name</Label>
                        <Input
                            placeholder="Patient name..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="mt-2"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="missed">Missed</Option>
                            <Option value="ongoing">Ongoing</Option>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button variant="secondary" className="w-full">
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Call Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Calls</CardTitle>
                    <CardDescription>
                        Showing {filteredCalls.length} calls
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : filteredCalls.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400">No calls found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Call Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCalls.map((call) => (
                                    <TableRow key={call.id}>
                                        <TableCell className="font-medium">
                                            {call.patientName}
                                        </TableCell>
                                        <TableCell>
                                            {call.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                call.callTime,
                                            ).toLocaleDateString()}{" "}
                                            {formatTime(
                                                new Date(call.callTime),
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDuration(call.duration)}
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
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/calls/${call.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                                {call.recordingUrl && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        <Play className="w-4 h-4" />
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

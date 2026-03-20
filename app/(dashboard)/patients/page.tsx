"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MapPin, AlertTriangle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getPatients } from "@/lib/api/patients";
import type { Patient } from "@/lib/api/patients";

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (error) {
                toast.error("Failed to load patients");
                console.error("Fetch patients error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Patients
                </h1>
                <p className="text-slate-400">
                    View patient information and call history.
                </p>
            </div>

            {/* Patients Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            ) : patients.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <MapPin className="w-8 h-8 text-slate-500" />
                        </div>
                        <p className="text-slate-400 mb-2">No patients found</p>
                        <p className="text-xs text-slate-500">
                            Patient records will appear here when they call.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <Card
                            key={patient.id}
                            className={
                                patient.isEmergency
                                    ? "border-red-500/50 bg-red-500/10"
                                    : ""
                            }
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <CardTitle>{patient.name}</CardTitle>
                                        <CardDescription>
                                            {patient.age} years old
                                        </CardDescription>
                                    </div>
                                    {patient.isEmergency && (
                                        <Badge
                                            variant="destructive"
                                            className="flex items-center gap-1"
                                        >
                                            <AlertTriangle className="w-3 h-3" />
                                            Emergency
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Contact */}
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <p className="text-sm text-slate-300">
                                        {patient.phoneNumber}
                                    </p>
                                </div>

                                {/* Symptoms */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
                                        Symptoms
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {patient.symptoms.map(
                                            (symptom, idx) => (
                                                <Badge key={idx} variant="info">
                                                    {symptom}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Last Call */}
                                {patient.lastCallDate && (
                                    <p className="text-xs text-slate-400">
                                        Last call:{" "}
                                        {new Date(
                                            patient.lastCallDate,
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4">
                                    <Link
                                        href={`/patients/${patient.id}`}
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Call
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

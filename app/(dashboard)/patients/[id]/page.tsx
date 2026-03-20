"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Phone, Calendar } from "lucide-react";
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
import { getPatientById } from "@/lib/api/patients";
import type { Patient } from "@/lib/api/patients";

export default function PatientDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = params.id as string;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await getPatientById(patientId);
                setPatient(data);
            } catch (error) {
                toast.error("Failed to load patient details");
                console.error("Fetch patient error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (patientId) {
            fetchPatient();
        }
    }, [patientId]);

    if (isLoading) {
        return (
            <div className="p-6 space-y-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-slate-400 mb-4">Patient not found</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
            </button>

            {/* Patient Info */}
            <Card
                className={
                    patient.isEmergency ? "border-red-500/50 bg-red-500/10" : ""
                }
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl">
                                {patient.name}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {patient.age} years old
                            </CardDescription>
                        </div>
                        {patient.isEmergency && (
                            <Badge
                                variant="destructive"
                                className="flex items-center gap-2 px-3 py-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                EMERGENCY
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">
                                    Phone
                                </p>
                                <p className="text-slate-200 mt-1">
                                    {patient.phoneNumber}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">
                                    Last Call
                                </p>
                                <p className="text-slate-200 mt-1">
                                    {patient.lastCallDate
                                        ? new Date(
                                              patient.lastCallDate,
                                          ).toLocaleDateString()
                                        : "No calls yet"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <p className="text-sm font-semibold text-slate-400 uppercase mb-3">
                            Symptoms
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {patient.symptoms.map((symptom, idx) => (
                                <Badge key={idx} variant="info">
                                    {symptom}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
                <Button variant="primary" className="flex-1 md:flex-none">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Patient
                </Button>
                <Button variant="secondary" className="flex-1 md:flex-none">
                    Schedule Appointment
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none">
                    Edit Patient
                </Button>
            </div>
        </div>
    );
}

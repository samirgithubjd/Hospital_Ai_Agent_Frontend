"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Download } from "lucide-react";
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
import { getCallById } from "@/lib/api/calls";
import { formatTime, formatDuration } from "@/lib/utils";
import type { Call } from "@/lib/api/calls";

export default function CallDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const callId = params.id as string;

    const [call, setCall] = useState<Call | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCall = async () => {
            try {
                const data = await getCallById(callId);
                setCall(data);
            } catch (error) {
                toast.error("Failed to load call details");
                console.error("Fetch call error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (callId) {
            fetchCall();
        }
    }, [callId]);

    if (isLoading) {
        return (
            <div className="p-6 space-y-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!call) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-slate-400 mb-4">Call not found</p>
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
                Back to Calls
            </button>

            {/* Call Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl">
                                {call.patientName}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {call.phoneNumber}
                            </CardDescription>
                        </div>
                        <Badge
                            variant={
                                call.status === "completed"
                                    ? "success"
                                    : call.status === "missed"
                                      ? "destructive"
                                      : "info"
                            }
                        >
                            {call.status.charAt(0).toUpperCase() +
                                call.status.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Call Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">
                                Date & Time
                            </p>
                            <p className="text-slate-200 mt-2">
                                {new Date(call.callTime).toLocaleDateString()}{" "}
                                {formatTime(new Date(call.callTime))}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">
                                Duration
                            </p>
                            <p className="text-slate-200 mt-2">
                                {formatDuration(call.duration)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">
                                Status
                            </p>
                            <p className="text-slate-200 mt-2">
                                {call.status.charAt(0).toUpperCase() +
                                    call.status.slice(1)}
                            </p>
                        </div>
                    </div>

                    {/* Recording Player */}
                    {call.recordingUrl && (
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase mb-3">
                                Recording
                            </p>
                            <audio
                                src={call.recordingUrl}
                                controls
                                className="w-full rounded-lg"
                            />
                        </div>
                    )}

                    {/* Transcript */}
                    {call.transcript && (
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase mb-3">
                                Transcript
                            </p>
                            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <p className="text-slate-300 whitespace-pre-wrap">
                                    {call.transcript}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
                {call.recordingUrl && (
                    <Button variant="secondary" className="flex-1 md:flex-none">
                        <Download className="w-4 h-4 mr-2" />
                        Download Recording
                    </Button>
                )}
                <Button variant="outline" className="flex-1 md:flex-none">
                    Schedule Follow-up
                </Button>
            </div>
        </div>
    );
}

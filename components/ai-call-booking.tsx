"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
    initiateAICall,
    pollForAppointmentStatus,
    AIBookingPayload,
} from "@/lib/api/calls";

interface AICallBookingProps {
    patientId: string;
    onAppointmentBooked?: (appointmentId: string) => void;
}

export function AICallBooking({
    patientId,
    onAppointmentBooked,
}: AICallBookingProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [symptoms, setSymptoms] = useState("");
    const [isEmergency, setIsEmergency] = useState(false);
    const [callInitiated, setCallInitiated] = useState(false);
    const [appointmentBooked, setAppointmentBooked] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleInitiateCall = async () => {
        if (!symptoms.trim()) {
            toast.error("Please describe your symptoms");
            return;
        }

        setIsLoading(true);
        try {
            const payload: AIBookingPayload = {
                patientId,
                isEmergency,
                symptoms: symptoms.trim(),
            };

            const response = await initiateAICall(payload);

            setPhoneNumber(response.phoneNumber);
            setCallInitiated(true);

            toast.success(
                `AI agent is calling you at ${response.phoneNumber}. Please answer the call!`
            );

            // Start polling for appointment booking
            setIsPolling(true);
            const result = await pollForAppointmentStatus(response.callId);

            if (result.booked && result.appointmentId) {
                setAppointmentBooked(true);
                toast.success("✅ Appointment booked successfully!");
                onAppointmentBooked?.(result.appointmentId);

                // Close dialog after 3 seconds
                setTimeout(() => {
                    handleClose();
                }, 3000);
            } else {
                toast(
                    "Call completed. Appointment booking is pending agent processing."
                );
            }
        } catch (error: unknown) {
            console.error("Error initiating AI call:", error);
            const knownError = error as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };
            toast.error(
                knownError.response?.data?.message ||
                    "Failed to initiate AI call"
            );
        } finally {
            setIsLoading(false);
            setIsPolling(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSymptoms("");
        setIsEmergency(false);
        setCallInitiated(false);
        setAppointmentBooked(false);
        setPhoneNumber("");
    };

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
                <Phone className="w-4 h-4" />
                Book via AI Call
            </Button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <Phone className="w-6 h-6 text-blue-400" />
                                <h2 className="text-xl font-bold text-slate-50">
                                    AI Appointment Booking
                                </h2>
                            </div>

                            {/* States */}
                            {!callInitiated ? (
                                // Initial Form
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">
                                        Our AI agent will call you to collect
                                        information and book your appointment
                                    </p>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Describe Your Symptoms *
                                        </label>
                                        <textarea
                                            value={symptoms}
                                            onChange={(e) =>
                                                setSymptoms(e.target.value)
                                            }
                                            placeholder="e.g., Chest pain, fever, headache..."
                                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                            rows={4}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="emergency"
                                            checked={isEmergency}
                                            onChange={(e) =>
                                                setIsEmergency(e.target.checked)
                                            }
                                            disabled={isLoading}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="emergency"
                                            className="text-sm text-slate-300 cursor-pointer"
                                        >
                                            This is an emergency
                                        </label>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleClose}
                                            disabled={isLoading}
                                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleInitiateCall}
                                            disabled={isLoading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            {isLoading && (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            )}
                                            {isLoading
                                                ? "Initiating..."
                                                : "Start AI Call"}
                                        </Button>
                                    </div>
                                </div>
                            ) : appointmentBooked ? (
                                // Success State
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-green-400 mb-2">
                                            Appointment Booked!
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            Your appointment has been
                                            successfully booked through the AI
                                            agent. Check your appointments for
                                            details.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        Close
                                    </Button>
                                </div>
                            ) : isPolling ? (
                                // Polling State
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Loader className="w-12 h-12 text-blue-400 animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-blue-400 mb-2">
                                            Call in Progress...
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            Speaking with AI agent at:{" "}
                                            <span className="font-mono font-semibold text-slate-300">
                                                {phoneNumber}
                                            </span>
                                        </p>
                                        <p className="text-slate-500 text-xs mt-2">
                                            Please answer the call and follow
                                            the agent&apos;s instructions
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-slate-700 hover:bg-slate-600"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            ) : (
                                // Call Initiated - Waiting
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Phone className="w-12 h-12 text-yellow-400 animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                                            Call Initiated
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            AI agent is calling you at:{" "}
                                            <span className="font-mono font-semibold text-slate-300">
                                                {phoneNumber}
                                            </span>
                                        </p>
                                        <p className="text-slate-500 text-xs mt-2">
                                            Please answer the call. The agent
                                            will collect your information and
                                            book an appointment.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-slate-700 hover:bg-slate-600"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}

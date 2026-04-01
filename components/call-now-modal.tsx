"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
// import { recordManualCall } from "@/lib/api/calls";

interface CallNowModalProps {
    patientId: string;
    hospitalName?: string;
    agentPhoneNumber?: string;
    agentName?: string;
    onCallRecorded?: (appointmentId?: string) => void;
}

export function CallNowModal({
    patientId,
    hospitalName = "Hospital AI Agent",
    agentPhoneNumber = "+1 (914) 465-1284",
    agentName = "AI Agent",
    onCallRecorded,
}: CallNowModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callRecorded, setCallRecorded] = useState(false);
    const [copied, setCopied] = useState(false);

    // const handleCallNow = async () => {
    //     setIsCalling(true);
    //     try {
    //         // Record the call in the backend
    //         const response = await recordManualCall({
    //             patientId,
    //             agentPhoneNumber,
    //             hospitalName,
    //             agentName,
    //         });

    //         setCallRecorded(true);
    //         toast.success("Call recorded. Please dial the number on your phone.");

    //         // Open phone dialer on mobile or show the number
    //         const dialLink = `tel:${agentPhoneNumber.replace(/\D/g, "")}`;
    //         window.location.href = dialLink;

    //         // Close modal after 2 seconds
    //         setTimeout(() => {
    //             handleClose();
    //         }, 2000);

    //         onCallRecorded?.(response.appointmentId);
    //     } catch (error) {
    //         console.error("Error recording call:", error);
    //         toast.error("Failed to record call. Please try again.");
    //     } finally {
    //         setIsCalling(false);
    //     }
    // };

    const handleCopyNumber = () => {
        navigator.clipboard.writeText(agentPhoneNumber);
        setCopied(true);
        toast.success("Phone number copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsCalling(false);
        setCallRecorded(false);
    };

    return (
        <>
            {/* Call Now Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
                <Phone className="w-4 h-4" />
                Call Now
            </Button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
                        <div className="p-8">
                            {callRecorded ? (
                                // Success State
                                <div className="space-y-6 text-center">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                                            <Phone className="w-8 h-8 text-green-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400 mb-2">
                                            Calling Now
                                        </h3>
                                        <p className="text-slate-400">
                                            Please answer the incoming call...
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleClose}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        Close
                                    </Button>
                                </div>
                            ) : (
                                // Call Info State
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-slate-50 mb-2">
                                            Call {agentName}
                                        </h2>
                                        <p className="text-slate-400">
                                            {hospitalName}
                                        </p>
                                    </div>

                                    {/* Phone Number Display */}
                                    <div className="bg-slate-700/50 rounded-lg p-6 text-center space-y-4">
                                        <p className="text-slate-400 text-sm font-medium">
                                            Agent's Phone Number
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <p className="text-3xl font-mono font-bold text-green-400">
                                                {agentPhoneNumber}
                                            </p>
                                            <button
                                                onClick={handleCopyNumber}
                                                className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                                                title="Copy phone number"
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <p className="text-sm text-slate-300">
                                            Dial number on your phone to connect with the agent. If you're on a mobile device, tapping "Call Now" should automatically open your dialer.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleClose}
                                            className="flex-1 bg-slate-700 hover:bg-slate-600"
                                            disabled={isCalling}
                                        >
                                            Cancel
                                        </Button>
                                        {/* <Button
                                            onClick={handleCallNow}
                                            disabled={isCalling}
                                            className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {isCalling ? "Recording..." : "Call Now"}
                                        </Button> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}

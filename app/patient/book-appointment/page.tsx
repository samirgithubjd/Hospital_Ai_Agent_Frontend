"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    FileText,
    Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    getActiveDoctorsPaginated,
    getAvailableSpecializations,
    getDoctorAvailableSlots,
    Doctor,
    AvailableSlot,
} from "@/lib/api/doctors";
import { bookAppointment } from "@/lib/api/appointments";

export default function BookAppointmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<
        "doctor" | "date" | "time" | "details" | "confirm"
    >("doctor");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [specializations, setSpecializations] = useState<string[]>([]);

    // Form data
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [selectedSpecialization, setSelectedSpecialization] =
        useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [symptoms, setSymptoms] = useState<string>("");

    // Load doctors and specializations on mount
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            const [specs, doctorsData] = await Promise.all([
                getAvailableSpecializations(),
                getActiveDoctorsPaginated(),
            ]);
            setSpecializations(specs);
            setDoctors(doctorsData.data);
        } catch (error: any) {
            console.error("Error loading data:", error);
            toast.error("Failed to load available doctors");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter doctors when specialization changes
    const handleSpecializationChange = async (spec: string) => {
        setSelectedSpecialization(spec);
        setSelectedDoctor(""); // Reset doctor selection

        if (!spec) {
            // Load all active doctors
            try {
                const data = await getActiveDoctorsPaginated();
                setDoctors(data.data);
            } catch (error: any) {
                console.error("Error loading doctors:", error);
                toast.error("Failed to load doctors");
            }
        } else {
            // Load doctors by specialization
            try {
                const data = await getActiveDoctorsPaginated({
                    specialization: spec,
                });
                setDoctors(data.data);
            } catch (error: any) {
                console.error("Error loading doctors:", error);
                toast.error("Failed to load doctors for this specialization");
            }
        }
    };

    // Load available slots when date changes
    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            loadAvailableSlots();
        }
    }, [selectedDate, selectedDoctor]);

    const loadAvailableSlots = async () => {
        try {
            const data = await getDoctorAvailableSlots(
                selectedDoctor,
                selectedDate
            );
            setAvailableSlots(data);
            setSelectedTime(""); // Reset time when date changes
        } catch (error: any) {
            console.error("Error loading slots:", error);
            toast.error("Failed to load available time slots");
        }
    };

    const handleNext = () => {
        if (step === "doctor" && !selectedDoctor) {
            toast.error("Please select a doctor");
            return;
        }
        if (step === "date" && !selectedDate) {
            toast.error("Please select a date");
            return;
        }
        if (step === "time" && !selectedTime) {
            toast.error("Please select a time");
            return;
        }

        const steps: Array<"doctor" | "date" | "time" | "details" | "confirm"> = [
            "doctor",
            "date",
            "time",
            "details",
            "confirm",
        ];
        const nextIndex = steps.indexOf(step) + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex]);
        }
    };

    const handlePrevious = () => {
        const steps: Array<"doctor" | "date" | "time" | "details" | "confirm"> = [
            "doctor",
            "date",
            "time",
            "details",
            "confirm",
        ];
        const prevIndex = steps.indexOf(step) - 1;
        if (prevIndex >= 0) {
            setStep(steps[prevIndex]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            toast.error("Please complete all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await bookAppointment({
                doctorId: selectedDoctor,
                date: selectedDate,
                time: selectedTime,
                reason,
                symptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
            });

            toast.success("Appointment booked successfully!");
            router.push("/patient/dashboard");
        } catch (error: any) {
            console.error("Error booking appointment:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to book appointment"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split("T")[0];
    };

    const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/patient/dashboard"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-50">
                    Book an Appointment
                </h1>
                <p className="text-slate-400 mt-1">
                    Step {
                        ["doctor", "date", "time", "details", "confirm"].indexOf(
                            step
                        ) + 1
                    } of 5
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {["doctor", "date", "time", "details", "confirm"].map(
                        (s, i) => (
                            <div
                                key={s}
                                className={`flex-1 h-1 rounded-full transition-all ${
                                    ["doctor", "date", "time", "details", "confirm"].indexOf(
                                        step
                                    ) >= i
                                        ? "bg-blue-500"
                                        : "bg-slate-700"
                                } ${i > 0 ? "ml-1" : ""}`}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Content */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
                {/* Step 1: Doctor Selection */}
                {step === "doctor" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Select a Doctor
                            </h2>
                        </div>

                        {/* Specialization Filter */}
                        {specializations.length > 0 && (
                            <div className="space-y-2 p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                                <Label className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter by Specialization
                                </Label>
                                <select
                                    value={selectedSpecialization}
                                    onChange={(e) =>
                                        handleSpecializationChange(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">
                                        All Specializations
                                    </option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="space-y-3">
                                {Array(3)
                                    .fill(0)
                                    .map((_, i) => (
                                        <Skeleton key={i} className="h-20" />
                                    ))}
                            </div>
                        ) : doctors.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">
                                No doctors available
                            </p>
                        ) : (
                            <div className="grid gap-3">
                                {doctors.map((doctor) => (
                                    <button
                                        key={doctor.id}
                                        onClick={() =>
                                            setSelectedDoctor(doctor.id)
                                        }
                                        className={`p-4 rounded-lg text-left transition-all border ${
                                            selectedDoctor === doctor.id
                                                ? "bg-blue-500/20 border-blue-500 text-blue-300"
                                                : "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                                        }`}
                                    >
                                        <div className="font-semibold">
                                            {doctor.name}
                                        </div>
                                        <div className="text-sm opacity-75">
                                            {doctor.specialization ||
                                                "General Practitioner"}
                                        </div>
                                        {doctor.experience && (
                                            <div className="text-xs opacity-60 mt-1">
                                                {doctor.experience} years of
                                                experience
                                            </div>
                                        )}
                                        {doctor.city && (
                                            <div className="text-xs opacity-60">
                                                📍 {doctor.city}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Date Selection */}
                {step === "date" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Select a Date
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Doctor: {selectedDoctorData?.name}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="date">Appointment Date</Label>
                            <Input
                                id="date"
                                type="date"
                                min={getMinDate()}
                                max={getMaxDate()}
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Time Selection */}
                {step === "time" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Select a Time
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {selectedDate && `Date: ${selectedDate}`}
                            </p>
                        </div>

                        {availableSlots.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">
                                No available slots for this date
                            </p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        disabled={!slot.available}
                                        onClick={() =>
                                            setSelectedTime(slot.time)
                                        }
                                        className={`p-3 rounded-lg text-center transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                                            selectedTime === slot.time
                                                ? "bg-blue-500/20 border-blue-500 text-blue-300"
                                                : slot.available
                                                  ? "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                                                  : "bg-slate-700/20 border-slate-600 text-slate-500"
                                        }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Details */}
                {step === "details" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Additional Details
                            </h2>
                        </div>

                        <div>
                            <Label htmlFor="reason">Reason for Visit</Label>
                            <Input
                                id="reason"
                                placeholder="e.g., Regular checkup, Follow-up"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="symptoms">
                                Symptoms (comma separated)
                            </Label>
                            <Input
                                id="symptoms"
                                placeholder="e.g., Fever, Headache, Cough"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === "confirm" && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-50">
                                Confirm Appointment
                            </h2>
                        </div>

                        <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Doctor
                                </p>
                                <p className="text-slate-200 font-semibold">
                                    {selectedDoctorData?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Date & Time
                                </p>
                                <p className="text-slate-200 font-semibold">
                                    {selectedDate} at {selectedTime}
                                </p>
                            </div>

                            {reason && (
                                <div>
                                    <p className="text-slate-400 text-sm">
                                        Reason
                                    </p>
                                    <p className="text-slate-200 font-semibold">
                                        {reason}
                                    </p>
                                </div>
                            )}

                            {symptoms && (
                                <div>
                                    <p className="text-slate-400 text-sm">
                                        Symptoms
                                    </p>
                                    <p className="text-slate-200 font-semibold">
                                        {symptoms}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
                {step !== "doctor" && (
                    <Button
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={isSubmitting}
                    >
                        Previous
                    </Button>
                )}

                {step !== "confirm" ? (
                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="ml-auto"
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        className="ml-auto"
                    >
                        Book Appointment
                    </Button>
                )}
            </div>
        </div>
    );
}

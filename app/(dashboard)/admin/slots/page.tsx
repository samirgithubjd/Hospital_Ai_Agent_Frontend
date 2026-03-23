"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import {
    Calendar,
    Plus,
    Trash2,
    Lock,
    Unlock,
    Edit,
    AlertCircle,
} from "lucide-react";
import {
    getAllDoctors,
    Doctor,
} from "@/lib/api/admin";
import {
    getDoctorSlots,
    createDoctorSlots,
    blockSlot,
    unblockSlot,
    bulkDeleteSlots,
    bulkUpdateSlots,
    Slot,
    SlotsResponse,
} from "@/lib/api/slots";
import { useAuth } from "@/lib/auth-context";

export default function AdminSlotsPage() {
    const router = useRouter();
    const { userRole } = useAuth();
    const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
    const [isLoading, setIsLoading] = useState(true);

    // Doctor selection
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

    // Slots data
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    // Form state for creating slots
    const [createFormData, setCreateFormData] = useState({
        date: "",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
        location: "",
        fee: 50,
    });

    // Form state for blocking slots
    const [blockFormData, setBlockFormData] = useState({
        slotId: "",
        reason: "",
    });
    const [showBlockDialog, setShowBlockDialog] = useState(false);

    // Form state for bulk update
    const [bulkUpdateData, setBulkUpdateData] = useState({
        fee: "",
        location: "",
    });
    const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);

    // Filter dates
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");

    // Redirect if not admin
    useEffect(() => {
        if (userRole && userRole !== "admin") {
            router.replace("/");
        }
    }, [userRole, router]);

    // Fetch doctors on mount
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setIsLoading(true);
            const result = await getAllDoctors(1, 100);
            setDoctors(result.data);
            if (result.data.length > 0) {
                setSelectedDoctorId(result.data[0].id);
                await fetchSlots(result.data[0].id);
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch doctors";
            console.error("Fetch doctors error:", error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSlots = async (doctorId: string) => {
        if (!doctorId) return;

        try {
            setIsLoading(true);
            const result = await getDoctorSlots(
                doctorId,
                filterStartDate,
                filterEndDate
            );
            setSlots(result.data);
            setSelectedSlots([]);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch slots";
            console.error("Fetch slots error:", error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSlots = async () => {
        if (!selectedDoctorId) {
            toast.error("Please select a doctor");
            return;
        }

        if (!createFormData.date) {
            toast.error("Please select a date");
            return;
        }

        if (!createFormData.startTime || !createFormData.endTime) {
            toast.error("Please set start and end times");
            return;
        }

        try {
            await createDoctorSlots(selectedDoctorId, {
                date: createFormData.date,
                startTime: createFormData.startTime,
                endTime: createFormData.endTime,
                slotDuration: createFormData.slotDuration,
                location: createFormData.location || undefined,
                fee: createFormData.fee,
            });

            toast.success("Slots created successfully!");
            setCreateFormData({
                date: "",
                startTime: "09:00",
                endTime: "17:00",
                slotDuration: 30,
                location: "",
                fee: 50,
            });

            // Refresh slots
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to create slots";
            console.error("Create slots error:", error);
            toast.error(message);
        }
    };

    const handleBlockSlot = async () => {
        if (!blockFormData.slotId || !blockFormData.reason) {
            toast.error("Please select a slot and provide a reason");
            return;
        }

        try {
            await blockSlot(blockFormData.slotId, blockFormData.reason);
            toast.success("Slot blocked successfully!");
            setShowBlockDialog(false);
            setBlockFormData({ slotId: "", reason: "" });
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to block slot";
            toast.error(message);
        }
    };

    const handleUnblockSlot = async (slotId: string) => {
        try {
            await unblockSlot(slotId);
            toast.success("Slot unblocked successfully!");
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to unblock slot";
            toast.error(message);
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!window.confirm("Are you sure you want to delete this slot?"))
            return;

        try {
            await bulkDeleteSlots({ slotIds: [slotId] });
            toast.success("Slot deleted successfully!");
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to delete slot";
            toast.error(message);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedSlots.length === 0) {
            toast.error("Please select slots to delete");
            return;
        }

        if (
            !window.confirm(
                `Are you sure you want to delete ${selectedSlots.length} slot(s)?`
            )
        )
            return;

        try {
            await bulkDeleteSlots({ slotIds: selectedSlots });
            toast.success(`${selectedSlots.length} slot(s) deleted successfully!`);
            setSelectedSlots([]);
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to delete slots";
            toast.error(message);
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedSlots.length === 0) {
            toast.error("Please select slots to update");
            return;
        }

        const updateData: any = { slotIds: selectedSlots };
        if (bulkUpdateData.fee) updateData.fee = parseFloat(bulkUpdateData.fee);
        if (bulkUpdateData.location) updateData.location = bulkUpdateData.location;

        if (!updateData.fee && !updateData.location) {
            toast.error("Please enter fee or location to update");
            return;
        }

        try {
            await bulkUpdateSlots(updateData);
            toast.success("Slots updated successfully!");
            setShowBulkUpdateDialog(false);
            setBulkUpdateData({ fee: "", location: "" });
            setSelectedSlots([]);
            await fetchSlots(selectedDoctorId);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to update slots";
            toast.error(message);
        }
    };

    const toggleSlotSelection = (slotId: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId)
                ? prev.filter((id) => id !== slotId)
                : [...prev, slotId]
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-2">
                    <Calendar className="w-8 h-8" />
                    Appointment Slots
                </h1>
                <p className="text-slate-400 mt-1">
                    Create and manage doctor appointment slots
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab("create")}
                    className={`px-4 py-3 font-medium transition-colors ${
                        activeTab === "create"
                            ? "text-blue-400 border-b-2 border-blue-500"
                            : "text-slate-400 hover:text-slate-300"
                    }`}
                >
                    Create Slots
                </button>
                <button
                    onClick={() => setActiveTab("manage")}
                    className={`px-4 py-3 font-medium transition-colors ${
                        activeTab === "manage"
                            ? "text-blue-400 border-b-2 border-blue-500"
                            : "text-slate-400 hover:text-slate-300"
                    }`}
                >
                    Manage Slots
                </button>
            </div>

            {/* Create Slots Tab */}
            {activeTab === "create" && (
                <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-6">
                    {isLoading ? (
                        <Skeleton className="h-96" />
                    ) : (
                        <>
                            {/* Doctor Selection */}
                            <div>
                                <Label htmlFor="doctor">Select Doctor</Label>
                                <select
                                    id="doctor"
                                    value={selectedDoctorId}
                                    onChange={(e) => {
                                        setSelectedDoctorId(e.target.value);
                                        fetchSlots(e.target.value);
                                    }}
                                    className="w-full mt-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr. {doctor.firstName}{" "}
                                            {doctor.lastName} -{" "}
                                            {doctor.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={createFormData.date}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            date: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            {/* Time Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={createFormData.startTime}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                startTime: e.target.value,
                                            })
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={createFormData.endTime}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                endTime: e.target.value,
                                            })
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Slot Duration */}
                            <div>
                                <Label htmlFor="slotDuration">
                                    Slot Duration (minutes)
                                </Label>
                                <select
                                    id="slotDuration"
                                    value={createFormData.slotDuration}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            slotDuration: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full mt-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Main Clinic, Room 101"
                                    value={createFormData.location}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            location: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            {/* Fee */}
                            <div>
                                <Label htmlFor="fee">Consultation Fee ($)</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={createFormData.fee}
                                    onChange={(e) =>
                                        setCreateFormData({
                                            ...createFormData,
                                            fee: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleCreateSlots}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Slots
                            </Button>
                        </>
                    )}
                </Card>
            )}

            {/* Manage Slots Tab */}
            {activeTab === "manage" && (
                <div className="space-y-4">
                    {/* Doctor and Date Filters */}
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="doctor-filter">Doctor</Label>
                                <select
                                    id="doctor-filter"
                                    value={selectedDoctorId}
                                    onChange={(e) => {
                                        setSelectedDoctorId(e.target.value);
                                        fetchSlots(e.target.value);
                                    }}
                                    className="w-full mt-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr. {doctor.firstName}{" "}
                                            {doctor.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="filter-start-date">
                                    Start Date
                                </Label>
                                <Input
                                    id="filter-start-date"
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) =>
                                        setFilterStartDate(e.target.value)
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="filter-end-date">
                                    End Date
                                </Label>
                                <Input
                                    id="filter-end-date"
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) =>
                                        setFilterEndDate(e.target.value)
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    onClick={() =>
                                        fetchSlots(selectedDoctorId)
                                    }
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Slot Actions */}
                    {selectedSlots.length > 0 && (
                        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-blue-300">
                                    {selectedSlots.length} slot(s) selected
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() =>
                                            setShowBulkUpdateDialog(true)
                                        }
                                        variant="secondary"
                                        size="sm"
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Update
                                    </Button>
                                    <Button
                                        onClick={handleBulkDelete}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Slots List */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-20" />
                                ))}
                        </div>
                    ) : slots.length === 0 ? (
                        <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">
                                No slots found for the selected doctor and date range
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-slate-500 transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSlots.includes(
                                            slot.id
                                        )}
                                        onChange={() =>
                                            toggleSlotSelection(slot.id)
                                        }
                                        className="w-4 h-4"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold text-slate-50">
                                                {slot.date} {slot.startTime} -{" "}
                                                {slot.endTime}
                                            </span>
                                            {slot.isBlocked && (
                                                <Badge variant="destructive">
                                                    Blocked
                                                </Badge>
                                            )}
                                            {slot.isBooked && (
                                                <Badge variant="warning">
                                                    Booked
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-400 space-y-1">
                                            {slot.location && (
                                                <p>📍 {slot.location}</p>
                                            )}
                                            <p>💰 ${slot.fee}</p>
                                            {slot.blockReason && (
                                                <p className="text-yellow-400">
                                                    Reason: {slot.blockReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {slot.isBlocked ? (
                                            <Button
                                                onClick={() =>
                                                    handleUnblockSlot(slot.id)
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                title="Unblock slot"
                                            >
                                                <Unlock className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setBlockFormData({
                                                        ...blockFormData,
                                                        slotId: slot.id,
                                                    });
                                                    setShowBlockDialog(true);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                                title="Block slot"
                                            >
                                                <Lock className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() =>
                                                handleDeleteSlot(slot.id)
                                            }
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            title="Delete slot"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Block Slot Dialog */}
            {showBlockDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96 p-6">
                        <h3 className="text-lg font-bold text-slate-50 mb-4">
                            Block Slot
                        </h3>
                        <div className="mb-4">
                            <Label htmlFor="block-reason">
                                Reason (e.g., Lunch Break)
                            </Label>
                            <Input
                                id="block-reason"
                                placeholder="Enter reason for blocking"
                                value={blockFormData.reason}
                                onChange={(e) =>
                                    setBlockFormData({
                                        ...blockFormData,
                                        reason: e.target.value,
                                    })
                                }
                                className="mt-2"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleBlockSlot}
                                className="flex-1 bg-amber-600 hover:bg-amber-700"
                            >
                                Block
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowBlockDialog(false);
                                    setBlockFormData({
                                        slotId: "",
                                        reason: "",
                                    });
                                }}
                                variant="ghost"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Bulk Update Dialog */}
            {showBulkUpdateDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96 p-6">
                        <h3 className="text-lg font-bold text-slate-50 mb-4">
                            Update {selectedSlots.length} Slot(s)
                        </h3>
                        <div className="space-y-4 mb-4">
                            <div>
                                <Label htmlFor="bulk-fee">
                                    Consultation Fee ($)
                                </Label>
                                <Input
                                    id="bulk-fee"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Leave blank to keep unchanged"
                                    value={bulkUpdateData.fee}
                                    onChange={(e) =>
                                        setBulkUpdateData({
                                            ...bulkUpdateData,
                                            fee: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bulk-location">Location</Label>
                                <Input
                                    id="bulk-location"
                                    placeholder="Leave blank to keep unchanged"
                                    value={bulkUpdateData.location}
                                    onChange={(e) =>
                                        setBulkUpdateData({
                                            ...bulkUpdateData,
                                            location: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleBulkUpdate}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                Update
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowBulkUpdateDialog(false);
                                    setBulkUpdateData({ fee: "", location: "" });
                                }}
                                variant="ghost"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

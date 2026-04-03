"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Tabs } from "@/components/ui/tabs";
import { ChevronDown, Plus, Check, X, Trash2, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import {
    createDoctor,
    getAllDoctors,
    getPendingDoctors,
    approveDoctor,
    rejectDoctor,
    deleteDoctor,
    deactivateDoctor,
} from "@/lib/api/admin";
import { useAuth } from "@/lib/auth-context";

interface Doctor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    specialization?: string;
    licenseNumber?: string;
    phone?: string;
    mobileNumber?: string;
    department?: string;
    city?: string;
    experience?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function AdminDoctorsPage() {
    const router = useRouter();
    const { user, userRole } = useAuth();
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "create">("all");
    const [isLoading, setIsLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
    const [deactivateReason, setDeactivateReason] = useState("");
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLimit] = useState(10);

    // Create doctor form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        mobileNumber: "",
        specialization: "",
        department: "",
        licenseNumber: "",
        city: "",
        experience: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Redirect if not admin
    useEffect(() => {
        if (userRole && userRole !== "admin") {
            router.replace("/");
        }
    }, [userRole, router]);

    // Fetch doctors on mount
    useEffect(() => {
        fetchDoctors();
        fetchPendingDoctors();
    }, []);

    const fetchDoctors = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const result = await getAllDoctors(page, pageLimit);
            setDoctors(result.data);
            setTotalPages(result.pagination.pages);
            setCurrentPage(page);
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch doctors";
            console.error("Fetch doctors error:", error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingDoctors = async () => {
        try {
            const result = await getPendingDoctors();
            setPendingDoctors(result);
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to fetch pending doctors";
            console.error("Fetch pending doctors error:", error);
            toast.error(message);
        }
    };

    const handleCreateDoctor = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (
            !createFormData.email ||
            !createFormData.password ||
            !createFormData.firstName
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (createFormData.password !== createFormData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (createFormData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsCreating(true);

        try {
            await createDoctor({
                email: createFormData.email,
                password: createFormData.password,
                firstName: createFormData.firstName,
                lastName: createFormData.lastName,
                phone: createFormData.phone || undefined,
                mobileNumber: createFormData.mobileNumber || undefined,
                specialization: createFormData.specialization,
                department: createFormData.department || undefined,
                licenseNumber: createFormData.licenseNumber,
                city: createFormData.city || undefined,
                experience: createFormData.experience
                    ? parseInt(createFormData.experience)
                    : undefined,
            });

            toast.success("Doctor created successfully! Awaiting approval.");

            // Reset form
            setCreateFormData({
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                phone: "",
                mobileNumber: "",
                specialization: "",
                department: "",
                licenseNumber: "",
                city: "",
                experience: "",
            });
            setShowCreateForm(false);
            setActiveTab("pending");

            // Refresh lists
            await fetchDoctors();
            await fetchPendingDoctors();
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to create doctor";
            console.error("Create doctor error:", error);
            toast.error(message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleApproveDoctor = async (doctorId: string) => {
        if (!window.confirm("Approve this doctor?")) return;

        try {
            await approveDoctor(doctorId);
            toast.success("Doctor approved successfully!");

            // Refresh lists
            await fetchDoctors();
            await fetchPendingDoctors();
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to approve doctor";
            console.error("Approve doctor error:", error);
            toast.error(message);
        }
    };

    const handleRejectDoctor = async (doctorId: string) => {
        if (!window.confirm("Reject this doctor?")) return;

        try {
            await rejectDoctor(doctorId);
            toast.success("Doctor rejected successfully!");

            // Refresh lists
            await fetchDoctors();
            await fetchPendingDoctors();
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to reject doctor";
            console.error("Reject doctor error:", error);
            toast.error(message);
        }
    };

    const handleDeleteDoctor = async (doctorId: string) => {
        if (!window.confirm("Delete this doctor? This action cannot be undone."))
            return;

        try {
            await deleteDoctor(doctorId);
            toast.success("Doctor deleted successfully!");

            // Refresh lists
            await fetchDoctors();
            await fetchPendingDoctors();
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to delete doctor";
            console.error("Delete doctor error:", error);
            toast.error(message);
        }
    };

    const handleDeactivateDoctor = async () => {
        console.log('deactivate doc clicked------->');
        console.log('selectedDoctorId:', selectedDoctorId);
        
        if (!selectedDoctorId) return;
        console.log('deactivate doc clicked-------> 258');


        try {
            await deactivateDoctor(selectedDoctorId, deactivateReason || undefined);
            toast.success("Doctor deactivated successfully!");
            setShowDeactivateDialog(false);
            setDeactivateReason("");
            setSelectedDoctorId(null);

            // Refresh lists
            await fetchDoctors();
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Failed to deactivate doctor";
            console.error("Deactivate doctor error:", error);
            toast.error(message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Doctor Management
                </h1>
                <p className="text-slate-400">
                    Create, approve, and manage doctors in the system
                </p>
                <div className="flex gap-3 mt-4">
                    <Button
                        onClick={() => router.push("/admin/slots")}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        📅 Manage Appointment Slots
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700">
                {[
                    { id: "all", label: "All Doctors", count: doctors.length },
                    {
                        id: "pending",
                        label: "Pending Approval",
                        count: pendingDoctors.length,
                    },
                    { id: "create", label: "Create New Doctor", count: 0 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() =>
                            setActiveTab(tab.id as "all" | "pending" | "create")
                        }
                        className={`px-4 py-3 border-b-2 transition-all ${
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-400"
                                : "border-transparent text-slate-400 hover:text-slate-300"
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-300">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* All Doctors Tab */}
            {activeTab === "all" && (
                <div>
                    <div className="mb-4 p-4 rounded-lg bg-slate-700/30 border border-slate-700">
                        <p className="text-sm text-slate-400">
                            Total approved doctors: <span className="text-slate-200 font-semibold">{doctors.length}</span>
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8 text-slate-400">
                            Loading doctors...
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No approved doctors yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {doctors.map((doctor) => (
                                <Card key={doctor.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-slate-50">
                                                    Dr. {doctor.firstName}{" "}
                                                    {doctor.lastName}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        doctor.isActive
                                                            ? "success"
                                                            : "destructive"
                                                    }
                                                >
                                                    {doctor.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-1">
                                                {doctor.email}
                                            </p>
                                            {doctor.specialization && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Specialization:
                                                    </span>{" "}
                                                    {doctor.specialization}
                                                </p>
                                            )}
                                            {doctor.licenseNumber && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        License:
                                                    </span>{" "}
                                                    {doctor.licenseNumber}
                                                </p>
                                            )}
                                            {doctor.phone && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Phone:
                                                    </span>{" "}
                                                    {doctor.phone}
                                                </p>
                                            )}
                                            {doctor.mobileNumber && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Mobile:
                                                    </span>{" "}
                                                    {doctor.mobileNumber}
                                                </p>
                                            )}
                                            {doctor.department && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Department:
                                                    </span>{" "}
                                                    {doctor.department}
                                                </p>
                                            )}
                                            {doctor.city && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        City:
                                                    </span>{" "}
                                                    {doctor.city}
                                                </p>
                                            )}
                                            {doctor.experience && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Experience:
                                                    </span>{" "}
                                                    {doctor.experience} years
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setSelectedDoctorId(doctor.id);
                                                    setShowDeactivateDialog(true);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                            >
                                                Deactivate
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDeleteDoctor(doctor.id)
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pending Doctors Tab */}
            {activeTab === "pending" && (
                <div>
                    <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-sm text-amber-200">
                            Pending doctor approvals: <span className="text-amber-100 font-semibold">{pendingDoctors.length}</span>
                        </p>
                    </div>

                    {pendingDoctors.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No pending doctor approvals
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingDoctors.map((doctor) => (
                                <Card
                                    key={doctor.id}
                                    className="p-4 border-amber-500/30"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-slate-50">
                                                    Dr. {doctor.firstName}{" "}
                                                    {doctor.lastName}
                                                </h3>
                                                <Badge variant="warning">
                                                    Pending
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-1">
                                                {doctor.email}
                                            </p>
                                            {doctor.specialization && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Specialization:
                                                    </span>{" "}
                                                    {doctor.specialization}
                                                </p>
                                            )}
                                            {doctor.licenseNumber && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        License:
                                                    </span>{" "}
                                                    {doctor.licenseNumber}
                                                </p>
                                            )}
                                            {doctor.phone && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Phone:
                                                    </span>{" "}
                                                    {doctor.phone}
                                                </p>
                                            )}
                                            {doctor.mobileNumber && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Mobile:
                                                    </span>{" "}
                                                    {doctor.mobileNumber}
                                                </p>
                                            )}
                                            {doctor.department && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Department:
                                                    </span>{" "}
                                                    {doctor.department}
                                                </p>
                                            )}
                                            {doctor.city && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        City:
                                                    </span>{" "}
                                                    {doctor.city}
                                                </p>
                                            )}
                                            {doctor.experience && (
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-slate-500">
                                                        Experience:
                                                    </span>{" "}
                                                    {doctor.experience} years
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleApproveDoctor(
                                                        doctor.id
                                                    )
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                size="sm"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleRejectDoctor(doctor.id)
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Doctor Tab */}
            {activeTab === "create" && (
                <div>
                    {showCreateForm ? (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-slate-50 mb-6">
                                Create New Doctor
                            </h2>

                            <form onSubmit={handleCreateDoctor} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div>
                                        <Label htmlFor="firstName">
                                            First Name *
                                        </Label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={createFormData.firstName}
                                                onChange={(e) =>
                                                    setCreateFormData({
                                                        ...createFormData,
                                                        firstName: e.target.value,
                                                    })
                                                }
                                                className="pl-10"
                                                required
                                                disabled={isCreating}
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Smith"
                                                value={createFormData.lastName}
                                                onChange={(e) =>
                                                    setCreateFormData({
                                                        ...createFormData,
                                                        lastName: e.target.value,
                                                    })
                                                }
                                                className="pl-10"
                                                disabled={isCreating}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <div className="relative mt-2">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="doctor@hospital.com"
                                            value={createFormData.email}
                                            onChange={(e) =>
                                                setCreateFormData({
                                                    ...createFormData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="pl-10"
                                            required
                                            disabled={isCreating}
                                        />
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div>
                                    <Label htmlFor="specialization">
                                        Specialization
                                    </Label>
                                    <Input
                                        id="specialization"
                                        type="text"
                                        placeholder="e.g., Cardiologist"
                                        value={createFormData.specialization}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                specialization: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <Label htmlFor="department">
                                        Department
                                    </Label>
                                    <Input
                                        id="department"
                                        type="text"
                                        placeholder="e.g., Cardiology"
                                        value={createFormData.department}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                department: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* License Number */}
                                <div>
                                    <Label htmlFor="licenseNumber">
                                        License Number
                                    </Label>
                                    <Input
                                        id="licenseNumber"
                                        type="text"
                                        placeholder="MD123456"
                                        value={createFormData.licenseNumber}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                licenseNumber: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <Label htmlFor="phone">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        value={createFormData.phone}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                phone: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <Label htmlFor="mobileNumber">
                                        Mobile Number
                                    </Label>
                                    <Input
                                        id="mobileNumber"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={createFormData.mobileNumber}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                mobileNumber: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <Label htmlFor="city">
                                        City
                                    </Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        placeholder="e.g., New York"
                                        value={createFormData.city}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                city: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <Label htmlFor="experience">
                                        Years of Experience
                                    </Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        placeholder="e.g., 10"
                                        value={createFormData.experience}
                                        onChange={(e) =>
                                            setCreateFormData({
                                                ...createFormData,
                                                experience: e.target.value,
                                            })
                                        }
                                        disabled={isCreating}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <Label htmlFor="password">
                                        Password *
                                    </Label>
                                    <div className="relative mt-2">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password (min 6 characters)"
                                            value={createFormData.password}
                                            onChange={(e) =>
                                                setCreateFormData({
                                                    ...createFormData,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="pl-10 pr-10"
                                            required
                                            disabled={isCreating}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password *
                                    </Label>
                                    <div className="relative mt-2">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm password"
                                            value={
                                                createFormData.confirmPassword
                                            }
                                            onChange={(e) =>
                                                setCreateFormData({
                                                    ...createFormData,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            className="pl-10 pr-10"
                                            required
                                            disabled={isCreating}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isCreating}
                                        className="flex-1"
                                    >
                                        Create Doctor
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                            setShowCreateForm(false)
                                        }
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <div className="text-center py-12">
                            <Button
                                onClick={() => setShowCreateForm(true)}
                                variant="primary"
                                size="lg"
                                className="gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create New Doctor
                            </Button>
                            <p className="text-slate-400 mt-4">
                                Click the button above to create a new doctor account
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Deactivate Doctor Dialog */}
            {showDeactivateDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-96 p-6">
                        <h3 className="text-lg font-bold text-slate-50 mb-4">
                            Deactivate Doctor
                        </h3>
                        <p className="text-slate-400 mb-4">
                            Are you sure you want to deactivate this doctor?
                        </p>
                        <div className="mb-4">
                            <Label htmlFor="reason">
                                Reason (Optional)
                            </Label>
                            <Input
                                id="reason"
                                type="text"
                                placeholder="Enter reason for deactivation"
                                value={deactivateReason}
                                onChange={(e) =>
                                    setDeactivateReason(e.target.value)
                                }
                                className="mt-2"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDeactivateDoctor}
                                className="flex-1 bg-amber-600 hover:bg-amber-700"
                            >
                                Deactivate
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowDeactivateDialog(false);
                                    setDeactivateReason("");
                                    setSelectedDoctorId(null);
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

            {/* Pagination Controls */}
            {activeTab === "all" && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                        onClick={() =>
                            fetchDoctors(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        variant="ghost"
                    >
                        Previous
                    </Button>
                    <span className="text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={() =>
                            fetchDoctors(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        variant="ghost"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

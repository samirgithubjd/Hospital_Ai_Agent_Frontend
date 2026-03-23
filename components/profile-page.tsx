"use client";

import { useState, useEffect } from "react";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Edit2,
    Save,
    X,
    Upload,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    changePassword,
    UserProfile,
} from "@/lib/api/profile";
import { useAuth } from "@/lib/auth-context";

interface PasswordChange {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPasswords, setShowPasswords] = useState<{
        current: boolean;
        new: boolean;
        confirm: boolean;
    }>({
        current: false,
        new: false,
        confirm: false,
    });

    const [editForm, setEditForm] = useState({
        name: "",
        phone: "",
        location: "",
        bio: "",
    });

    const [passwordForm, setPasswordForm] = useState<PasswordChange>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const data = await getUserProfile();
            setProfile(data);
            setEditForm({
                name: data.name || "",
                phone: data.phone || "",
                location: data.location || "",
                bio: data.bio || "",
            });
        } catch (error: any) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditChange = (field: string, value: string) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            const updated = await updateUserProfile(editForm);
            setProfile(updated);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error saving profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadProfilePicture(file);
            if (profile) {
                setProfile({
                    ...profile,
                    profileImage: url,
                });
            }
            toast.success("Profile picture updated!");
        } catch (error: any) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    const handlePasswordChange = async () => {
        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
        ) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            await changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowPasswordForm(false);
            toast.success("Password changed successfully!");
        } catch (error: any) {
            console.error("Error changing password:", error);
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40" />
                <div className="space-y-4">
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <Card className="p-8 bg-slate-800/30 border-slate-700 text-center">
                <UserIcon className="w-16 h-16 mx-auto text-slate-600 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-300">
                    Failed to load profile
                </h3>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-blue-400" />
                        My Profile
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage your personal information
                    </p>
                </div>
                <Badge className="text-lg px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                    {profile.role}
                </Badge>
            </div>

            {/* Profile Header Card */}
            <Card className="p-8 bg-slate-800/50 border-slate-700">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-slate-50 opacity-70" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                <Upload className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfileImageUpload}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-50 mb-2">
                            {profile.name}
                        </h2>
                        <div className="space-y-2 text-slate-400">
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {profile.email}
                            </p>
                            {profile.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {profile.phone}
                                </p>
                            )}
                            {profile.location && (
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {profile.location}
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Member since{" "}
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Edit Profile Form */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-50">
                        {isEditing ? "Edit Profile" : "Profile Information"}
                    </h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                value={editForm.name}
                                onChange={(e) =>
                                    handleEditChange("name", e.target.value)
                                }
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) =>
                                    handleEditChange("phone", e.target.value)
                                }
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Location
                            </label>
                            <Input
                                type="text"
                                value={editForm.location}
                                onChange={(e) =>
                                    handleEditChange("location", e.target.value)
                                }
                                placeholder="Enter your location"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={editForm.bio}
                                onChange={(e) =>
                                    handleEditChange("bio", e.target.value)
                                }
                                placeholder="Tell us about yourself"
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                rows={4}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleSaveProfile}
                                isLoading={isSaving}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-400">Full Name</p>
                            <p className="text-lg font-medium text-slate-50 mt-1">
                                {profile.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">Phone</p>
                            <p className="text-lg font-medium text-slate-50 mt-1">
                                {profile.phone || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">Location</p>
                            <p className="text-lg font-medium text-slate-50 mt-1">
                                {profile.location || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">Bio</p>
                            <p className="text-lg font-medium text-slate-50 mt-1">
                                {profile.bio || "No bio added"}
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Change Password Card */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Security
                    </h3>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors text-sm font-medium"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {showPasswordForm ? (
                    <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={
                                        showPasswords.current
                                            ? "text"
                                            : "password"
                                    }
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            currentPassword: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords((prev) => ({
                                            ...prev,
                                            current: !prev.current,
                                        }))
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPasswords.current ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords((prev) => ({
                                            ...prev,
                                            new: !prev.new,
                                        }))
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={
                                        showPasswords.confirm
                                            ? "text"
                                            : "password"
                                    }
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords((prev) => ({
                                            ...prev,
                                            confirm: !prev.confirm,
                                        }))
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPasswords.confirm ? (
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
                                onClick={handlePasswordChange}
                                className="flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Update Password
                            </Button>
                            <button
                                onClick={() => setShowPasswordForm(false)}
                                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400">
                        Keep your account secure by updating your password
                        regularly
                    </p>
                )}
            </Card>

            {/* Account Info */}
            <Card className="p-6 bg-slate-800/30 border-slate-700">
                <h3 className="text-lg font-bold text-slate-50 mb-4">
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-400">Account Type</p>
                        <p className="text-slate-50 font-medium capitalize mt-1">
                            {profile.role}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Email Address</p>
                        <p className="text-slate-50 font-medium mt-1">
                            {profile.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Member Since</p>
                        <p className="text-slate-50 font-medium mt-1">
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Last Updated</p>
                        <p className="text-slate-50 font-medium mt-1">
                            {new Date(profile.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

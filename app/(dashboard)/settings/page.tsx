"use client";

import React, { useState } from "react";
import { Save, Eye, EyeOff, Bell, Lock, Shield } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui/tabs";

export default function SettingsPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [theme, setTheme] = useState("dark");

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    Settings
                </h1>
                <p className="text-slate-400">
                    Manage your account and application settings.
                </p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabList>
                    <TabTrigger value="account">Account</TabTrigger>
                    <TabTrigger value="notifications">Notifications</TabTrigger>
                    <TabTrigger value="security">Security</TabTrigger>
                    <TabTrigger value="appearance">Appearance</TabTrigger>
                </TabList>

                {/* Account Settings */}
                <TabContent value="account">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your personal information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>First Name</Label>
                                        <Input
                                            defaultValue="John"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Last Name</Label>
                                        <Input
                                            defaultValue="Doe"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        defaultValue="john.doe@hospital.com"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Department</Label>
                                    <Input
                                        defaultValue="Reception"
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="primary"
                                    className="w-full md:w-auto"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabContent>

                {/* Notifications Settings */}
                <TabContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Manage how you receive alerts and notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                <div>
                                    <p className="font-medium text-slate-50">
                                        Push Notifications
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Receive push notifications for important
                                        events
                                    </p>
                                </div>
                                <Switch
                                    checked={notificationsEnabled}
                                    onCheckedChange={setNotificationsEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                <div>
                                    <p className="font-medium text-slate-50">
                                        Email Alerts
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Receive daily summary emails of
                                        activities
                                    </p>
                                </div>
                                <Switch
                                    checked={emailAlerts}
                                    onCheckedChange={setEmailAlerts}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                <div>
                                    <p className="font-medium text-slate-50">
                                        Missed Call Alerts
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Get notified when calls are missed
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                <div>
                                    <p className="font-medium text-slate-50">
                                        Emergency Notifications
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Immediate alerts for emergency calls
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabContent>

                {/* Security Settings */}
                <TabContent value="security">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your password to keep your account
                                    secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Current Password</Label>
                                    <div className="relative mt-2">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="primary"
                                    className="w-full md:w-auto"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Password
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Two-Factor Authentication
                                </CardTitle>
                                <CardDescription>
                                    Add an extra layer of security to your
                                    account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="secondary"
                                    className="w-full md:w-auto"
                                >
                                    Enable 2FA
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabContent>

                {/* Appearance Settings */}
                <TabContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Display Preferences</CardTitle>
                            <CardDescription>
                                Customize your application appearance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Theme</Label>
                                <select
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full mt-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="dark">
                                        Dark Mode (Default)
                                    </option>
                                    <option value="light">Light Mode</option>
                                    <option value="system">
                                        System Preference
                                    </option>
                                </select>
                            </div>

                            <div>
                                <Label>Compact Mode</Label>
                                <div className="mt-2">
                                    <Switch defaultChecked={false} />
                                    <p className="text-xs text-slate-400 mt-1">
                                        Use a more compact layout with reduced
                                        padding
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
                                <p>
                                    Current theme is set to{" "}
                                    <span className="font-semibold">
                                        Dark Mode
                                    </span>
                                    . This is optimal for healthcare
                                    environments to reduce eye strain.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="primary"
                                className="w-full md:w-auto"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardFooter>
                    </Card>
                </TabContent>
            </Tabs>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { login, checkHealth } from "@/lib/api/endpoints";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState<
        "checking" | "online" | "offline"
    >("checking");
    const [email, setEmail] = useState("admin@hospital.com");
    const [password, setPassword] = useState("Admin@123456");
    const [confirmPassword, setConfirmPassword] = useState("Admin@123456");

    React.useEffect(() => {
        // Check API health on mount
        checkHealth()
            .then(() => setApiStatus("online"))
            .catch(() => setApiStatus("offline"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await login({
                email,
                password,
                confirmPassword,
            });

            console.log("Login response:", response);
            console.log("Setting user:", response.user);

            // Set user first
            setUser(response.user);

            // Show success message
            toast.success("Login successful! Redirecting...");

            // Use replace to navigate and clear the login page from history
            // This ensures we don't go back to login page
            router.replace("/dashboard");
        } catch (error: any) {
            setIsLoading(false);
            const message =
                error.response?.data?.message ||
                "Login failed. Please try again.";
            console.error("Login error:", error);
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl blur-xl opacity-50" />

                {/* Content */}
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 mb-4">
                            <span className="text-xl">🏥</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-50 mb-2">
                            HospitalAI
                        </h1>
                        <p className="text-slate-400">
                            AI-Powered Reception System
                        </p>
                    </div>

                    {/* API Status */}
                    <div
                        className={`mb-6 p-3 rounded-lg text-sm flex items-center gap-2 ${
                            apiStatus === "online"
                                ? "bg-green-500/10 text-green-300 border border-green-500/30"
                                : apiStatus === "offline"
                                  ? "bg-red-500/10 text-red-300 border border-red-500/30"
                                  : "bg-slate-700/50 text-slate-400 border border-slate-600"
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                apiStatus === "online"
                                    ? "bg-green-500"
                                    : apiStatus === "offline"
                                      ? "bg-red-500"
                                      : "bg-slate-500"
                            }`}
                        />
                        {apiStatus === "online" && "API connected"}
                        {apiStatus === "offline" &&
                            "API offline - Check server"}
                        {apiStatus === "checking" && "Checking API..."}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="receptionist@hospital.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="pl-10 pr-10"
                                    required
                                    disabled={isLoading}
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
                                Confirm Password
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
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="pl-10 pr-10"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
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

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded border-slate-600 bg-slate-700/50 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                />
                                <span className="text-slate-400">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                href="#"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Info */}
                    <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <p className="text-xs text-blue-300">
                            <span className="font-semibold">
                                Backend Required:
                            </span>{" "}
                            Ensure backend is running at http://localhost:5000
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Powered by AI Voice Agents
                    </p>
                </div>
            </div>
        </div>
    );
}

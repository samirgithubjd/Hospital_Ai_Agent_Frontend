"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { login, signUpPatient, checkHealth } from "@/lib/api/endpoints";
import { useAuth } from "@/lib/auth-context";

type UserRole = "admin" | "doctor" | "patient";
type AuthMode = "signin" | "signup";

//admin login:
    //admin@hospital.com
    //admin123
//doctor login:
    //jay@gmail.com
    //123456
//patient login:
    //test@test.com
    //123456

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [authMode, setAuthMode] = useState<AuthMode>("signin");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState<
        "checking" | "online" | "offline"
    >("checking");

    // Sign in form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("admin");

    // Sign up form
    // const [userName, setUserName] = useState("mehul");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    React.useEffect(() => {
        // Check API health on mount
        checkHealth()
            .then(() => setApiStatus("online"))
            .catch(() => setApiStatus("offline"));
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await login({
                email,
                password,
                role,
            });

            console.log("Login response:", response);
            console.log("Setting user:", response.user);

            // Set user first
            setUser(response.user);

            // Show success message
            toast.success("Login successful! Redirecting...");

            // Role-based routing
            const redirectUrl = role === "admin" 
                ? "/dashboard"
                : role === "doctor"
                ? "/doctor/dashboard"
                : "/patient/dashboard";

            // Use replace to navigate and clear the login page from history
            router.replace(redirectUrl);
        } catch (error: any) {
            setIsLoading(false);
            const message =
                error.response?.data?.message ||
                "Login failed. Please try again.";
            console.error("Login error:", error);
            toast.error(message);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!signUpEmail || !signUpPassword || !firstName) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (signUpPassword !== signUpConfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (signUpPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await signUpPatient({
                email: signUpEmail,
                password: signUpPassword,
                confirmPassword: signUpConfirmPassword,
                username: firstName + " " + lastName,
                firstName,
                lastName,
                phone,
            });

            console.log("Sign up response:", response);
            console.log("Setting user:", response.user);

            // Set user first
            setUser(response.user);

            // Show success message
            toast.success("Sign up successful! Redirecting...");

            // Redirect to patient dashboard
            router.replace("/patient/dashboard");
        } catch (error: any) {
            setIsLoading(false);
            const message =
                error.response?.data?.message ||
                "Sign up failed. Please try again.";
            console.error("Sign up error:", error);
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

                    {/* Auth Mode Tabs */}
                    <div className="mb-6 flex gap-2 bg-slate-700/30 p-1 rounded-lg border border-slate-700">
                        <button
                            type="button"
                            onClick={() => setAuthMode("signin")}
                            className={`flex-1 py-2 px-4 rounded-md transition-all font-medium text-sm ${
                                authMode === "signin"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:text-slate-300"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode("signup")}
                            className={`flex-1 py-2 px-4 rounded-md transition-all font-medium text-sm ${
                                authMode === "signup"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:text-slate-300"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Sign In Form */}
                    {authMode === "signin" && (
                        <form onSubmit={handleSignIn} className="space-y-5">
                            {/* Role Selection */}
                            <div>
                                <Label htmlFor="role">Login As</Label>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {(["admin", "doctor", "patient"] as UserRole[]).map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm capitalize ${
                                                role === r
                                                    ? "bg-blue-600 text-white border border-blue-500"
                                                    : "bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700"
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@hospital.com"
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Button>
                        </form>
                    )}

                    {/* Sign Up Form - Patients Only */}
                    {authMode === "signup" && (
                        <form onSubmit={handleSignUp} className="space-y-5">
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
                                Patient accounts can be created here
                            </div>

                            {/* First Name */}
                            <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="pl-10"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="signUpEmail">Email Address *</Label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="signUpEmail"
                                        type="email"
                                        placeholder="user@hospital.com"
                                        value={signUpEmail}
                                        onChange={(e) => setSignUpEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative mt-2">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-4"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="signUpPassword">Password *</Label>
                                <div className="relative mt-2">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="signUpPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password (min 6 characters)"
                                        value={signUpPassword}
                                        onChange={(e) =>
                                            setSignUpPassword(e.target.value)
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
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <div className="relative mt-2">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={signUpConfirmPassword}
                                        onChange={(e) =>
                                            setSignUpConfirmPassword(e.target.value)
                                        }
                                        className="pl-10 pr-10"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Create Patient Account
                            </Button>
                        </form>
                    )}

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

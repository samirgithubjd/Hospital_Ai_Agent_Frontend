import client from "./client";
import { setToken, setUserRole, setUserId } from "./auth";

export interface LoginPayload {
    contact: string; // email or phone number
    password: string;
}

export interface SignUpPatientPayload {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    age: number;
    medicalHistory: string;
}

export interface CreateAdminPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface CreateDoctorPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    specialization: string;
    department: string;
    licenseNumber: string;
    city: string;
    experience: number;
    mobileNumber: string;
}

export interface AdminUser {
    id: string;
    email: string;
    role?: "admin" | "doctor" | "patient";
}

export interface BackendLoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        admin?: AdminUser;
        doctor?: AdminUser;
        patient?: AdminUser;
        user?: {
            id: string;
            email: string;
            role: "admin" | "doctor" | "patient";
        };
    };
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
        role: "admin" | "doctor" | "patient";
    };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/auth/login", {
        contact: payload.contact,
        password: payload.password,
    });

    const { token } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.admin || 
                     response.data.data.doctor || 
                     response.data.data.patient;

    if (!userData) {
        throw new Error("No user data in response");
    }

    if (token) {
        setToken(token);
        // Also store role and userId in cookies for middleware
        const userRole = userData.role || "admin";
        setUserRole(userRole);
        setUserId(userData.id);
    }

    return {
        token,
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.email?.split("@")[0],
            role: userData.role || "admin",
        },
    };
}

export async function signUpPatient(payload: SignUpPatientPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/api/auth/register", {
        email: payload.email,
        username: payload.username,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        age: payload.age,
        medicalHistory: payload.medicalHistory,
    });

    const { token } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.patient;

    if (!userData) {
        throw new Error("No user data in response");
    }

    // Don't set token yet - user must verify email first
    // if (token) {
    //     setToken(token);
    //     const userRole = "patient";
    //     setUserRole(userRole);
    //     setUserId(userData.id);
    // }

    return {
        token: "",
        user: {
            id: userData.id,
            email: userData.email,
            name: payload.firstName || userData.email?.split("@")[0],
            role: "patient",
        },
    };
}

export async function createAdmin(payload: CreateAdminPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/api/admin/create-admin", payload);

    const { token } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.admin;

    if (!userData) {
        throw new Error("No user data in response");
    }

    if (token) {
        setToken(token);
        const userRole = "admin";
        setUserRole(userRole);
        setUserId(userData.id);
    }

    return {
        token,
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.email?.split("@")[0],
            role: "admin",
        },
    };
}

export async function createDoctor(payload: CreateDoctorPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/api/admin/create-doctor", payload);

    const { token } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.doctor;

    if (!userData) {
        throw new Error("No user data in response");
    }

    if (token) {
        setToken(token);
        const userRole = "doctor";
        setUserRole(userRole);
        setUserId(userData.id);
    }

    return {
        token,
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.email?.split("@")[0],
            role: "doctor",
        },
    };
}

export async function verifyEmail(token: string): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/auth/verify-email", {
        token,
    });

    const { token: authToken } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.patient;

    if (!userData) {
        throw new Error("No user data in response");
    }

    if (authToken) {
        setToken(authToken);
        const userRole = "patient";
        setUserRole(userRole);
        setUserId(userData.id);
    }

    return {
        token: authToken,
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.email?.split("@")[0],
            role: "patient",
        },
    };
}

export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    const response = await client.post("/auth/resend-verification", {
        email,
    });

    return response.data;
}

export async function checkHealth(): Promise<{ status: string }> {
    const response = await client.get("/health");
    console.log('health-------------->', response);
    
    return response.data;
}

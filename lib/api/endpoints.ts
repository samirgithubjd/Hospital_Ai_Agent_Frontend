import client from "./client";
import { setToken, setUserRole, setUserId } from "./auth";

export interface LoginPayload {
    email: string;
    password: string;
    role?: "admin" | "doctor" | "patient";
}

export interface SignUpPayload {
    email: string;
    password: string;
    confirmPassword: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
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
        email: payload.email,
        password: payload.password,
        role: payload.role || "admin",
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

export async function signUpPatient(payload: SignUpPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/auth/register", {
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        username: payload.username,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        role: "patient",
    });

    const { token } = response.data.data;
    const userData = response.data.data.user || 
                     response.data.data.patient;

    if (!userData) {
        throw new Error("No user data in response");
    }

    if (token) {
        setToken(token);
        // Also store role and userId in cookies for middleware
        const userRole = "patient";
        setUserRole(userRole);
        setUserId(userData.id);
    }

    return {
        token,
        user: {
            id: userData.id,
            email: userData.email,
            name: payload.firstName || userData.email?.split("@")[0],
            role: "patient",
        },
    };
}

export async function checkHealth(): Promise<{ status: string }> {
    const response = await client.get("/health");
    console.log('health-------------->', response);
    
    return response.data;
}

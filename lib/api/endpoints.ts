import client from "./client";
import { setToken } from "./auth";

export interface LoginPayload {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AdminUser {
    id: string;
    email: string;
}

export interface BackendLoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        admin: AdminUser;
    };
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await client.post<BackendLoginResponse>("/auth/login", {
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
    });

    const { token, admin } = response.data.data;

    if (token) {
        setToken(token);
    }

    return {
        token,
        user: {
            id: admin.id,
            email: admin.email,
            name: admin.email.split("@")[0], // Use email prefix as name if not provided
        },
    };
}

export async function checkHealth(): Promise<{ status: string }> {
    const response = await client.get("/health");
    return response.data;
}

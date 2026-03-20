import client from "./client";

export interface CreateDoctorPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    specialization: string;
    licenseNumber: string;
}

export interface Doctor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    specialization: string;
    licenseNumber: string;
    isActive: boolean;
    createdAt?: string;
}

export interface ApprovalResponse {
    success: boolean;
    message: string;
    data?: Doctor;
}

// Admin: Create doctor
export async function createDoctor(data: CreateDoctorPayload): Promise<Doctor> {
    const response = await client.post<any>("/admin/create-doctor", data);
    const responseData = response.data.data || response.data;
    return responseData;
}

// Admin: Get all doctors (pending and approved)
export async function getAllDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/admin/all-doctors");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

// Admin: Get pending doctors
export async function getPendingDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/admin/doctors/pending");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

// Admin: Approve doctor
export async function approveDoctor(doctorId: string): Promise<ApprovalResponse> {
    const response = await client.put<any>(`/admin/doctors/${doctorId}/approve`);
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
        data: data.data,
    };
}

// Admin: Reject doctor
export async function rejectDoctor(doctorId: string): Promise<ApprovalResponse> {
    const response = await client.put<any>(`/admin/doctors/${doctorId}/reject`);
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
        data: data.data,
    };
}

// Admin: Delete doctor
export async function deleteDoctor(doctorId: string): Promise<ApprovalResponse> {
    const response = await client.delete<any>(`/admin/doctors/${doctorId}`);
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
    };
}

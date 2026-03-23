import client from "./client";

export interface CreateDoctorPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    mobileNumber?: string;
    specialization: string;
    department?: string;
    licenseNumber: string;
    city?: string;
    experience?: number;
}

export interface Doctor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    mobileNumber?: string;
    specialization: string;
    department?: string;
    licenseNumber: string;
    city?: string;
    experience?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/** Raw doctor object from backend (using MongoDB _id) */
interface RawDoctor {
    _id?: string;
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    mobileNumber?: string;
    specialization: string;
    department?: string;
    licenseNumber: string;
    city?: string;
    experience?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Transform raw doctor from API to frontend format
function transformDoctor(rawDoctor: RawDoctor): Doctor {
    return {
        ...rawDoctor,
        id: rawDoctor.id || rawDoctor._id || "",
    };
}

export interface ApprovalResponse {
    success: boolean;
    message: string;
    data?: Doctor;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// Admin: Create doctor
export async function createDoctor(data: CreateDoctorPayload): Promise<Doctor> {
    const response = await client.post<any>("/admin/create-doctor", data);
    const responseData = response.data.data || response.data;
    return transformDoctor(responseData);
}

// Admin: Get all doctors with pagination
export async function getAllDoctors(
    page: number = 1,
    limit: number = 10
): Promise<PaginatedResponse<Doctor>> {
    const response = await client.get<any>("/admin/all-doctors", {
        params: { page, limit },
    });
    const data = response.data.data || response.data;
    
    const doctorsArray = Array.isArray(data) ? data : data.data || [];
    return {
        data: doctorsArray.map(transformDoctor),
        pagination: data.pagination || {
            total: doctorsArray.length,
            page,
            limit,
            pages: 1,
        },
    };
}

// Admin: Get pending doctors
export async function getPendingDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/admin/doctors/pending");
    const data = response.data.data || response.data;
    const doctorsArray = Array.isArray(data) ? data : [];
    return doctorsArray.map(transformDoctor);
}

// Admin: Approve doctor
export async function approveDoctor(doctorId: string): Promise<ApprovalResponse> {
    const response = await client.put<any>(`/admin/doctors/${doctorId}/approve`);
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
        data: data.data ? transformDoctor(data.data) : undefined,
    };
}

// Admin: Reject doctor
export async function rejectDoctor(
    doctorId: string,
    reason?: string
): Promise<ApprovalResponse> {
    const response = await client.post<any>(`/admin/doctors/${doctorId}/reject`, {
        reason: reason || "",
    });
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
        data: data.data ? transformDoctor(data.data) : undefined,
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

// Admin: Deactivate doctor
export async function deactivateDoctor(
    doctorId: string,
    reason?: string
): Promise<ApprovalResponse> {
    const response = await client.put<any>(
        `/admin/doctors/${doctorId}/deactivate`,
        { reason: reason || "" }
    );
    const data = response.data;
    return {
        success: data.success,
        message: data.message,
        data: data.data ? transformDoctor(data.data) : undefined,
    };
}

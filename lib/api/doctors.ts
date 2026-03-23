import client from "./client";

export interface Doctor {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    specialization?: string;
    email: string;
    phoneNumber?: string;
    phone?: string;
    mobileNumber?: string;
    department?: string;
    city?: string;
    experience?: number;
    profileImage?: string;
}

/** Raw doctor object from backend (using MongoDB _id) */
interface RawDoctor {
    _id?: string;
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    specialization?: string;
    email: string;
    phoneNumber?: string;
    phone?: string;
    mobileNumber?: string;
    department?: string;
    city?: string;
    experience?: number;
    profileImage?: string;
}

// Transform raw doctor from API to frontend format
function transformDoctor(rawDoctor: RawDoctor): Doctor {
    return {
        ...rawDoctor,
        id: rawDoctor.id || rawDoctor._id || "",
        name: rawDoctor.name || `${rawDoctor.firstName || ""} ${rawDoctor.lastName || ""}`.trim(),
    };
}

export interface AvailableSlot {
    time: string;
    available: boolean;
}

export interface PaginatedDoctors {
    data: Doctor[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface ActiveDoctorsFilters {
    page?: number;
    limit?: number;
    specialization?: string;
}

export async function getDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/all-doctors");
    const data = response.data.data || response.data;
    const doctorsArray = Array.isArray(data) ? data : [];
    return doctorsArray.map(transformDoctor);
}

export async function getDoctorById(id: string): Promise<Doctor> {
    const response = await client.get<any>(`/doctors/${id}`);
    const data = response.data.data || response.data;
    return transformDoctor(data);
}

export async function getDoctorAvailableSlots(
    doctorId: string,
    date: string,
): Promise<AvailableSlot[]> {
    const response = await client.get<any>(
        `/slots/doctors/${doctorId}/available-slots`,
        {
            params: { date },
        },
    );
    const data = response.data.data || response.data;
    
    // Handle the new response structure with slots array
    if (data && data.slots && Array.isArray(data.slots)) {
        return data.slots.map((slot: any) => ({
            time: slot.startTime,
            available: slot.isAvailable !== false,
        }));
    }
    
    // Fallback to old format if data is already an array
    if (Array.isArray(data)) {
        return data;
    }
    
    return [];
}

/**
 * Get all active doctors
 * GET /admin/active-doctors
 */
export async function getActiveDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/admin/active-doctors");
    const data = response.data.data || response.data;
    const doctorsArray = Array.isArray(data) ? data : [];
    return doctorsArray.map(transformDoctor);
}

/**
 * Get active doctors with pagination and optional filters
 * GET /admin/active-doctors?page=1&limit=10&specialization=Cardiology
 */
export async function getActiveDoctorsPaginated(
    filters?: ActiveDoctorsFilters
): Promise<PaginatedDoctors> {
    const params: any = {};
    
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.specialization) params.specialization = filters.specialization;

    const response = await client.get<any>("/admin/active-doctors", { params });
    const data = response.data.data || response.data;

    const doctorsArray = Array.isArray(data) ? data : data?.data || [];
    
    return {
        data: doctorsArray.map(transformDoctor),
        pagination: data?.pagination || {
            total: doctorsArray.length,
            page: filters?.page || 1,
            limit: filters?.limit || 10,
            pages: Math.ceil(doctorsArray.length / (filters?.limit || 10)),
        },
    };
}

/**
 * Get active doctors by specialization
 * GET /admin/active-doctors?specialization=Cardiology
 */
export async function getActiveDoctorsBySpecialization(
    specialization: string
): Promise<Doctor[]> {
    const response = await client.get<any>("/admin/active-doctors", {
        params: { specialization },
    });
    const data = response.data.data || response.data;
    const doctorsArray = Array.isArray(data) ? data : [];
    return doctorsArray.map(transformDoctor);
}

/**
 * Get all unique specializations from active doctors
 * Useful for filter dropdowns
 */
export async function getAvailableSpecializations(): Promise<string[]> {
    try {
        const doctors = await getActiveDoctors();
        const specializations = new Set(
            doctors
                .map((d) => d.specialization)
                .filter((s) => s !== undefined && s !== null)
        );
        return Array.from(specializations).sort();
    } catch (error) {
        console.error("Error fetching specializations:", error);
        return [];
    }
}

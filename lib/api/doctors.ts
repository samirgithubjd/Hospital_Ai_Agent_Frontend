import client from "./client";

export interface Doctor {
    id: string;
    name: string;
    specialization?: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
}

export interface AvailableSlot {
    time: string;
    available: boolean;
}

export async function getDoctors(): Promise<Doctor[]> {
    const response = await client.get<any>("/all-doctors");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

export async function getDoctorById(id: string): Promise<Doctor> {
    const response = await client.get<any>(`/doctors/${id}`);
    const data = response.data.data || response.data;
    return data;
}

export async function getDoctorAvailableSlots(
    doctorId: string,
    date: string,
): Promise<AvailableSlot[]> {
    const response = await client.get<any>(
        `/doctors/${doctorId}/available-slots`,
        {
            params: { date },
        },
    );
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

import client from "./client";

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    appointmentTime: string;
    status: "pending" | "confirmed" | "cancelled";
    reason: string;
}

export interface AppointmentsResponse {
    appointments: Appointment[];
    total: number;
    pending: number;
    confirmed: number;
}

export async function getAppointments(): Promise<AppointmentsResponse> {
    const response = await client.get<any>("/appointments");
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return {
        appointments: data.appointments || [],
        total: data.total || 0,
        pending: data.pending || 0,
        confirmed: data.confirmed || 0,
    };
}

export async function getAppointmentById(id: string): Promise<Appointment> {
    const response = await client.get<any>(`/appointments/${id}`);
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return data;
}

export async function createAppointment(
    data: Omit<Appointment, "id">,
): Promise<Appointment> {
    const response = await client.post<any>("/appointments", data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return responseData;
}

export async function updateAppointment(
    id: string,
    data: Partial<Appointment>,
): Promise<Appointment> {
    const response = await client.put<any>(`/appointments/${id}`, data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return responseData;
}

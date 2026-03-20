import client from "./client";

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId?: string;
    doctorName: string;
    appointmentTime: string;
    date?: string;
    time?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed" | "booked";
    reason: string;
    symptoms?: string[];
    diagnosis?: string;
}

export interface AppointmentsResponse {
    appointments: Appointment[];
    total: number;
    pending: number;
    confirmed: number;
}

export interface DashboardStats {
    totalAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
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

// Patient-specific appointments
export async function getPatientAppointments(): Promise<Appointment[]> {
    const response = await client.get<any>("/appointments/patient/my-appointments");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

export async function getPatientStats(): Promise<DashboardStats> {
    const response = await client.get<any>("/appointments/patient/stats");
    const data = response.data.data || response.data;
    return {
        totalAppointments: data.totalAppointments || 0,
        upcomingAppointments: data.upcomingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
    };
}

export async function bookAppointment(appointmentData: {
    doctorId: string;
    date: string;
    time: string;
    reason?: string;
    symptoms?: string[];
}): Promise<Appointment> {
    const response = await client.post<any>("/appointments/patient/book", appointmentData);
    const data = response.data.data || response.data;
    return data;
}

export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
    const response = await client.put<any>(`/appointments/${appointmentId}/cancel`);
    const data = response.data.data || response.data;
    return data;
}

export async function rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string,
): Promise<Appointment> {
    const response = await client.put<any>(`/appointments/${appointmentId}/reschedule`, {
        date: newDate,
        time: newTime,
    });
    const data = response.data.data || response.data;
    return data;
}

// Doctor-specific appointments
export async function getDoctorAppointments(): Promise<Appointment[]> {
    const response = await client.get<any>("/appointments/doctor/my-appointments");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

export async function getDoctorStats(): Promise<DashboardStats> {
    const response = await client.get<any>("/appointments/doctor/stats");
    const data = response.data.data || response.data;
    return {
        totalAppointments: data.totalAppointments || 0,
        upcomingAppointments: data.upcomingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
    };
}

// Admin-specific appointments
export async function getAdminAppointments(): Promise<Appointment[]> {
    const response = await client.get<any>("/appointments/admin/all");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

export async function getAdminStats(): Promise<DashboardStats> {
    const response = await client.get<any>("/appointments/admin/stats");
    const data = response.data.data || response.data;
    return {
        totalAppointments: data.totalAppointments || 0,
        upcomingAppointments: data.upcomingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
    };
}

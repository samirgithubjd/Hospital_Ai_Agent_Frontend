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
    status: "pending" | "confirmed" | "cancelled" | "completed" | "booked" | "scheduled";
    reason: string;
    symptoms?: string | string[];
    diagnosis?: string;
    duration?: number;
    isEmergency?: boolean;
}

export interface RawAppointment {
    _id?: string;
    id?: string;
    patientId: {
        _id?: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
    } | string;
    doctorId: {
        _id: string;
        firstName: string;
        lastName: string;
        specialization?: string;
        department?: string;
        email?: string;
    } | string;
    appointmentDate: string;
    appointmentTime: string;
    duration?: number;
    symptoms?: string;
    reason?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

// Transform raw appointment from backend to frontend format
function transformAppointment(rawAppointment: RawAppointment): Appointment {
    const appointmentId = rawAppointment.id || rawAppointment._id || "";
    
    // Extract patient details
    let patientName = "Unknown";
    let patientIdString = "";
    
    if (typeof rawAppointment.patientId === "object") {
        patientName = rawAppointment.patientId.name ||
            `${rawAppointment.patientId.firstName || ""} ${rawAppointment.patientId.lastName || ""}`.trim();
        patientIdString = rawAppointment.patientId.id || rawAppointment.patientId._id || "";
    } else {
        patientIdString = rawAppointment.patientId || "";
    }
    
    // Extract doctor details
    let doctorName = "Unknown";
    let doctorIdString = "";
    
    if (typeof rawAppointment.doctorId === "object") {
        doctorName = `${rawAppointment.doctorId.firstName || ""} ${rawAppointment.doctorId.lastName || ""}`.trim();
        doctorIdString = rawAppointment.doctorId._id || "";
    } else {
        doctorIdString = rawAppointment.doctorId || "";
    }
    
    // Format date - convert ISO date to readable format
    let formattedDate = "";
    try {
        const dateObj = new Date(rawAppointment.appointmentDate);
        formattedDate = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        formattedDate = rawAppointment.appointmentDate;
    }
    
    return {
        id: appointmentId,
        patientId: patientIdString,
        patientName: patientName,
        doctorId: doctorIdString,
        doctorName: doctorName,
        appointmentTime: rawAppointment.appointmentTime,
        date: formattedDate,
        time: rawAppointment.appointmentTime,
        status: (rawAppointment.status as any) || "scheduled",
        reason: rawAppointment.reason || "N/A",
        symptoms: rawAppointment.symptoms || "",
        duration: rawAppointment.duration || 30,
        isEmergency: (rawAppointment as any).isEmergency || false,
    };
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
    return transformAppointment(data);
}

export async function createAppointment(
    data: Omit<Appointment, "id">,
): Promise<Appointment> {
    const response = await client.post<any>("/appointments", data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return transformAppointment(responseData);
}

export async function updateAppointment(
    id: string,
    data: Partial<Appointment>,
): Promise<Appointment> {
    const response = await client.put<any>(`/appointments/${id}`, data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return transformAppointment(responseData);
}

// Patient-specific appointments
export async function getPatientAppointments(): Promise<Appointment[]> {
    const response = await client.get<any>("/appointments/patient/my-appointments");
    const data = response.data.data || response.data;
    const appointments = Array.isArray(data) ? data : [];
    
    // Transform all appointments from backend format to frontend format
    return appointments.map((apt) => transformAppointment(apt));
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
    appointmentDate: string;
    appointmentTime: string;
    symptoms?: string | string[];
    duration?: number;
    isEmergency?: boolean;
}): Promise<Appointment> {
    // Convert symptoms array to string if needed
    const symptomString = Array.isArray(appointmentData.symptoms)
        ? appointmentData.symptoms.join(", ")
        : appointmentData.symptoms;
    
    const payload = {
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        symptoms: symptomString,
        duration: appointmentData.duration || 30,
        isEmergency: appointmentData.isEmergency || false,
    };
    
    const response = await client.post<any>("/appointments/patient/book", payload);
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
    const appointments = Array.isArray(data) ? data : [];
    
    // Transform all appointments from backend format to frontend format
    return appointments.map((apt) => transformAppointment(apt));
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

import client from "./client";

export interface Patient {
    id: string;
    name: string;
    age: number;
    phoneNumber: string;
    symptoms: string[];
    isEmergency: boolean;
    lastCallDate?: string;
}

export async function getPatients(): Promise<Patient[]> {
    const response = await client.get<any>("/patients");
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
}

export async function getPatientById(id: string): Promise<Patient> {
    const response = await client.get<any>(`/patients/${id}`);
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return data;
}

export async function createPatient(
    data: Omit<Patient, "id">,
): Promise<Patient> {
    const response = await client.post<any>("/patients", data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return responseData;
}

export async function updatePatient(
    id: string,
    data: Partial<Patient>,
): Promise<Patient> {
    const response = await client.put<any>(`/patients/${id}`, data);
    // Handle both direct response and wrapped response
    const responseData = response.data.data || response.data;
    return responseData;
}

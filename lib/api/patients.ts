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
    
    if (!Array.isArray(data)) {
        return [];
    }
    
    // Map API response to Patient interface
    return data.map((patient: any) => ({
        id: patient._id || patient.id,
        name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
        age: patient.age || 0,
        phoneNumber: patient.phone || "",
        symptoms: patient.symptoms || [],
        isEmergency: patient.isEmergency || false,
        lastCallDate: patient.lastCallDate || patient.updatedAt,
    }));
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

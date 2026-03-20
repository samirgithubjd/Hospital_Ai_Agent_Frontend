import client from "./client";

export interface Call {
    id: string;
    patientName: string;
    phoneNumber: string;
    callTime: string;
    duration: number;
    status: "completed" | "missed" | "ongoing";
    recordingUrl?: string;
    transcript?: string;
}

export interface CallsResponse {
    calls: Call[];
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
}

export async function getCalls(): Promise<CallsResponse> {
    const response = await client.get<any>("/calls");
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return {
        calls: data.calls || [],
        total: data.total || 0,
        completed: data.completed || 0,
        missed: data.missed || 0,
        ongoing: data.ongoing || 0,
    };
}

export async function getCallById(id: string): Promise<Call> {
    const response = await client.get<any>(`/calls/${id}`);
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return data;
}

export async function getCallStats(): Promise<{
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
}> {
    const response = await client.get<any>("/calls/stats");
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return data;
}

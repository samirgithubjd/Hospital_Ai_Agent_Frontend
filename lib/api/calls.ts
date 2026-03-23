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

// Raw API response interface
export interface RawCall {
    _id: string;
    patientId: string | null;
    phoneNumber: string;
    fromNumber: string;
    duration: number;
    status: string;
    callType: string;
    areaCode: string;
    emergencyLevel: string;
    isEmergency: boolean;
    appointmentBooked: boolean;
    followUpRequired: boolean;
    createdAt: string;
    __v: number;
}

// Transform raw API response to Call interface
function transformCall(rawCall: RawCall): Call {
    return {
        id: rawCall._id,
        patientName: rawCall.phoneNumber || "Unknown",
        phoneNumber: rawCall.phoneNumber,
        callTime: rawCall.createdAt,
        duration: rawCall.duration || 0,
        status: (rawCall.status as "completed" | "missed" | "ongoing") || "completed",
        recordingUrl: undefined,
        transcript: undefined,
    };
}

export async function getCalls(): Promise<CallsResponse> {
    const response = await client.get<any>("/calls");
    // Get data from response
    const data = response.data.data || response.data;
    
    // Handle array response directly
    const callsArray = Array.isArray(data) ? data : data.calls || [];
    
    // Transform raw calls to Call interface
    const transformedCalls = callsArray.map((rawCall: RawCall) => transformCall(rawCall));
    
    // Calculate stats
    const total = transformedCalls.length;
    const completed = transformedCalls.filter((c) => c.status === "completed").length;
    const missed = transformedCalls.filter((c) => c.status === "missed").length;
    const ongoing = transformedCalls.filter((c) => c.status === "ongoing").length;
    
    return {
        calls: transformedCalls,
        total,
        completed,
        missed,
        ongoing,
    };
}

export async function getCallById(id: string): Promise<Call> {
    const response = await client.get<any>(`/calls/${id}`);
    // Handle both direct response and wrapped response
    const data = response.data.data || response.data;
    return transformCall(data);
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
